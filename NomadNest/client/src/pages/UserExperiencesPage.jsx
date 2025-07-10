import { Link } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "../Image";

export default function UserExperiencesPage() {
  const [experiences, setExperiences] = useState([]);
  
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user-experiences`).then(({ data }) => {
      setExperiences(data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <AccountNav />
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl text-[#F4F1DE] font-semibold">My Experiences</h1>
          <Link
            className="inline-flex gap-2 items-center bg-[#F4F1DE] text-black py-2 px-6 rounded-full hover:bg-[#E5E2D1] transition-colors duration-200 font-medium"
            to={'/account/experiences/new'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
            Add new experience
          </Link>
        </div>
        <div className="grid gap-6">
          {experiences.length > 0 && experiences.map(experience => (
            <Link
              to={'/account/experiences/' + experience._id}
              key={experience._id}
              className="flex gap-6 bg-black/50 p-6 rounded-2xl border border-[#F4F1DE]/20 hover:border-[#F4F1DE]/40 transition-all duration-300"
            >
              <div className="w-48 h-48 flex-shrink-0">
                <Image src={experience.photos[0]} className="w-full h-full object-cover rounded-xl" />
              </div>
              <div className="grow">
                <h2 className="text-2xl text-[#F4F1DE] font-semibold mb-2">{experience.title}</h2>
                <p className="text-[#F4F1DE]/60 mb-4">{experience.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 