import PhotosUploader from "../PhotosUploader.jsx";
import Perks from "../Perks.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import AccountNav from "../AccountNav";
import {Navigate, useParams} from "react-router-dom";

export default function PlacesFormPage() {
  const {id} = useParams();
  const [title,setTitle] = useState('');
  const [address,setAddress] = useState('');
  const [addedPhotos,setAddedPhotos] = useState([]);
  const [description,setDescription] = useState('');
  const [perks,setPerks] = useState([]);
  const [extraInfo,setExtraInfo] = useState('');
  const [checkIn,setCheckIn] = useState('');
  const [checkOut,setCheckOut] = useState('');
  const [maxGuests,setMaxGuests] = useState(1);
  const [price,setPrice] = useState(100);
  const [redirect,setRedirect] = useState(false);
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/places/`+id).then(response => {
       const {data} = response;
       setTitle(data.title);
       setAddress(data.address);
       setAddedPhotos(data.photos);
       setDescription(data.description);
       setPerks(data.perks);
       setExtraInfo(data.extraInfo);
       setCheckIn(data.checkIn);
       setCheckOut(data.checkOut);
       setMaxGuests(data.maxGuests);
       setPrice(data.price);
    });
  }, [id]);
  function inputHeader(text) {
    return (
      <h2 className="text-2xl mt-8 text-[#F4F1DE] font-semibold">{text}</h2>
    );
  }
  function inputDescription(text) {
    return (
      <p className="text-gray-400 text-sm mt-1">{text}</p>
    );
  }
  function preInput(header,description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function savePlace(ev) {
    ev.preventDefault();
    const placeData = {
      title, address, addedPhotos,
      description, perks, extraInfo,
      checkIn, checkOut, maxGuests, price,
    };
    if (id) {
      // update
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/places`, {
        id, ...placeData
      });
      setRedirect(true);
    } else {
      // new place
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/places`, placeData);
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={'/account/places'} />
  }

  return (
    <div className="min-h-screen bg-black">
      <AccountNav />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl text-center mb-12 text-[#F4F1DE] font-bold">
          {id ? 'Edit your place' : 'Add a new place'}
        </h1>
        <form onSubmit={savePlace} className="space-y-8">
          {preInput('Title', 'Title for your place. should be short and catchy as in advertisement')}
          <input 
            type="text" 
            value={title} 
            onChange={ev => setTitle(ev.target.value)} 
            placeholder="title, for example: My lovely apt"
            className="w-full px-4 py-3 rounded-lg bg-black border border-[#F4F1DE] text-[#F4F1DE] placeholder-gray-500 focus:outline-none focus:border-[#F4F1DE]"
          />

          {preInput('Address', 'Address to this place')}
          <input 
            type="text" 
            value={address} 
            onChange={ev => setAddress(ev.target.value)}
            placeholder="address"
            className="w-full px-4 py-3 rounded-lg bg-black border border-[#F4F1DE] text-[#F4F1DE] placeholder-gray-500 focus:outline-none focus:border-[#F4F1DE]"
          />

          {preInput('Photos','more = better')}
          <div className="bg-black/50 p-6 rounded-lg border border-[#F4F1DE]/20">
            <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
          </div>

          {preInput('Description','description of the place')}
          <textarea 
            value={description} 
            onChange={ev => setDescription(ev.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-black border border-[#F4F1DE] text-[#F4F1DE] placeholder-gray-500 focus:outline-none focus:border-[#F4F1DE] min-h-[120px]"
          />

          {preInput('Perks','select all the perks of your place')}
          <div className="grid mt-2 gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <Perks selected={perks} onChange={setPerks} />
          </div>

          {preInput('Extra info','house rules, etc')}
          <textarea 
            value={extraInfo} 
            onChange={ev => setExtraInfo(ev.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-black border border-[#F4F1DE] text-[#F4F1DE] placeholder-gray-500 focus:outline-none focus:border-[#F4F1DE] min-h-[120px]"
          />

          {preInput('Check in&out times','add check in and out times, remember to have some time window for cleaning the room between guests')}
          <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="text-[#F4F1DE] font-medium mb-2">Check in time</h3>
              <input 
                type="text"
                value={checkIn}
                onChange={ev => setCheckIn(ev.target.value)}
                placeholder="14"
                className="w-full px-4 py-3 rounded-lg bg-black border border-[#F4F1DE] text-[#F4F1DE] placeholder-gray-500 focus:outline-none focus:border-[#F4F1DE]"
              />
            </div>
            <div>
              <h3 className="text-[#F4F1DE] font-medium mb-2">Check out time</h3>
              <input 
                type="text"
                value={checkOut}
                onChange={ev => setCheckOut(ev.target.value)}
                placeholder="11"
                className="w-full px-4 py-3 rounded-lg bg-black border border-[#F4F1DE] text-[#F4F1DE] placeholder-gray-500 focus:outline-none focus:border-[#F4F1DE]"
              />
            </div>
            <div>
              <h3 className="text-[#F4F1DE] font-medium mb-2">Max number of guests</h3>
              <input 
                type="number" 
                value={maxGuests}
                onChange={ev => setMaxGuests(ev.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black border border-[#F4F1DE] text-[#F4F1DE] placeholder-gray-500 focus:outline-none focus:border-[#F4F1DE]"
              />
            </div>
            <div>
              <h3 className="text-[#F4F1DE] font-medium mb-2">Price per night</h3>
              <input 
                type="number" 
                value={price}
                onChange={ev => setPrice(ev.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black border border-[#F4F1DE] text-[#F4F1DE] placeholder-gray-500 focus:outline-none focus:border-[#F4F1DE]"
              />
            </div>
          </div>

          <button 
            className="w-full py-4 bg-[#F4F1DE] text-black rounded-lg hover:bg-[#E5E2D1] transition duration-200 font-semibold text-lg mt-8"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}