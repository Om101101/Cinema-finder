import React, { useState } from "react";

const IMG_BASE = "https://image.tmdb.org/t/p/";

// ─────────────────────────────────────────────────────────────────
// Rating Ring SVG
// ─────────────────────────────────────────────────────────────────
const RatingRing = ({ rating }) => {
  const pct = (rating / 10) * 100;
  const r = 16;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = rating >= 7.5 ? "#4ade80" : rating >= 6 ? "#e8c97e" : "#f87171";

  return (
    <div className="rating-ring">
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle
          cx="20"
          cy="20"
          r={r}
          fill="rgba(0,0,0,0.75)"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="3"
        />
        <circle
          cx="20"
          cy="20"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 20 20)"
        />
      </svg>
      <span className="ring-label" style={{ color }}>
        {Math.round(rating * 10)}%
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// Skeleton Card
// ─────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="card skeleton-card">
    <div className="card-poster-wrap skeleton-poster" />
    <div className="card-info">
      <div className="skel-line short" />
      <div className="skel-line long" />
      <div className="skel-line medium" />
    </div>
    <style>{`
      .skeleton-poster {
        height: 280px;
        background: linear-gradient(90deg, #1a1a2a 25%, #22223a 50%, #1a1a2a 75%);
        background-size: 200%;
        animation: shimmer 1.4s infinite;
      }
      .skel-line {
        border-radius: 4px; margin-bottom: 8px;
        background: linear-gradient(90deg, #1a1a2a 25%, #22223a 50%, #1a1a2a 75%);
        background-size: 200%; animation: shimmer 1.4s infinite;
      }
      .skel-line.short  { height: 10px; width: 45%; }
      .skel-line.long   { height: 14px; width: 90%; }
      .skel-line.medium { height: 10px; width: 60%; }
      @keyframes shimmer { to { background-position: -200% center; } }
    `}</style>
  </div>
);

// ─────────────────────────────────────────────────────────────────
// Genre label map
// ─────────────────────────────────────────────────────────────────
const GENRE_LABELS = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  18: "Drama",
  27: "Horror",
  878: "Sci-Fi",
  53: "Thriller",
  10749: "Romance",
  14: "Fantasy",
  9648: "Mystery",
  10751: "Family",
  36: "History",
  10752: "War",
  37: "Western",
};

