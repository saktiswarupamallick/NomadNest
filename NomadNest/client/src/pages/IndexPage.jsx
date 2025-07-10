import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Image from "../Image.jsx";

export default function IndexPage() {
  const [places,setPlaces] = useState([]);
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/places`).then(response => {
      setPlaces(response.data);
    });
  }, []);
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className=" pt-10 grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {places.length > 0 && places.map(place => (
            <Link to={'/place/'+place._id} key={place._id} className="group">
              <div className="bg-black/50 rounded-2xl overflow-hidden border border-[#F4F1DE]/20 hover:border-[#F4F1DE]/40 transition-all duration-300">
                <div className="aspect-square relative">
                  {place.photos?.[0] && (
                    <Image 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" 
                      src={place.photos?.[0]} 
                      alt=""
                    />
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-bold text-lg text-[#F4F1DE] truncate">{place.title}</h2>
                  <h3 className="text-sm text-[#F4F1DE]/60 truncate">{place.address}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold text-lg text-[#F4F1DE]">${place.price}</span>
                    <span className="text-sm text-[#F4F1DE]/60">per night</span>
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
