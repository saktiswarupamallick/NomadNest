import {useEffect, useState} from "react";
import {useParams, Navigate} from "react-router-dom";
import axios from "axios";
import PhotosUploader from "../PhotosUploader.jsx";
import AddressLink from "../AddressLink";

export default function ExperiencesFormPage() {
  const {id} = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState(60);
  const [maxGroupSize, setMaxGroupSize] = useState(10);
  const [photos, setPhotos] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [tags, setTags] = useState([]);
  const [includedItems, setIncludedItems] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [cancellationPolicy, setCancellationPolicy] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [newItem, setNewItem] = useState('');
  const [newRequirement, setNewRequirement] = useState('');

  useEffect(() => {
    if (!id) return;
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/experiences/${id}`).then(response => {
      const {data} = response;
      setTitle(data.title);
      setDescription(data.description);
      setType(data.type);
      setAddress(data.address);
      setPrice(data.price);
      setDuration(data.duration);
      setMaxGroupSize(data.maxGroupSize);
      setPhotos(data.photos);
      const formattedAvailability = data.availability?.map(slot => ({
        ...slot,
        date: slot.date ? new Date(slot.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      })) || [];
      setAvailability(formattedAvailability);
      setTags(data.tags);
      setIncludedItems(data.includedItems);
      setRequirements(data.requirements);
      setCancellationPolicy(data.cancellationPolicy);
    });
  }, [id]);

  const handleSearchLocation = async () => {
    if (!searchQuery) return;
    
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchQuery)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      
      if (response.data.results.length > 0) {
        const result = response.data.results[0];
        setSearchResults(response.data.results);
        setAddress(result.formatted_address);
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  const handleAddAvailability = () => {
    const date = new Date();
    setAvailability(prev => [...prev, {
      date: date.toISOString().split('T')[0],
      slots: maxGroupSize
    }]);
  };

  const handleRemoveAvailability = (index) => {
    setAvailability(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = (ev) => {
    ev.preventDefault();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addIncludedItem = (ev) => {
    ev.preventDefault();
    if (newItem && !includedItems.includes(newItem)) {
      setIncludedItems([...includedItems, newItem]);
      setNewItem('');
    }
  };

  const removeIncludedItem = (itemToRemove) => {
    setIncludedItems(includedItems.filter(item => item !== itemToRemove));
  };

  const addRequirement = (ev) => {
    ev.preventDefault();
    if (newRequirement && !requirements.includes(newRequirement)) {
      setRequirements([...requirements, newRequirement]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (requirementToRemove) => {
    setRequirements(requirements.filter(req => req !== requirementToRemove));
  };

  const saveExperience = async (ev) => {
    ev.preventDefault();
    const experienceData = {
      title,
      description,
      type,
      address,
      price: Number(price),
      duration: Number(duration),
      maxGroupSize: Number(maxGroupSize),
      photos,
      availability,
      tags,
      includedItems,
      requirements,
      cancellationPolicy: cancellationPolicy || 'Standard cancellation policy applies.'
    };

    try {
      if (id) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/experiences/${id}`, experienceData);
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/experiences`, experienceData);
      }
      setRedirect(true);
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Failed to save experience. Please try again.');
    }
  };

  if (redirect) {
    return <Navigate to={'/experiences'} />;
  }

  return (
    <div className="min-h-screen bg-black text-[#F4F1DE]">
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <form onSubmit={saveExperience} className="space-y-8">
          <h1 className="text-3xl font-bold mb-8">
            {id ? 'Edit Experience' : 'Create New Experience'}
          </h1>

          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            
            <div>
              <label className="block text-sm text-[#F4F1DE]/60 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={ev => setTitle(ev.target.value)}
                placeholder="Experience title"
                className="w-full px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE]"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-[#F4F1DE]/60 mb-2">Type</label>
              <select
                value={type}
                onChange={ev => setType(ev.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE]"
                required
              >
                <option value="">Select type</option>
                <option value="tour">Tour</option>
                <option value="activity">Activity</option>
                <option value="food">Food & Dining</option>
                <option value="transportation">Transportation</option>
                <option value="cultural">Cultural</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-[#F4F1DE]/60 mb-2">Description</label>
              <textarea
                value={description}
                onChange={ev => setDescription(ev.target.value)}
                placeholder="Describe your experience"
                className="w-full px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE] min-h-[120px]"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-[#F4F1DE]/60 mb-2">Location</label>
              <input
                type="text"
                value={address}
                onChange={ev => setAddress(ev.target.value)}
                placeholder="Enter location"
                className="w-full px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE]"
                required
              />
              {address && (
                <div className="mt-2">
                  <AddressLink className="text-[#F4F1DE]">
                    {address}
                  </AddressLink>
                </div>
              )}
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <div>
                <label className="block text-sm text-[#F4F1DE]/60 mb-2">Price (per person)</label>
                <input
                  type="number"
                  value={price}
                  onChange={ev => setPrice(ev.target.value)}
                  placeholder="Price"
                  className="w-full px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[#F4F1DE]/60 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={ev => setDuration(ev.target.value)}
                  placeholder="Duration"
                  className="w-full px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[#F4F1DE]/60 mb-2">Max Group Size</label>
                <input
                  type="number"
                  value={maxGroupSize}
                  onChange={ev => setMaxGroupSize(ev.target.value)}
                  placeholder="Max group size"
                  className="w-full px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Photos</h2>
            <PhotosUploader addedPhotos={photos} onChange={setPhotos} />
          </div>

          {/* Availability */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Availability</h2>
              <button
                type="button"
                onClick={handleAddAvailability}
                className="px-4 py-2 bg-[#F4F1DE] text-black rounded-lg hover:bg-[#E5E2D1] transition-colors"
              >
                Add Date
              </button>
            </div>

            <div className="space-y-2">
              {availability.map((slot, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-black/20 rounded-lg border border-[#F4F1DE]/10">
                  <div className="flex-1">
                    <label className="block text-sm text-[#F4F1DE]/60 mb-1">Date</label>
                    <input
                      type="date"
                      value={slot.date}
                      onChange={ev => {
                        const newAvailability = [...availability];
                        newAvailability[index].date = ev.target.value;
                        setAvailability(newAvailability);
                      }}
                      className="w-full px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-[#F4F1DE]/60 mb-1">Available Slots</label>
                    <input
                      type="number"
                      value={slot.slots}
                      onChange={ev => {
                        const newAvailability = [...availability];
                        newAvailability[index].slots = ev.target.value;
                        setAvailability(newAvailability);
                      }}
                      min="1"
                      max={maxGroupSize}
                      placeholder="Number of slots"
                      className="w-full px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE]"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveAvailability(index)}
                      className="p-2 text-red-500 hover:text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors"
                      title="Remove this date"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              {availability.length === 0 && (
                <div className="text-center py-8 text-[#F4F1DE]/60 border-2 border-dashed border-[#F4F1DE]/20 rounded-lg">
                  <p>No availability dates added yet.</p>
                  <p className="text-sm mt-1">Click "Add Date" to set when your experience is available.</p>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Tags</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={ev => setNewTag(ev.target.value)}
                placeholder="Add a tag"
                className="flex-1 px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE]"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-[#F4F1DE] text-black rounded-lg hover:bg-[#E5E2D1] transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-2 bg-[#F4F1DE]/10 px-3 py-1 rounded-full">
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-red-500 hover:text-red-400"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Included Items */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Included Items</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={newItem}
                onChange={ev => setNewItem(ev.target.value)}
                placeholder="Add an included item"
                className="flex-1 px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE]"
              />
              <button
                type="button"
                onClick={addIncludedItem}
                className="px-4 py-2 bg-[#F4F1DE] text-black rounded-lg hover:bg-[#E5E2D1] transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {includedItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2 bg-[#F4F1DE]/10 px-3 py-1 rounded-full">
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => removeIncludedItem(item)}
                    className="text-red-500 hover:text-red-400"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Requirements</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={newRequirement}
                onChange={ev => setNewRequirement(ev.target.value)}
                placeholder="Add a requirement"
                className="flex-1 px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE]"
              />
              <button
                type="button"
                onClick={addRequirement}
                className="px-4 py-2 bg-[#F4F1DE] text-black rounded-lg hover:bg-[#E5E2D1] transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2 bg-[#F4F1DE]/10 px-3 py-1 rounded-full">
                  <span>{req}</span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(req)}
                    className="text-red-500 hover:text-red-400"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Cancellation Policy</h2>
            <textarea
              value={cancellationPolicy}
              onChange={ev => setCancellationPolicy(ev.target.value)}
              placeholder="Enter your cancellation policy"
              className="w-full px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE] min-h-[120px]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#F4F1DE] text-black rounded-lg hover:bg-[#E5E2D1] transition-colors font-semibold"
          >
            {id ? 'Update Experience' : 'Create Experience'}
          </button>
        </form>
      </div>
    </div>
  );
} 