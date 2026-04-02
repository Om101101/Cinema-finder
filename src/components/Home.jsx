import React, { useEffect, useState, useRef } from "react";
import Sidenav from "./templates/Sidenav";
import Topnav from "./templates/Topnav";
import axios from "../utils/Axios";
import Header from "./templates/Header";
import HorizontalCard from "./templates/HorizontalCard";
import gsap from "gsap";

function Home() {
  document.title = "SCSDB | Homepage";

  const [wallpaper, setWallpaper] = useState(null);
  const [trending, setTrending] = useState(null);
  const [indianMovies, setIndianMovies] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [trendingRes, indianRes] = await Promise.all([
          axios.get("/trending/all/day"),
          axios.get(
            "/discover/movie?with_original_language=hi&sort_by=popularity.desc&region=IN",
          ),
        ]);

        const results = trendingRes.data.results;
        setWallpaper(results[Math.floor(Math.random() * results.length)]);
        setTrending(results);
        setIndianMovies(indianRes.data.results);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(true);
      }
    };

    fetchAll();
  }, []);

  if (error)
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#0c0b13] text-zinc-400 text-sm tracking-widest">
        FAILED TO LOAD — CHECK CONNECTION
      </div>
    );

  if (!wallpaper) return <PremiumLoader />;

  return (
    <div className="flex w-full min-h-screen bg-[#0c0b13] font-[Outfit]">
      <Sidenav />

      <div className="flex-1 ml-[258px] max-md:ml-0 overflow-y-auto">
        <div className="sticky top-0 z-50 bg-gradient-to-b from-[#0c0b13]/90 to-transparent pb-2">
          <Topnav />
        </div>

        <Header data={wallpaper} />

        <HorizontalCard
          data={trending}
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
  );
}

function PremiumLoader() {
  const pathRef = useRef(null);
  const dotRef = useRef(null);
  const dotsRef = useRef([]);

  useEffect(() => {
    const path = pathRef.current;
    const length = path.getTotalLength();

    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
    });

    gsap.to(dotRef.current, {
      motionPath: {
        path: pathRef.current,
        align: pathRef.current,
        autoRotate: false,
      },
      duration: 2.5,
      ease: "none",
      repeat: -1,
    });

    gsap.fromTo(
      dotsRef.current,
      { y: 0, opacity: 0.3 },
      {
        y: -10,
        opacity: 1,
        duration: 0.45,
        stagger: 0.15,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      },
    );
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-[#0c0b13] text-white gap-5">
      <svg
        width="120"
        height="60"
        viewBox="0 0 120 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={pathRef}
          d="M60 30 C60 10, 20 10, 20 30 C20 50, 60 50, 60 30 C60 10, 100 10, 100 30 C100 50, 60 50, 60 30"
          stroke="url(#loaderGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle ref={dotRef} r="5" fill="#a78bfa" />
        <defs>
          <linearGradient
            id="loaderGrad"
            x1="20"
            y1="30"
            x2="100"
            y2="30"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#ec4899" />
            <stop offset="0.5" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
      </svg>

      <p className="text-[11px] tracking-[0.3em] text-zinc-500 uppercase">
        Fetching Movies
      </p>

      <div className="flex gap-2">
        {[0, 1, 2].map((_, i) => (
          <div
            key={i}
            ref={(el) => (dotsRef.current[i] = el)}
            className="w-1.5 h-1.5 rounded-full bg-purple-500"
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
