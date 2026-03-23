import React, { useState } from "react";
import { Link } from "react-router-dom";

function Topnav() {
  const [query, setquery] = useState("");
  console.log(query);

  return (
    <div className="w-full h-[10vh] relative flex justify-start items-center ml-[20%] overflow-visible">
      {/* Search Icon */}
      <i className="text-2xl text-zinc-400 hover:text-white transition-all duration-300 hover:scale-110 ri-search-ai-line"></i>

      {/* Input */}
      <input
        onChange={(e) => setquery(e.target.value)}
        value={query}
        className="w-[45%] mx-5 px-6 py-3 text-lg rounded-full 
        bg-zinc-800/80 backdrop-blur-md text-white placeholder:text-zinc-400 
        outline-none border border-zinc-700 
        focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 
        transition-all duration-300 shadow-lg focus:scale-[1.02]"
        type="text"
        placeholder="Search anything..."
      />

      {/* Close Icon */}
      {query.length > 0 && (
        <i
          onClick={() => setquery("")}
          className="text-2xl text-zinc-400 hover:text-red-400 cursor-pointer 
          transition-all duration-300 hover:rotate-90 hover:scale-110 ri-close-line"
        ></i>
      )}

      {/* Dropdown */}
      <div
        className={`absolute w-[45%] max-h-[50vh] 
        bg-zinc-900/90 backdrop-blur-xl 
        top-[115%] left-[3%] 
        overflow-y-auto overscroll-contain
        rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] 
        border border-zinc-700/50 
        transition-all duration-300 origin-top z-50
        ${
          query.length > 0
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        {/* Item */}
        {/* <Link
          className="group flex items-center gap-4 px-5 py-3 text-zinc-300 
        hover:bg-zinc-800/70 hover:text-white 
        transition-all duration-300 border-b border-zinc-800"
        >
          <img
            className="w-12 h-14 object-cover rounded-md 
            group-hover:scale-105 transition duration-300"
            src="https://via.placeholder.com/50"
            alt=""
          />

          <span className="text-sm font-medium tracking-wide">Movie Name</span>
        </Link> */}
      </div>
    </div>
  );
}

export default Topnav;
