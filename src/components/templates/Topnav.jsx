import React, { useState } from "react";
import { Link } from "react-router-dom";

function Topnav() {
  const [query, setquery]= useState("")
  return (
    <div className="w-full h-[10vh] relative  flex justify-center items-center ">
      <i class="text-3xl text-zinc-400 ri-search-ai-line"></i>
      <input
      onChange={()=> setquery(e.target.value)}
        className="w-[50%] mx-10 p-5 text-xl outline-none border-none text-white "
        type="text"
        placeholder="Search any Thing "
      />
      <i class="text-3xl text-zinc-400 ri-close-line"></i>

      <div className="absolute  w-[50%] h-[50vh] bg-zinc-200 top-[90%] overflow-auto">
        <Link className="inline-block font-semibold hover:text-black  hover:bg-zinc-300 duration-300 text-zinc-600 w-[100%] p-10 flex justify-start  items-center border-2 border-zinc-100">
          <img src="" alt="" />
          <span>Movi name </span>
        </Link>
        <Link className="inline-block font-semibold hover:text-black  hover:bg-zinc-300 duration-300 text-zinc-600 w-[100%] p-10 flex justify-start  items-center border-2 border-zinc-100">
          <img src="" alt="" />
          <span>Movi name </span>
        </Link>
        <Link className="inline-block font-semibold hover:text-black  hover:bg-zinc-300 duration-300 text-zinc-600 w-[100%] p-10 flex justify-start  items-center border-2 border-zinc-100">
          <img src="" alt="" />
          <span>Movi name </span>
        </Link>
        <Link className="inline-block font-semibold hover:text-black  hover:bg-zinc-300 duration-300 text-zinc-600 w-[100%] p-10 flex justify-start  items-center border-2 border-zinc-100">
          <img src="" alt="" />
          <span>Movi name </span>
        </Link>
        <Link className="inline-block font-semibold hover:text-black  hover:bg-zinc-300 duration-300 text-zinc-600 w-[100%] p-10 flex justify-start  items-center border-2 border-zinc-100">
          <img src="" alt="" />
          <span>Movi name </span>
        </Link>
        <Link className="inline-block font-semibold hover:text-black  hover:bg-zinc-300 duration-300 text-zinc-600 w-[100%] p-10 flex justify-start  items-center border-2 border-zinc-100">
          <img src="" alt="" />
          <span>Movi name </span>
        </Link>
        <Link className="inline-block font-semibold hover:text-black  hover:bg-zinc-300 duration-300 text-zinc-600 w-[100%] p-10 flex justify-start  items-center border-2 border-zinc-100">
          <img src="" alt="" />
          <span>Movi name </span>
        </Link>
        <Link className="inline-block font-semibold hover:text-black  hover:bg-zinc-300 duration-300 text-zinc-600 w-[100%] p-10 flex justify-start  items-center border-2 border-zinc-100">
          <img src="" alt="" />
          <span>Movi name </span>
        </Link>
      </div>
    </div>
  );
}

export default Topnav;
