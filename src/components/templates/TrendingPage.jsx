import React from "react";
import { useNavigate } from "react-router-dom";
import Topnav from './Topnav';
import DropdownFilter from "./DropdownFilter";

function TrendingPage() {
  const navigate = useNavigate();
  return (
    <div className=" p-[5%] w-screen h-screen">
      <div className="w-full flex items-center  ">
        <h1 className="text-2xl text-zinc-400 font-semibold ">
          <i
            onClick={() => navigate(-1)}
            class="text-[#6556CD] ri-arrow-go-back-line"
          ></i>{" "}
          Trending
        </h1>
        <Topnav/>
        <DropdownFilter/>
      </div>





      
    </div>
  );
}

export default TrendingPage;
