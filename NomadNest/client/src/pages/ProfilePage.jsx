import {useContext, useEffect, useState} from "react";
import {UserContext} from "../UserContext.jsx";
import {Link, Navigate, useParams} from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";

export default function ProfilePage() {
  const [redirect,setRedirect] = useState(null);
  const {ready,user,setUser} = useContext(UserContext);
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    if (ready) {
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/experiences`).then(response => {
        setExperiences(response.data);
      });
    }
  }, [ready]);

  let {subpage} = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  async function logout() {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/logout`);
    setRedirect('/');
    setUser(null);
  }

  if (!ready) {
    return 'Loading...';
  }

  if (ready && !user && !redirect) {
    return <Navigate to={'/login'} />
  }

  if (redirect) {
    return <Navigate to={redirect} />
  }

  return (
    <div className="min-h-screen bg-black text-[#F4F1DE]">
      <AccountNav />
      {subpage === 'profile' && (
        <div className="text-center max-w-lg mx-auto">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="bg-[#F4F1DE] text-black rounded-full p-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-left">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-[#F4F1DE]/60">{user.email}</p>
            </div>
          </div>
          <button onClick={logout} className="max-w-sm mt-4 py-2 px-4 bg-[#F4F1DE] text-black rounded-lg hover:bg-[#E5E2D1] transition-colors">
            Logout
          </button>
        </div>
      )}
      {subpage === 'experiences' && (
        <div className="max-w-[1400px] mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">My Experiences</h1>
            <Link
              to="/account/experiences/new"
              className="px-4 py-2 bg-[#F4F1DE] text-black rounded-lg hover:bg-[#E5E2D1] transition-colors"
            >
              Add New Experience
            </Link>
          </div>
          
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {experiences.map(experience => (
              <Link
                key={experience._id}
                to={`/account/experiences/${experience._id}`}
                className="bg-black/50 rounded-2xl overflow-hidden border border-[#F4F1DE]/20 hover:border-[#F4F1DE]/40 transition-all duration-300"
              >
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 rounded-full text-xs bg-[#F4F1DE]/10">
                      {experience.type}
                    </span>
                    <span className="text-sm text-[#F4F1DE]/60">
                      {experience.duration} mins
                    </span>
                  </div>
                  <h2 className="font-bold text-lg truncate">
                    {experience.title}
                  </h2>
                  <p className="text-sm text-[#F4F1DE]/60 truncate">
                    {experience.location.address}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold">
                      ${experience.price}
                    </span>
                    <span className="text-sm text-[#F4F1DE]/60">
                      per person
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}