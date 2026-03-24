import React, { useEffect, useRef } from "react";
import gsap from "gsap";

function PremiumLoader() {
  const dotsRef = useRef([]);

  useEffect(() => {
    if (!dotsRef.current) return;

    gsap.fromTo(
      dotsRef.current,
      { y: 0, opacity: 0.3 },
      {
        y: -15,
        opacity: 1,
        duration: 0.6,
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
        <div className="absolute w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 shadow-lg animate-infinity" />
        <div className="absolute w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 shadow-lg animate-infinity delay-[1.25s]" />
      </div>

      {/* 🎥 Text */}
      <h2 className="text-sm tracking-widest text-zinc-400 mb-4">
        FETCHING MOVIES
      </h2>

      {/* 🔥 GSAP Dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((_, i) => (
          <div
            key={i}
            ref={(el) => (dotsRef.current[i] = el)}
            className="w-2 h-2 bg-purple-500 rounded-full"
          />
        ))}
      </div>

      {/* ✅ Keyframes Fix */}
      <style>{`
        @keyframes infinity {
          0%, 100% { left: 0; top: 50%; transform: translate(0, -50%); }
          25% { left: 42px; top: 0; transform: translate(0, 0); }
          50% { left: 84px; top: 50%; transform: translate(0, -50%); }
          75% { left: 42px; top: 100%; transform: translate(0, -100%); }
        }

        .animate-infinity {
          animation: infinity 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default PremiumLoader;
