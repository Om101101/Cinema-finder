import React, { useRef, useState, useEffect } from "react";
import TrailerModal from "./TrailerModal";

// ─── Single Row Section ───────────────────────────────────────────────────────
function HorizontalCard({
  data,
  title = "Trending",
  highlight = "Today",
  accentColor = "#6556CD",
}) {
  const rowRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const scroll = (dir) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
    }
  };

  const imgBase = "https://image.tmdb.org/t/p/w500";

  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600&display=swap');

        .hc-section {
          padding: 28px 28px 36px;
          position: relative;
          font-family: 'Outfit', sans-serif;
        }
        .hc-header {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
        }
        .hc-title-wrap { display: flex; align-items: center; gap: 12px; }
        .hc-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px; letter-spacing: 0.06em;
          color: #fff; margin: 0;
        }
        .hc-controls { display: flex; gap: 8px; }
        .hc-btn {
          width: 36px; height: 36px; border-radius: 50%;
          border: 1px solid;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          font-size: 16px;
          background: transparent;
        }
        .hc-row {
          display: flex; gap: 16px;
          overflow-x: auto; padding-bottom: 12px;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
        }
        .hc-row::-webkit-scrollbar { display: none; }

        .hc-card {
          flex-shrink: 0; width: 160px;
          scroll-snap-align: start;
          border-radius: 14px; overflow: hidden;
          background: #16141f;
          border: 1px solid rgba(255,255,255,0.06);
          cursor: pointer;
          transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.28s ease, border-color 0.28s ease;
          position: relative;
        }
        .hc-poster-wrap {
          position: relative; width: 100%;
          aspect-ratio: 2/3; overflow: hidden;
          background: #1e1b2e;
        }
        .hc-poster {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.4s ease;
        }
        .hc-card:hover .hc-poster { transform: scale(1.06); }

        .hc-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(0deg, rgba(12,11,19,0.92) 0%, rgba(12,11,19,0.3) 50%, transparent 100%);
          opacity: 0; transition: opacity 0.3s ease;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column; gap: 8px;
        }
        .hc-card:hover .hc-overlay { opacity: 1; }

        .hc-play-btn {
          width: 52px; height: 52px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 22px;
          transform: scale(0.8);
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
          border: 2px solid rgba(255,255,255,0.3);
        }
        .hc-card:hover .hc-play-btn { transform: scale(1); }

        .hc-play-label {
          font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,0.75);
          letter-spacing: 0.08em; text-transform: uppercase;
          position: absolute; bottom: 12px;
          opacity: 0; transition: opacity 0.3s ease;
        }
        .hc-card:hover .hc-play-label { opacity: 1; }

        .hc-badge {
          position: absolute; top: 8px; left: 8px;
          padding: 2px 8px; border-radius: 6px;
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase; color: #fff;
        }
        .hc-badge.movie  { background: rgba(101,86,205,0.85); }
        .hc-badge.tv     { background: rgba(22,163,74,0.85);  }

        .hc-rating {
          position: absolute; top: 8px; right: 8px;
          background: rgba(0,0,0,0.7);
          border: 1px solid rgba(255,200,0,0.4);
          border-radius: 6px; padding: 2px 7px;
          font-size: 11px; font-weight: 600; color: #fbbf24;
          display: flex; align-items: center; gap: 3px;
        }
        .hc-info { padding: 10px 10px 12px; }
        .hc-name {
          font-size: 13px; font-weight: 600;
          color: rgba(255,255,255,0.9);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin: 0 0 4px;
        }
        .hc-meta {
          font-size: 11px; color: rgba(255,255,255,0.4);
          display: flex; align-items: center; gap: 6px;
        }
        .hc-dot { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,0.25); }

        /* skeleton */
        .hc-skeleton {
          flex-shrink: 0; width: 160px; border-radius: 14px; overflow: hidden;
          background: #16141f; border: 1px solid rgba(255,255,255,0.05);
        }
        .hc-sk-poster {
          width: 100%; aspect-ratio: 2/3;
          background: linear-gradient(90deg, #1e1b2e 25%, #2a2540 50%, #1e1b2e 75%);
          background-size: 200% 100%;
          animation: hcShimmer 1.5s infinite;
        }
        .hc-sk-info { padding: 10px; }
        .hc-sk-line {
          height: 11px; border-radius: 6px; margin-bottom: 8px;
          background: linear-gradient(90deg, #1e1b2e 25%, #2a2540 50%, #1e1b2e 75%);
          background-size: 200% 100%;
          animation: hcShimmer 1.5s infinite;
        }
        .hc-sk-line.short { width: 55%; }
        @keyframes hcShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Section Divider ── */
        .hc-section-divider {
          height: 1px;
          margin: 0 28px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
        }
      `}</style>

      {selectedItem && (
        <TrailerModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      <div className="hc-section">
        <div className="hc-header">
          <div className="hc-title-wrap">
            <div
              style={{
                width: 4,
                height: 28,
                borderRadius: 4,
                background: `linear-gradient(180deg, ${accentColor}, ${hexToRgba(accentColor, 0.4)})`,
              }}
            />
            <h2 className="hc-title">
              {title} <span style={{ color: accentColor }}>{highlight}</span>
            </h2>
          </div>

          <div className="hc-controls">
            {["left", "right"].map((dir) => (
              <button
                key={dir}
                className="hc-btn"
                onClick={() => scroll(dir === "left" ? -1 : 1)}
                aria-label={`Scroll ${dir}`}
                style={{
                  borderColor: hexToRgba(accentColor, 0.4),
                  color: "rgba(255,255,255,0.7)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = hexToRgba(
                    accentColor,
                    0.25,
                  );
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                }}
              >
                <i className={`ri-arrow-${dir}-s-line`} />
              </button>
            ))}
          </div>
        </div>

        <div className="hc-row" ref={rowRef}>
          {data
            ? data.map((item) => {
                const itemTitle = item.title || item.name || "Untitled";
                const year = (
                  item.release_date ||
                  item.first_air_date ||
                  ""
                ).slice(0, 4);
                const rating = item.vote_average
                  ? item.vote_average.toFixed(1)
                  : "N/A";
                const type = item.media_type === "tv" ? "tv" : "movie";
                const poster = item.poster_path
                  ? `${imgBase}${item.poster_path}`
                  : null;

                return (
                  <div
                    className="hc-card"
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(-8px) scale(1.03)";
                      e.currentTarget.style.boxShadow = `0 20px 48px rgba(0,0,0,0.7), 0 0 0 1px ${hexToRgba(accentColor, 0.5)}`;
                      e.currentTarget.style.borderColor = hexToRgba(
                        accentColor,
                        0.5,
                      );
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = "";
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.06)";
                    }}
                  >
                    <div className="hc-poster-wrap">
                      {poster ? (
                        <img
                          src={poster}
                          alt={itemTitle}
                          className="hc-poster"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            background:
                              "linear-gradient(135deg,#1e1b2e,#2a2540)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "rgba(255,255,255,0.2)",
                            fontSize: 32,
                          }}
                        >
                          <i className="ri-film-line" />
                        </div>
                      )}

                      <div className="hc-overlay">
                        <div
                          className="hc-play-btn"
                          style={{
                            background: hexToRgba(accentColor, 0.85),
                            boxShadow: `0 0 24px ${hexToRgba(accentColor, 0.6)}`,
                          }}
                        >
                          <i className="ri-play-fill" />
                        </div>
                        <span className="hc-play-label">Trailer</span>
                      </div>

                      <span className={`hc-badge ${type}`}>
                        {type === "tv" ? "Series" : "Movie"}
                      </span>
                      <span className="hc-rating">
                        <i className="ri-star-fill" style={{ fontSize: 10 }} />
                        {rating}
                      </span>
                    </div>

                    <div className="hc-info">
                      <p className="hc-name" title={itemTitle}>
                        {itemTitle}
                      </p>
                      <div className="hc-meta">
                        <span>{year || "—"}</span>
                        {year && <div className="hc-dot" />}
                        <span style={{ textTransform: "capitalize" }}>
                          {type}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            : Array.from({ length: 10 }).map((_, i) => (
                <div className="hc-skeleton" key={i}>
                  <div className="hc-sk-poster" />
                  <div className="hc-sk-info">
                    <div className="hc-sk-line" />
                    <div className="hc-sk-line short" />
                  </div>
                </div>
              ))}
        </div>
      </div>
    </>
  );
}


export function MovieSections({ apiKey }) {
  const [sections, setSections] = useState([
    {
      id: "trending",
      title: "Trending",
      highlight: "Today",
      accentColor: "#6556CD",
      endpoint: "trending/movie/day",
      data: null,
    },
    {
      id: "popular",
      title: "Popular",
      highlight: "Movies",
      accentColor: "#E11D48",
      endpoint: "movie/popular",
      data: null,
    },
    {
      id: "top_rated",
      title: "Top",
      highlight: "Rated",
      accentColor: "#F59E0B",
      endpoint: "movie/top_rated",
      data: null,
    },
    {
      id: "upcoming",
      title: "Upcoming",
      highlight: "Movies",
      accentColor: "#10B981",
      endpoint: "movie/upcoming",
      data: null,
    },
    {
      id: "now_playing",
      title: "Now",
      highlight: "Playing",
      accentColor: "#3B82F6",
      endpoint: "movie/now_playing",
      data: null,
    },
  ]);

  useEffect(() => {
    if (!apiKey) return;

    sections.forEach((sec) => {
      fetch(
        `https://api.themoviedb.org/3/${sec.endpoint}?api_key=${apiKey}&language=en-US&page=1`,
      )
        .then((r) => r.json())
        .then((json) => {
          setSections((prev) =>
            prev.map((s) =>
              s.id === sec.id ? { ...s, data: json.results } : s,
            ),
          );
        })
        .catch(console.error);
    });
  }, [apiKey]);

  return (
    <div style={{ background: "#0c0b13", minHeight: "100vh" }}>
      {sections.map((sec, idx) => (
        <React.Fragment key={sec.id}>
          <HorizontalCard
            data={sec.data}
            title={sec.title}
            highlight={sec.highlight}
            accentColor={sec.accentColor}
          />
          {idx < sections.length - 1 && <div className="hc-section-divider" />}
        </React.Fragment>
      ))}
    </div>
  );
}

export default HorizontalCard;