// ─────────────────────────────────────────────────────────────────
// Single Card
// ─────────────────────────────────────────────────────────────────
const MovieCard = ({ item, idx, onPlayTrailer }) => {
  const [imgError, setImgError] = useState(false);

  const title = item.title || item.name || "Untitled";
  const date = item.release_date || item.first_air_date || "";
  const year = date ? date.slice(0, 4) : "—";
  const rating = item.vote_average || 0;
  const overview = item.overview || "";
  const isTV = item.media_type === "tv";

  return (
    <div className="card" style={{ animationDelay: `${(idx % 20) * 40}ms` }}>
      {/* Trend badge */}
      {idx < 10 && <div className="trend-badge">#{idx + 1}</div>}

      {/* Poster */}
      <div className="card-poster-wrap">
        {item.poster_path && !imgError ? (
          <img
            className="card-poster"
            src={`${IMG_BASE}w500${item.poster_path}`}
            alt={title}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="card-poster no-poster">
            <span>🎬</span>
          </div>
        )}

        {/* ✅ PLAY BUTTON — center of poster on hover */}
        <button
          className="card-play-btn"
          onClick={() => onPlayTrailer(item)}
          aria-label={`Play trailer for ${title}`}
        >
          <div className="play-circle">
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="play-label">Watch Trailer</span>
        </button>

        {/* Hover info overlay */}
        <div className="poster-overlay">
          {item.backdrop_path && (
            <img
              className="backdrop-thumb"
              src={`${IMG_BASE}w300${item.backdrop_path}`}
              alt=""
            />
          )}
          <div className="overlay-content">
            <p className="overview-text">
              {overview.slice(0, 110)}
              {overview.length > 110 ? "…" : ""}
            </p>
            <a
              href={`https://www.themoviedb.org/${isTV ? "tv" : "movie"}/${item.id}`}
              target="_blank"
              rel="noreferrer"
              className="details-btn"
              onClick={(e) => e.stopPropagation()}
            >
              More Info →
            </a>
          </div>
        </div>

        {/* Rating ring */}
        {rating > 0 && (
          <div className="rating-anchor">
            <RatingRing rating={rating} />
          </div>
        )}
      </div>

      {/* Card info */}
      <div className="card-info">
        <div className="card-meta">
          <span className="card-year">{year}</span>
          {isTV && <span className="media-tag">TV</span>}
          {item.adult && <span className="media-tag adult">18+</span>}
        </div>
        <h3 className="card-title">{title}</h3>
        {item.genre_ids && item.genre_ids.length > 0 && (
          <div className="genre-tags">
            {item.genre_ids.slice(0, 2).map((g) =>
              GENRE_LABELS[g] ? (
                <span key={g} className="genre-tag">
                  {GENRE_LABELS[g]}
                </span>
              ) : null,
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// Cards Grid
// ─────────────────────────────────────────────────────────────────
const Cards = ({ data = [], loading = false, onPlayTrailer }) => {
  return (
    <>
      <div className="cards-grid">
        {data.map((item, idx) => (
          <MovieCard
            key={`${item.id}-${idx}`}
            item={item}
            idx={idx}
            onPlayTrailer={onPlayTrailer}
          />
        ))}
        {loading &&
          [...Array(10)].map((_, i) => <SkeletonCard key={`sk-${i}`} />)}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
          gap: 24px;
        }

        /* ── Card ── */
        .card {
          position: relative; border-radius: 14px; overflow: hidden;
          background: #12121e; border: 1px solid rgba(232,201,126,0.08);
          cursor: pointer;
          transition: transform 0.32s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s, border-color 0.25s;
          animation: cardFadeIn 0.4s ease both;
        }
        @keyframes cardFadeIn {
          from { opacity:0; transform:translateY(20px) scale(0.97); }
          to   { opacity:1; transform:none; }
        }
        .card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(232,201,126,0.22);
          border-color: rgba(232,201,126,0.28);
          z-index: 2;
        }

        /* Trend badge */
        .trend-badge {
          position: absolute; top: 10px; left: 10px; z-index: 10;
          font-family:'Bebas Neue',cursive; font-size:15px;
          color:#080810; background:#e8c97e;
          border-radius:6px; padding:2px 8px; line-height:1.4;
        }

        /* Poster wrap */
        .card-poster-wrap {
          position: relative; height: 280px; overflow: hidden; background: #0e0e1a;
        }
        .card-poster {
          width:100%; height:100%; object-fit:cover; display:block;
          transition: transform 0.4s ease;
        }
        .card:hover .card-poster { transform: scale(1.06); }
        .card-poster.no-poster {
          display:flex; align-items:center; justify-content:center;
          font-size:48px; background:#1a1a2e; height:100%;
        }

        /* ✅ Play button — hidden by default, shows on card hover */
        .card-play-btn {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          z-index: 20;
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .card:hover .card-play-btn { opacity: 1; }

        .play-circle {
          width: 56px; height: 56px; border-radius: 50%;
          background: rgba(232,201,126,0.95);
          display: flex; align-items: center; justify-content: center;
          color: #080810;
          box-shadow: 0 0 0 6px rgba(232,201,126,0.2), 0 8px 24px rgba(0,0,0,0.5);
          transform: scale(0.85);
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }
        .card:hover .play-circle { transform: scale(1); }
        .card-play-btn:hover .play-circle {
          background: #f5e6b8;
          transform: scale(1.1);
        }
        .play-label {
          font-family:'DM Sans',sans-serif;
          font-size:11px; font-weight:700;
          letter-spacing:0.08em;
          color:#f5ead5;
          text-transform:uppercase;
          text-shadow: 0 2px 8px rgba(0,0,0,0.8);
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.2s 0.05s, transform 0.2s 0.05s;
        }
        .card:hover .play-label { opacity:1; transform:none; }

        /* Hover overlay (behind play button) */
        .poster-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(8,8,16,0.97) 0%, rgba(8,8,16,0.55) 55%, transparent 100%);
          opacity: 0; transition: opacity 0.3s;
          display: flex; flex-direction: column; justify-content: flex-end; padding: 14px;
          pointer-events: none;
        }
        .card:hover .poster-overlay { opacity: 1; }
        .backdrop-thumb {
          position:absolute; inset:0; width:100%; height:100%;
          object-fit:cover; opacity:0.2; filter:blur(1px);
        }
        .overlay-content { position:relative; z-index:2; pointer-events: all; }
        .overview-text {
          font-family:'DM Sans',sans-serif; font-size:11.5px; font-weight:300;
          color:rgba(240,230,200,0.85); line-height:1.5; margin:0 0 8px;
        }
        .details-btn {
          display:inline-block; font-family:'DM Sans',sans-serif;
          font-size:11px; font-weight:600; letter-spacing:0.05em;
          color:#080810; background:#e8c97e; border-radius:6px;
          padding:4px 12px; text-decoration:none; transition:background 0.2s;
        }
        .details-btn:hover { background:#f5e6b8; }

        /* Rating ring */
        .rating-anchor {
          position:absolute; bottom:-1px; right:8px;
          transform:translateY(50%); z-index:5;
        }
        .rating-ring {
          position:relative; display:inline-flex;
          align-items:center; justify-content:center;
        }
        .ring-label {
          position:absolute; font-family:'DM Sans',sans-serif;
          font-size:8px; font-weight:700; letter-spacing:-0.02em;
        }

        /* Card info */
        .card-info { padding:18px 12px 14px; }
        .card-meta { display:flex; align-items:center; gap:6px; margin-bottom:5px; }
        .card-year {
          font-family:'DM Sans',sans-serif; font-size:11px;
          color:rgba(232,201,126,0.6); font-weight:500;
        }
        .media-tag {
          font-family:'DM Sans',sans-serif; font-size:10px; font-weight:700;
          color:rgba(232,201,126,0.7); background:rgba(232,201,126,0.12);
          border-radius:4px; padding:1px 5px; letter-spacing:0.05em;
        }
        .media-tag.adult { color:rgba(248,113,113,0.8); background:rgba(248,113,113,0.1); }
        .card-title {
          font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600;
          color:#f0e6c8; margin:0 0 8px; line-height:1.3;
          display:-webkit-box; -webkit-line-clamp:2;
          -webkit-box-orient:vertical; overflow:hidden;
        }
        .genre-tags { display:flex; gap:5px; flex-wrap:wrap; }
        .genre-tag {
          font-family:'DM Sans',sans-serif; font-size:10px;
          color:rgba(200,190,170,0.55); background:rgba(255,255,255,0.05);
          border-radius:4px; padding:2px 6px;
        }

        /* Skeleton */
        .skeleton-card { animation:none; border-color:rgba(255,255,255,0.04); }
        .skeleton-card .card-info { padding:14px 12px; }

        @media(max-width:480px) {
          .cards-grid { grid-template-columns:repeat(2,1fr); gap:14px; }
          .card-poster-wrap { height:220px; }
          .play-circle { width:44px; height:44px; }
        }
      `}</style>
    </>
  );
};

export default Cards;
