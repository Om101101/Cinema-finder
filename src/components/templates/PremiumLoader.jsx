import React, { useEffect, useRef } from "react";
import gsap from "gsap";

function PremiumLoader() {
  const dotsRef = useRef([]);
  const dot1Ref = useRef(null);
  const dot2Ref = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      dotsRef.current,
      { y: 0, opacity: 0.3 },
      {
        y: -12,
        opacity: 1,
        duration: 0.55,
        stagger: 0.18,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      }
    );

    const path1 = document.querySelector("#inf-path-1");
    const path2 = document.querySelector("#inf-path-2");
    if (!path1 || !path2) return;

    const len1 = path1.getTotalLength();
    const len2 = path2.getTotalLength();

    const animateDotAlongPath = (dotEl, pathEl, len, delay) => {
      let progress = { t: delay };
      gsap.to(progress, {
        t: delay + 1,
        duration: 2.5,
        repeat: -1,
        ease: "none",
        onUpdate() {
          const frac = ((progress.t % 1) + 1) % 1;
          const pt = pathEl.getPointAtLength(frac * len);
          gsap.set(dotEl, { x: pt.x - 50, y: pt.y - 25 });
        },
      });
    };

    animateDotAlongPath(dot1Ref.current, path1, len1, 0);
    animateDotAlongPath(dot2Ref.current, path2, len2, 0.5);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-[#0c0b13] text-white">

      <div className="relative w-[100px] h-[50px] mb-8">
        <svg
          width="100"
          height="50"
          viewBox="0 0 100 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0"
        >
          <path
            id="inf-path-1"
            d="M50,25 C50,10 35,5 25,5 C12,5 5,14 5,25 C5,36 12,45 25,45 C35,45 50,40 50,25 C50,10 65,5 75,5 C88,5 95,14 95,25 C95,36 88,45 75,45 C65,45 50,40 50,25"
            stroke="rgba(101,86,205,0.15)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            id="inf-path-2"
            d="M50,25 C50,10 35,5 25,5 C12,5 5,14 5,25 C5,36 12,45 25,45 C35,45 50,40 50,25 C50,10 65,5 75,5 C88,5 95,14 95,25 C95,36 88,45 75,45 C65,45 50,40 50,25"
            stroke="rgba(101,86,205,0.15)"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>

        <div
          ref={dot1Ref}
          className="absolute w-3 h-3 rounded-full"
          style={{
            top: 25,
            left: 50,
            background: "linear-gradient(135deg, #ec4899, #f59e0b)",
            boxShadow: "0 0 10px rgba(236,72,153,0.7)",
            transform: "translate(-50%, -50%)",
          }}
        />
        <div
          ref={dot2Ref}
          className="absolute w-3 h-3 rounded-full"
          style={{
            top: 25,
            left: 50,
            background: "linear-gradient(135deg, #6366f1, #38bdf8)",
            boxShadow: "0 0 10px rgba(99,102,241,0.7)",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      <h2 className="text-xs tracking-[0.22em] text-zinc-500 mb-5 font-medium">
        FETCHING MOVIES
      </h2>

      <div className="flex gap-[6px]">
        {[0, 1, 2].map((_, i) => (
          <div
            key={i}
            ref={(el) => (dotsRef.current[i] = el)}
            className="w-[7px] h-[7px] rounded-full"
            style={{ background: i === 1 ? "#a78bfa" : "rgba(167,139,250,0.45)" }}
          />
        ))}
      </div>
    </div>
  );
}

export default PremiumLoader;