import React, { useEffect, useState, useRef } from "react";
import Sidenav from "./templates/Sidenav";
import Topnav from "./templates/Topnav";
import axios from "../utils/Axios";
import Header from "./templates/Header";
import HorizontalCard from "./templates/HorizontalCard";
import gsap from "gsap";

function Home() {
  document.title = "SCSDB | Homepage";

  const [wallpaper, setwallpaper] = useState(null);
  const [tranding, settranding] = useState(null);
  const [indianMovies, setIndianMovies] = useState(null);

  const GetHeaderWallpaper = async () => {
    try {
      const { data } = await axios.get("/trending/all/day");
      let random =
        data.results[Math.floor(Math.random() * data.results.length)];
      setwallpaper(random);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const GetTranding = async () => {
    try {
      const { data } = await axios.get("/trending/all/day");
      settranding(data.results);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const GetIndianMovies = async () => {
    try {
      const { data } = await axios.get(
        "/discover/movie?with_original_language=hi&sort_by=popularity.desc&region=IN",
      );
      setIndianMovies(data.results);
    } catch (error) {
      console.log("Error fetching Indian movies:", error);
    }
  };

  useEffect(() => {
    GetHeaderWallpaper();
    GetTranding();
    GetIndianMovies();
  }, []);

  /* 🔥 PREMIUM LOADER */
  if (!wallpaper) return <PremiumLoader />;

  return (
    <div className="flex w-full min-h-screen bg-[#0c0b13] font-[Outfit]">
      <Sidenav />

      <div className="flex-1 ml-[258px] max-md:ml-0 overflow-y-auto">
        <div className="sticky top-0 z-50 bg-gradient-to-b from-[#0c0b13]/90 to-transparent pb-2">
          <Topnav />
        </div>

        <div>
          <Header data={wallpaper} />

          <HorizontalCard
            data={tranding}
            title="Trending"
            highlight="Today"
            accentColor="#6556CD"
          />

          <HorizontalCard
            data={indianMovies}
            title="Bollywood"
            highlight="Popular"
            accentColor="#e8473f"
          />
        </div>
      </div>
    </div>
  );
}

/* 💎 Premium Loader Component */
function PremiumLoader() {
  const dotsRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      dotsRef.current,
      { y: 0, opacity: 0.3 },
      {
        y: -12,
        opacity: 1,
        duration: 0.5,
        stagger: 0.2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      },
    );
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-[#0c0b13] text-white">
      {/* ♾️ Infinity Loader */}
      <div className="relative w-[100px] h-[50px] mb-6">
        <div className="absolute w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 shadow-lg animate-[infinity_2.5s_ease-in-out_infinite]" />
        <div className="absolute w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 shadow-lg animate-[infinity_2.5s_ease-in-out_infinite_1.25s]" />
      </div>

      {/* Text */}
      <h2 className="text-sm tracking-widest text-zinc-400 mb-4">
        FETCHING MOVIES
      </h2>

      {/* GSAP Dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((_, i) => (
          <div
            key={i}
            ref={(el) => (dotsRef.current[i] = el)}
            className="w-2 h-2 bg-purple-500 rounded-full"
          />
        ))}
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes infinity {
          0%, 100% { left: 0; top: 50%; transform: translate(0, -50%); }
          25% { left: 42px; top: 0; }
          50% { left: 84px; top: 50%; }
          75% { left: 42px; top: 100%; }
        }
      `}</style>
    </div>
  );
}

export default Home;
