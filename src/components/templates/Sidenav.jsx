import axios from "../../utils/Axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Sidenav() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks1 = [
    { to: "/trending", icon: "ri-fire-fill", label: "Trending" },
    { to: "/popular", icon: "ri-bard-fill", label: "Popular" },
    { to: "/toprated", icon: "ri-star-smile-fill", label: "Top Rated" },
    { to: "/movies", icon: "ri-clapperboard-fill", label: "Movies" },
    { to: "/tv", icon: "ri-tv-2-fill", label: "TV Shows" },
    { to: "/people", icon: "ri-team-line", label: "People" },
  ];

  const navLinks2 = [
    { to: "/about", icon: "ri-file-info-fill", label: "About SCSDB" },
    { to: "/contact", icon: "ri-contacts-fill", label: "Contact Us" },
  ];

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const NavItem = ({ to, icon, label }) => {
    const active = location.pathname.startsWith(to);
    return (
      <Link to={to} className={`sn-item ${active ? "sn-item--active" : ""}`}>
        {active && <span className="sn-active-bar" />}
        <span className="sn-icon-box">
          <i className={icon} />
        </span>
        <span className="sn-label">{label}</span>
        {/* tooltip shown on icon-rail (tablet) */}
        <span className="sn-tooltip">{label}</span>
      </Link>
    );
  };

  const BottomNavItem = ({ to, icon, label }) => {
    const active = location.pathname.startsWith(to);
    return (
      <Link to={to} className={`bn-item ${active ? "bn-item--active" : ""}`}>
        <i className={icon} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');

        /* ══ TOKENS ══ */
        :root {
          --sn-w:          258px;
          --sn-bg:         #0c0b13;
          --sn-border:     rgba(255,255,255,0.055);
          --accent:        #6556CD;
          --accent-mid:    #7c6fe0;
          --accent-light:  #a89cf7;
          --accent-glow:   rgba(101,86,205,0.30);
          --accent-faint:  rgba(101,86,205,0.10);
          --text-hi:       #ffffff;
          --text-mid:      rgba(255,255,255,0.58);
          --text-lo:       rgba(255,255,255,0.28);
        }

        /* ══ SIDEBAR SHELL ══ */
        .sidenav {
          font-family: 'Outfit', sans-serif;
          position: fixed;
          inset: 0 auto 0 0;
          width: var(--sn-w);
          display: flex;
          flex-direction: column;
          background: var(--sn-bg);
          border-right: 1px solid var(--sn-border);
          z-index: 200;
          transition: transform 0.34s cubic-bezier(0.4,0,0.2,1),
                      box-shadow 0.3s ease;
        }

        /* glowing right-edge shimmer */
        .sidenav::after {
          content: '';
          position: absolute;
          top: 0; right: -1px;
          width: 1px;
          height: 100%;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(101,86,205,0.7) 38%,
            rgba(101,86,205,0.25) 68%,
            transparent 100%
          );
          pointer-events: none;
        }

        /* ══ LOGO ══ */
        .sn-logo {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 20px 16px 16px;
          border-bottom: 1px solid var(--sn-border);
          flex-shrink: 0;
          text-decoration: none;
        }
        .sn-logo-icon {
          width: 38px; height: 38px;
          border-radius: 11px;
          background: linear-gradient(140deg, var(--accent) 0%, #3730a3 100%);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.1) inset,
            0 6px 22px var(--accent-glow);
        }
        .sn-logo-icon i { color: #fff; font-size: 19px; }
        .sn-logo-wordmark {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .sn-logo-title {
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--text-hi);
          line-height: 1;
        }
        .sn-logo-sub {
          font-size: 9.5px;
          color: var(--text-lo);
          letter-spacing: 0.06em;
          font-weight: 400;
        }
        .sn-logo-badge {
          margin-left: auto;
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: var(--accent-light);
          background: var(--accent-faint);
          border: 1px solid rgba(101,86,205,0.22);
          border-radius: 6px;
          padding: 3px 8px;
          flex-shrink: 0;
        }

        /* ══ SCROLLABLE BODY ══ */
        .sn-body {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 6px 10px 16px;
          scrollbar-width: none;
        }
        .sn-body::-webkit-scrollbar { display: none; }

        /* ══ SECTION LABEL ══ */
        .sn-section {
          display: block;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--text-lo);
          padding: 18px 8px 7px;
        }

        /* ══ NAV ITEM ══ */
        .sn-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 10px 8px 12px;
          border-radius: 12px;
          text-decoration: none;
          color: var(--text-mid);
          font-size: 13.5px;
          font-weight: 400;
          margin-bottom: 2px;
          transition:
            background 0.22s ease,
            color      0.22s ease,
            transform  0.18s ease;
          overflow: hidden;
        }
        .sn-item:hover {
          background: rgba(255,255,255,0.04);
          color: var(--text-hi);
          transform: translateX(4px);
        }
        .sn-item--active {
          background: linear-gradient(105deg,
            rgba(101,86,205,0.22) 0%,
            rgba(101,86,205,0.05) 100%
          );
          color: var(--text-hi);
          font-weight: 500;
        }

        /* active bar — left accent stripe */
        .sn-active-bar {
          position: absolute;
          left: 0; top: 18%; bottom: 18%;
          width: 3px;
          border-radius: 0 4px 4px 0;
          background: linear-gradient(180deg, var(--accent-light), var(--accent));
          box-shadow: 0 0 10px var(--accent-glow);
        }

        /* icon box */
        .sn-icon-box {
          width: 32px; height: 32px;
          border-radius: 9px;
          background: rgba(255,255,255,0.05);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          font-size: 15px;
          color: var(--text-mid);
          transition:
            background  0.22s ease,
            color       0.22s ease,
            transform   0.22s cubic-bezier(0.34,1.56,0.64,1),
            box-shadow  0.22s ease;
        }
        .sn-item:hover .sn-icon-box {
          background: var(--accent-faint);
          color: var(--accent-light);
          box-shadow: 0 0 14px var(--accent-glow);
          transform: scale(1.15) rotate(-5deg);
        }
        .sn-item--active .sn-icon-box {
          background: var(--accent-faint);
          color: var(--accent-light);
          box-shadow: 0 0 12px var(--accent-glow);
        }

        /* label */
        .sn-label {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* tooltip (tablet icon-rail mode) */
        .sn-tooltip {
          display: none;
        }

        /* ══ DIVIDER ══ */
        .sn-divider {
          border: none;
          border-top: 1px solid var(--sn-border);
          margin: 8px 2px;
        }

        /* ══ FOOTER ══ */
        .sn-footer {
          flex-shrink: 0;
          padding: 10px 14px 16px;
          border-top: 1px solid var(--sn-border);
        }
        .sn-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          border-radius: 14px;
          background: linear-gradient(120deg,
            rgba(101,86,205,0.10) 0%,
            rgba(67,56,202,0.05) 100%
          );
          border: 1px solid rgba(101,86,205,0.18);
        }
        .sn-badge-pulse {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #4ade80;
          flex-shrink: 0;
          box-shadow: 0 0 0 0 rgba(74,222,128,0.5);
          animation: sn-pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite;
        }
        @keyframes sn-pulse {
          0%  { box-shadow: 0 0 0 0   rgba(74,222,128,0.55); }
          60% { box-shadow: 0 0 0 7px rgba(74,222,128,0);    }
          100%{ box-shadow: 0 0 0 0   rgba(74,222,128,0);    }
        }
        .sn-badge-text { font-size: 11.5px; color: var(--text-mid); }
        .sn-badge-text strong { color: var(--accent-light); font-weight: 600; }


        /* ════════════════════════════════════════
           TABLET  768px–1024px  →  icon-rail
        ════════════════════════════════════════ */
        @media (max-width: 1024px) and (min-width: 769px) {
          :root { --sn-w: 74px; }

          /* hide text elements */
          .sn-label,
          .sn-logo-wordmark,
          .sn-logo-badge,
          .sn-section,
          .sn-badge-text { display: none; }

          .sn-logo { padding: 18px 0; justify-content: center; }

          .sn-body { padding: 6px 8px 14px; }

          .sn-item {
            justify-content: center;
            padding: 9px 0;
            border-radius: 14px;
            gap: 0;
            overflow: visible;
          }
          .sn-item:hover { transform: scale(1.08); }

          .sn-icon-box {
            width: 40px; height: 40px;
            border-radius: 12px;
            font-size: 17px;
          }

          /* tooltip bubble */
          .sn-tooltip {
            display: block;
            position: absolute;
            left: calc(100% + 12px);
            top: 50%;
            transform: translateY(-50%) translateX(-8px);
            background: #1a1826;
            color: var(--text-hi);
            font-size: 12px;
            font-weight: 500;
            padding: 5px 12px;
            border-radius: 9px;
            white-space: nowrap;
            border: 1px solid rgba(101,86,205,0.25);
            box-shadow: 0 6px 24px rgba(0,0,0,0.55);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.18s ease, transform 0.18s ease;
            z-index: 9999;
            font-family: 'Outfit', sans-serif;
          }
          .sn-tooltip::before {
            content: '';
            position: absolute;
            right: 100%; top: 50%;
            transform: translateY(-50%);
            border: 5px solid transparent;
            border-right-color: #1a1826;
          }
          .sn-item:hover .sn-tooltip {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }

          .sn-footer { padding: 10px 8px 14px; }
          .sn-badge {
            justify-content: center;
            padding: 10px 0;
          }
        }

        /* ════════════════════════════════════════
           MOBILE  ≤768px  →  drawer + bottom bar
        ════════════════════════════════════════ */
        @media (max-width: 768px) {
          .sidenav {
            transform: translateX(-100%);
            box-shadow: none;
          }
          .sidenav.sn-open {
            transform: translateX(0);
            box-shadow: 12px 0 60px rgba(0,0,0,0.75);
          }
          .sn-hamburger { display: flex !important; }
          .sn-overlay   { display: block !important; }
          .sn-bottom-nav{ display: flex !important; }
        }

        /* ══ HAMBURGER ══ */
        .sn-hamburger {
          display: none;
          position: fixed;
          top: 12px; left: 12px;
          z-index: 400;
          width: 42px; height: 42px;
          border-radius: 12px;
          background: rgba(12,11,19,0.94);
          border: 1px solid rgba(101,86,205,0.28);
          backdrop-filter: blur(16px);
          align-items: center; justify-content: center;
          cursor: pointer;
          color: var(--text-mid);
          font-size: 20px;
          transition: all 0.22s ease;
          box-shadow: 0 4px 20px rgba(0,0,0,0.55);
        }
        .sn-hamburger:hover {
          background: var(--accent-faint);
          color: var(--text-hi);
          border-color: rgba(101,86,205,0.55);
          transform: scale(1.07);
        }
        .sn-hamburger i { transition: transform 0.26s cubic-bezier(0.4,0,0.2,1); }
        .sn-hamburger.sn-open i { transform: rotate(90deg); }

        /* ══ OVERLAY ══ */
        .sn-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.68);
          backdrop-filter: blur(4px);
          z-index: 199;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .sn-overlay.sn-visible {
          opacity: 1;
          pointer-events: all;
        }

        /* ══ BOTTOM NAV BAR ══ */
        .sn-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0; left: 0; right: 0;
          height: 62px;
          background: rgba(10,9,18,0.97);
          border-top: 1px solid var(--sn-border);
          backdrop-filter: blur(24px);
          z-index: 300;
          justify-content: space-around;
          align-items: center;
          padding: 0 4px env(safe-area-inset-bottom);
          box-shadow: 0 -6px 28px rgba(0,0,0,0.55);
          font-family: 'Outfit', sans-serif;
        }
        .bn-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          flex: 1;
          padding: 6px 2px 4px;
          border-radius: 10px;
          text-decoration: none;
          color: var(--text-lo);
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.03em;
          transition: color 0.2s ease;
        }
        .bn-item i {
          font-size: 21px;
          transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), color 0.2s ease;
        }
        .bn-item:hover { color: var(--text-mid); }
        .bn-item--active {
          color: var(--accent-light);
        }
        .bn-item--active i {
          transform: translateY(-3px);
          filter: drop-shadow(0 2px 8px var(--accent-glow));
        }
      `}</style>

      {/* ── Hamburger ── */}
      <button
        className={`sn-hamburger ${mobileOpen ? "sn-open" : ""}`}
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle navigation"
      >
        <i className={mobileOpen ? "ri-close-line" : "ri-menu-3-line"} />
      </button>

      {/* ── Overlay ── */}
      <div
        className={`sn-overlay ${mobileOpen ? "sn-visible" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ══ SIDEBAR ══ */}
      <div className={`sidenav ${mobileOpen ? "sn-open" : ""}`}>
        {/* Logo */}
        <div className="sn-logo">
          <div className="sn-logo-icon">
            <i className="ri-film-line" />
          </div>
          <div className="sn-logo-wordmark">
            <span className="sn-logo-title">SCSDB</span>
            <span className="sn-logo-sub">Movie Database</span>
          </div>
          <span className="sn-logo-badge">LIVE</span>
        </div>

        {/* Nav body */}
        <div className="sn-body">
          <span className="sn-section">New Feeds</span>
          <nav>
            {navLinks1.map((l) => (
              <NavItem key={l.to} {...l} />
            ))}
          </nav>

          <hr className="sn-divider" />

          <span className="sn-section">Website Information</span>
          <nav>
            {navLinks2.map((l) => (
              <NavItem key={l.to} {...l} />
            ))}
          </nav>
        </div>

        {/* Footer badge */}
        <div className="sn-footer">
          <div className="sn-badge">
            <span className="sn-badge-pulse" />
            <span className="sn-badge-text">
              Powered by <strong>TMDB</strong> API
            </span>
          </div>
        </div>
      </div>

      {/* ══ BOTTOM NAV (mobile quick-access) ══ */}
      <nav className="sn-bottom-nav">
        {navLinks1.slice(0, 5).map((l) => (
          <BottomNavItem key={l.to} {...l} />
        ))}
      </nav>
    </>
  );
}

export default Sidenav;
