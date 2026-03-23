import axios from "../../utils/Axios";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function Sidenav() {
  const GetSearch = async () => {
    try {
      const d= await axios.get("/search/multi")
      console.log(d)
    } catch (error) {
      console.log("Error:",error)
    }
  };

  useEffect(()=>{
GetSearch()
  },[])

  return (
    <div
      className="w-[260px] h-screen p-6 
    bg-#1F1E24 backdrop-blur-xl 
    border-r border-white/20 
    shadow-2xl rounded-r-3xl"
    >
      {/* Logo */}
      <h1 className="text-2xl flex items-center text-white font-semibold mb-6">
        <i className="text-[#6556CD] ri-film-line mr-2 text-3xl drop-shadow-lg"></i>
        <span className="tracking-wide">SCSDB</span>
      </h1>

      {/* Section 1 */}
      <nav className="flex flex-col text-zinc-300 text-[15px] gap-2">
        <h1 className="text-white font-semibold text-sm tracking-widest uppercase mt-6 mb-3 opacity-70">
          New Feeds
        </h1>

        <Link
          className="group flex items-center gap-3 px-4 py-3 rounded-2xl 
        bg-white/5 backdrop-blur-md 
        hover:bg-gradient-to-r hover:from-[#6556CD] hover:to-blue-500 
        hover:text-white 
        transition-all duration-300 ease-in-out 
        hover:scale-[1.05] hover:shadow-xl"
        >
          <i className="mr-2 text-lg ri-fire-fill transition-all duration-300 group-hover:rotate-6 group-hover:scale-125"></i>
          Trending
        </Link>

        <Link
          className="group flex items-center gap-3 px-4 py-3 rounded-2xl 
        bg-white/5 backdrop-blur-md 
        hover:bg-gradient-to-r hover:from-[#6556CD] hover:to-blue-500 
        hover:text-white 
        transition-all duration-300 ease-in-out 
        hover:scale-[1.05] hover:shadow-xl"
        >
          <i className="mr-2 text-lg ri-bard-fill transition-all duration-300 group-hover:rotate-6 group-hover:scale-125"></i>
          Popular
        </Link>

        <Link
          className="group flex items-center gap-3 px-4 py-3 rounded-2xl 
        bg-white/5 backdrop-blur-md 
        hover:bg-gradient-to-r hover:from-[#6556CD] hover:to-blue-500 
        hover:text-white 
        transition-all duration-300 ease-in-out 
        hover:scale-[1.05] hover:shadow-xl"
        >
          <i className="mr-2 text-lg ri-star-smile-fill transition-all duration-300 group-hover:rotate-6 group-hover:scale-125"></i>
          Top Rated
        </Link>

        <Link
          className="group flex items-center gap-3 px-4 py-3 rounded-2xl 
        bg-white/5 backdrop-blur-md 
        hover:bg-gradient-to-r hover:from-[#6556CD] hover:to-blue-500 
        hover:text-white 
        transition-all duration-300 ease-in-out 
        hover:scale-[1.05] hover:shadow-xl"
        >
          <i className="mr-2 text-lg ri-clapperboard-fill transition-all duration-300 group-hover:rotate-6 group-hover:scale-125"></i>
          Movies
        </Link>

        <Link
          className="group flex items-center gap-3 px-4 py-3 rounded-2xl 
        bg-white/5 backdrop-blur-md 
        hover:bg-gradient-to-r hover:from-[#6556CD] hover:to-blue-500 
        hover:text-white 
        transition-all duration-300 ease-in-out 
        hover:scale-[1.05] hover:shadow-xl"
        >
          <i className="mr-2 text-lg ri-tv-2-fill transition-all duration-300 group-hover:rotate-6 group-hover:scale-125"></i>
          TV Shows
        </Link>

        <Link
          className="group flex items-center gap-3 px-4 py-3 rounded-2xl 
        bg-white/5 backdrop-blur-md 
        hover:bg-gradient-to-r hover:from-[#6556CD] hover:to-blue-500 
        hover:text-white 
        transition-all duration-300 ease-in-out 
        hover:scale-[1.05] hover:shadow-xl"
        >
          <i className="mr-2 text-lg ri-team-line transition-all duration-300 group-hover:rotate-6 group-hover:scale-125"></i>
          People
        </Link>
      </nav>

      <hr className="my-6 border-white/20" />

      {/* Section 2 */}
      <nav className="flex flex-col text-zinc-300 text-[15px] gap-2">
        <h1 className="text-white font-semibold text-sm tracking-widest uppercase mb-3 opacity-70">
          Website Information
        </h1>

        <Link
          className="group flex items-center gap-3 px-4 py-3 rounded-2xl 
        bg-white/5 backdrop-blur-md 
        hover:bg-gradient-to-r hover:from-[#6556CD] hover:to-blue-500 
        hover:text-white 
        transition-all duration-300 ease-in-out 
        hover:scale-[1.05] hover:shadow-xl"
        >
          <i className="mr-2 text-lg ri-file-info-fill transition-all duration-300 group-hover:rotate-6 group-hover:scale-125"></i>
          About SCSDB
        </Link>

        <Link
          className="group flex items-center gap-3 px-4 py-3 rounded-2xl 
        bg-white/5 backdrop-blur-md 
        hover:bg-gradient-to-r hover:from-[#6556CD] hover:to-blue-500 
        hover:text-white 
        transition-all duration-300 ease-in-out 
        hover:scale-[1.05] hover:shadow-xl"
        >
          <i className="mr-2 text-lg ri-contacts-fill transition-all duration-300 group-hover:rotate-6 group-hover:scale-125"></i>
          Contact Us
        </Link>
      </nav>
    </div>
  );
}

export default Sidenav;
