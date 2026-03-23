import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../utils/Axios";

function Topnav() {
  const [query, setquery] = useState("");
  const [search, setsearch] = useState([]);
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const GetSearch = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/search/multi?query=${query}`);
      setsearch(data.results);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 0) {
        GetSearch();
      } else {
        setsearch([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const showDropdown = focused && query.length > 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .topnav-root {
          font-family: 'DM Sans', sans-serif;
        }

        .search-wrapper {
          position: relative;
          width: 460px;
          max-width: 100%;
        }

        /* ── Responsive ── */

        /* Tablet (≤ 1024px): shrink sidebar offset + wrapper */
        @media (max-width: 1024px) {
          .topnav-root {
            margin-left: 0 !important;
            padding: 0 16px;
            justify-content: center;
          }
          .search-wrapper {
            width: 100%;
            max-width: 500px;
          }
        }

        /* Mobile (≤ 640px): full-width bar, compact dropdown */
        @media (max-width: 640px) {
          .topnav-root {
            padding: 0 12px;
            height: auto !important;
            min-height: 64px;
          }
          .search-wrapper {
            width: 100%;
            max-width: 100%;
          }
          .search-input-container {
            padding: 9px 14px;
          }
          .search-input {
            font-size: 14px;
          }
          .dropdown {
            border-radius: 14px;
            left: 0;
            right: 0;
          }
          .dropdown-scroll {
            max-height: 55vh;
          }
          .result-img {
            width: 38px;
            height: 52px;
          }
          .result-title {
            font-size: 13px;
          }
        }

        .search-input-container {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 100px;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05);
        }

        .search-input-container:focus-within {
          background: rgba(255,255,255,0.07);
          border-color: rgba(99, 179, 237, 0.45);
          box-shadow: 0 4px 32px rgba(0,0,0,0.4), 0 0 0 3px rgba(99,179,237,0.12), inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .search-icon {
          color: #718096;
          font-size: 18px;
          flex-shrink: 0;
          transition: color 0.3s ease;
        }
        .search-input-container:focus-within .search-icon {
          color: #90cdf4;
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14.5px;
          font-weight: 400;
          color: #e2e8f0;
          letter-spacing: 0.02em;
        }
        .search-input::placeholder {
          color: #4a5568;
        }

        .clear-btn {
          background: rgba(255,255,255,0.06);
          border: none;
          cursor: pointer;
          color: #718096;
          font-size: 14px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .clear-btn:hover {
          background: rgba(252,129,129,0.15);
          color: #fc8181;
          transform: rotate(90deg);
        }

        /* Loading dots */
        .loading-dots {
          display: flex;
          gap: 4px;
          padding: 0 2px;
        }
        .loading-dots span {
          width: 4px;
          height: 4px;
          background: #63b3ed;
          border-radius: 50%;
          animation: dot-bounce 1.2s ease-in-out infinite;
        }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dot-bounce {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }

        /* Dropdown */
        .dropdown {
          position: absolute;
          top: calc(100% + 10px);
          left: 0;
          right: 0;
          background: #0f1117;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          overflow: hidden;
          z-index: 9999;
          box-shadow: 0 24px 80px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.4);
          transform-origin: top center;
          transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.4,0,0.2,1);
        }
        .dropdown.open {
          opacity: 1;
          transform: translateY(0) scaleY(1);
          pointer-events: all;
        }
        .dropdown.closed {
          opacity: 0;
          transform: translateY(-6px) scaleY(0.97);
          pointer-events: none;
        }

        .dropdown-header {
          padding: 10px 16px 8px;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #4a5568;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        .dropdown-scroll {
          max-height: 390px;
          overflow-y: auto;
          overscroll-behavior: contain;
        }
        .dropdown-scroll::-webkit-scrollbar { width: 4px; }
        .dropdown-scroll::-webkit-scrollbar-track { background: transparent; }
        .dropdown-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }

        .result-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 14px;
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          transition: background 0.18s ease;
          position: relative;
          overflow: hidden;
        }
        .result-item::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2.5px;
          background: linear-gradient(180deg, #63b3ed, #9f7aea);
          transform: scaleY(0);
          transition: transform 0.2s ease;
          transform-origin: bottom;
        }
        .result-item:hover {
          background: rgba(255,255,255,0.04);
        }
        .result-item:hover::before {
          transform: scaleY(1);
        }
        .result-item:last-child {
          border-bottom: none;
        }

        .result-img {
          width: 44px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
          flex-shrink: 0;
          background: #1a1d27;
          transition: transform 0.25s ease;
        }
        .result-item:hover .result-img {
          transform: scale(1.05);
        }

        .result-info {
          flex: 1;
          min-width: 0;
        }

        .result-title {
          font-size: 13.5px;
          font-weight: 500;
          color: #cbd5e0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.18s;
        }
        .result-item:hover .result-title {
          color: #fff;
        }

        .result-type {
          display: inline-block;
          margin-top: 4px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 2px 7px;
          border-radius: 100px;
        }
        .result-type.movie { background: rgba(99,179,237,0.12); color: #63b3ed; }
        .result-type.tv { background: rgba(159,122,234,0.12); color: #b794f4; }
        .result-type.person { background: rgba(104,211,145,0.12); color: #68d391; }

        .result-arrow {
          color: #2d3748;
          font-size: 14px;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .result-item:hover .result-arrow {
          color: #63b3ed;
          transform: translateX(3px);
        }

        /* Empty state */
        .empty-state {
          padding: 32px 20px;
          text-align: center;
        }
        .empty-state-icon {
          font-size: 32px;
          margin-bottom: 10px;
          opacity: 0.3;
        }
        .empty-state-text {
          font-size: 13px;
          color: #4a5568;
        }
        .empty-state-query {
          color: #718096;
          font-style: italic;
        }
      `}</style>

      <div
        className="topnav-root"
        style={{
          width: "100%",
          height: "10vh",
          display: "flex",
          alignItems: "center",
          marginLeft: "20%",
          position: "relative",
        }}
      >
        {/* marginLeft:20% is the sidebar offset on desktop.
            On tablet/mobile, CSS media query overrides it to 0 via !important */}
        <div className="search-wrapper">
          {/* Input pill */}
          <div className="search-input-container">
            <i className="search-icon ri-search-2-line" />

            <input
              ref={inputRef}
              className="search-input"
              type="text"
              placeholder="Movies, shows, people..."
              value={query}
              onChange={(e) => setquery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
            />

            {loading && (
              <div className="loading-dots">
                <span /><span /><span />
              </div>
            )}

            {query.length > 0 && !loading && (
              <button className="clear-btn" onClick={() => { setquery(""); inputRef.current?.focus(); }}>
                <i className="ri-close-line" />
              </button>
            )}
          </div>

          {/* Dropdown */}
          <div className={`dropdown ${showDropdown ? "open" : "closed"}`}>
            {search.length > 0 ? (
              <>
                <div className="dropdown-header">
                  {search.length} result{search.length !== 1 ? "s" : ""}
                </div>
                <div className="dropdown-scroll">
                  {search.map((s, i) => {
                    const mediaType = s.media_type;
                    return (
                      <Link
                        to={`/${mediaType}/${s.id}`}
                        key={i}
                        className="result-item"
                      >
                        <img
                          className="result-img"
                          src={
                            s.poster_path || s.profile_path
                              ? `https://image.tmdb.org/t/p/w200${s.poster_path || s.profile_path}`
                              : `https://placehold.co/44x60/1a1d27/4a5568?text=?`
                          }
                          alt=""
                        />
                        <div className="result-info">
                          <div className="result-title">
                            {s.title || s.name || s.original_name}
                          </div>
                          {mediaType && (
                            <span className={`result-type ${mediaType}`}>
                              {mediaType === "tv" ? "TV Show" : mediaType}
                            </span>
                          )}
                        </div>
                        <i className="result-arrow ri-arrow-right-s-line" />
                      </Link>
                    );
                  })}
                </div>
              </>
            ) : (
              !loading && query.length > 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">🎬</div>
                  <div className="empty-state-text">
                    Nothing found for{" "}
                    <span className="empty-state-query">"{query}"</span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Topnav;