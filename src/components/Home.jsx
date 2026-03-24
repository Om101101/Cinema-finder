import React, { useEffect, useState } from "react";
import Sidenav from "./templates/Sidenav";
import Topnav from "./templates/Topnav";
import axios from "../utils/Axios";
import Header from "./templates/Header";
import HorizontalCard from "./templates/HorizontalCard";

function Home() {
  document.title = "SCSDB | Homepage";
  const [wallpaper, setwallpaper] = useState(null);
  const [tranding, settranding] = useState(null);

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
      settranding(data.results); // FIX 1: was data.result (typo — missing 's')
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    // FIX 2: both fetches run independently on mount,
    // not nested inside each other with broken conditions
    GetHeaderWallpaper();
    GetTranding();
  }, []);

  /* ────────────────────────────────────────────
     LOADING STATE
  ──────────────────────────────────────────── */
  if (!wallpaper) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600&display=swap');

          .hl-root {
            font-family: 'Outfit', sans-serif;
            display: flex;
            width: 100%;
            min-height: 100vh;
            background: #0c0b13;
            align-items: center;
            justify-content: center;
          }
          .hl-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 24px;
            padding: 40px 48px;
            background: rgba(255,255,255,0.025);
            border: 1px solid rgba(101,86,205,0.18);
            border-radius: 24px;
            box-shadow: 0 24px 80px rgba(0,0,0,0.5);
          }

          /* Spinner */
          .hl-spinner {
            position: relative;
            width: 60px; height: 60px;
          }
          .hl-ring {
            position: absolute; inset: 0;
            border-radius: 50%;
            border: 2.5px solid transparent;
            border-top-color: #6556CD;
            border-right-color: rgba(101,86,205,0.25);
            animation: hlspin 0.95s linear infinite;
          }
          .hl-ring2 {
            position: absolute; inset: 9px;
            border-radius: 50%;
            border: 2px solid transparent;
            border-bottom-color: #a89cf7;
            border-left-color: rgba(168,156,247,0.2);
            animation: hlspin 1.5s linear infinite reverse;
          }
          .hl-center-icon {
            position: absolute; inset: 0;
            display: flex; align-items: center; justify-content: center;
          }
          .hl-center-icon i {
            font-size: 22px;
            color: #6556CD;
            animation: hlpulse 1.8s ease-in-out infinite;
          }
          @keyframes hlspin  { to { transform: rotate(360deg); } }
          @keyframes hlpulse {
            0%,100% { opacity:0.5; transform:scale(0.88); }
            50%      { opacity:1;   transform:scale(1.06); }
          }

          /* Text + dots */
          .hl-label {
            font-size: 14px;
            font-weight: 500;
            color: rgba(255,255,255,0.55);
            letter-spacing: 0.05em;
          }
          .hl-dots { display: flex; gap: 5px; }
          .hl-dots span {
            width: 5px; height: 5px;
            border-radius: 50%;
            background: #6556CD;
            animation: hldot 1.2s ease-in-out infinite;
          }
          .hl-dots span:nth-child(2) { animation-delay:.2s; }
          .hl-dots span:nth-child(3) { animation-delay:.4s; }
          @keyframes hldot {
            0%,80%,100%{ opacity:.2; transform:scale(.7); }
            40%        { opacity:1;  transform:scale(1);  }
          }
        `}</style>

        <div className="hl-root">
          <div className="hl-card">
            <div className="hl-spinner">
              <div className="hl-ring" />
              <div className="hl-ring2" />
              <div className="hl-center-icon">
                <i className="ri-film-line" />
              </div>
            </div>
            <span className="hl-label">Fetching trending content</span>
            <div className="hl-dots">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ────────────────────────────────────────────
     MAIN LAYOUT
  ──────────────────────────────────────────── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');

        /* FIX 3: removed stray JS import statement that was sitting inside this CSS string */

        *, *::before, *::after { box-sizing: border-box; }

        .home-layout {
          font-family: 'Outfit', sans-serif;
          display: flex;
          width: 100%;
          min-height: 100vh;
          background: #0c0b13;
        }

        /* ── Main column ── */
        .home-main {
          margin-left: 258px;
          flex: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
          overflow-y: auto;
          position: relative;
          transition: margin-left 0.34s cubic-bezier(0.4,0,0.2,1);
          scrollbar-width: thin;
          scrollbar-color: rgba(101,86,205,0.3) transparent;
        }
        .home-main::-webkit-scrollbar       { width: 4px; }
        .home-main::-webkit-scrollbar-track  { background: transparent; }
        .home-main::-webkit-scrollbar-thumb  {
          background: rgba(101,86,205,0.32);
          border-radius: 10px;
        }

        .home-vignette {
          position: sticky;
          top: 0;
          z-index: 50;
          background: linear-gradient(
            180deg,
            rgba(12,11,19,0.92) 0%,
            rgba(12,11,19,0.6)  60%,
            transparent         100%
          );
          padding-bottom: 10px;
          flex-shrink: 0;
        }

        .home-content { flex: 1; }

        /* Tablet */
        @media (max-width: 1024px) and (min-width: 769px) {
          .home-main { margin-left: 74px; }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .home-main {
            margin-left: 0;
            padding-bottom: 62px;
          }
        }
      `}</style>

      <div className="home-layout">
        <Sidenav />

        <div className="home-main">
          <div className="home-vignette">
            <Topnav />
          </div>

          <div className="home-content">
            <Header data={wallpaper} />
            {/* FIX 4: pass trending data as prop so HorizontalCard can render it */}
            <HorizontalCard data={tranding} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
