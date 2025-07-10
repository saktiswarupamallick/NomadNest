import {Link} from "react-router-dom";
import {useContext} from "react";
import {UserContext} from "./UserContext.jsx";

export default function Header() {
  const {user} = useContext(UserContext);
  return (
    <header className="flex justify-between bg-black p-4">
      <Link to={'/'} className="flex items-center gap-2 group">
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#F4F1DE] group-hover:scale-110 transition-transform duration-200">
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
          </svg>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#F4F1DE] rounded-full animate-pulse"></div>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-2xl text-[#F4F1DE] tracking-tight">NomadNest</span> 
          <span className="text-xs text-[#F4F1DE]/70">Find your perfect stay</span>
        </div>
      </Link>
      
      <div className="flex items-center gap-4">
        <Link to="/experiences" className="text-[#F4F1DE] hover:text-[#F4F1DE]/80 transition-colors duration-200">
          Experiences
        </Link>
        
        <Link to={user?'/account':'/login'} className="flex items-center gap-2 border border-[#F4F1DE] rounded-full py-2 px-4 hover:bg-[#F4F1DE] hover:text-black transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#F4F1DE]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <div className="bg-[#F4F1DE] text-black rounded-full border border-[#F4F1DE] overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 relative top-1">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
          </div>
          {!!user && (
            <div className="text-[#F4F1DE]">
              {user.name}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}