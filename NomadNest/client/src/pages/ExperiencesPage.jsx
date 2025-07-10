import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Image from "../Image.jsx";

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    date: ''
  });

  useEffect(() => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/experiences?${queryParams}`).then(response => {
      setExperiences(response.data);
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Filters */}
        <div className="pt-10 pb-6 grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <select
            value={filters.type}
            onChange={ev => setFilters(prev => ({...prev, type: ev.target.value}))}
            className="px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE]"
          >
            <option value="">All Types</option>
            <option value="tour">Tours</option>
            <option value="activity">Activities</option>
            <option value="food">Food & Dining</option>
            <option value="transportation">Transportation</option>
            <option value="cultural">Cultural</option>
          </select>

          <input
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={ev => setFilters(prev => ({...prev, location: ev.target.value}))}
            className="px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE]"
          />

          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={ev => setFilters(prev => ({...prev, minPrice: ev.target.value}))}
            className="px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE]"
          />

          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={ev => setFilters(prev => ({...prev, maxPrice: ev.target.value}))}
            className="px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE]"
          />

          <input
            type="date"
            value={filters.date}
            onChange={ev => setFilters(prev => ({...prev, date: ev.target.value}))}
            className="px-4 py-2 rounded-lg bg-black border border-[#F4F1DE]/20 text-[#F4F1DE]"
          />
        </div>

        {/* Experiences Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {experiences.length > 0 && experiences.map(experience => (
            <Link to={`/experience/${experience._id}`} key={experience._id} className="group">
              <div className="bg-black/50 rounded-2xl overflow-hidden border border-[#F4F1DE]/20 hover:border-[#F4F1DE]/40 transition-all duration-300">
                <div className="aspect-video relative">
                  {experience.photos?.[0] && (
                    <Image
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      src={experience.photos[0]}
                      alt=""
                    />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 rounded-full text-xs bg-[#F4F1DE]/10 text-[#F4F1DE]">
                      {experience.type}
                    </span>
                    <span className="text-sm text-[#F4F1DE]/60">
                      {experience.duration} mins
                    </span>
                  </div>
                  <h2 className="font-bold text-lg text-[#F4F1DE] truncate">
                    {experience.title}
                  </h2>
                  <p className="text-sm text-[#F4F1DE]/60 truncate">
                    {experience.address}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold text-lg text-[#F4F1DE]">
                      ${experience.price}
                    </span>
                    <span className="text-sm text-[#F4F1DE]/60">
                      per person
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 