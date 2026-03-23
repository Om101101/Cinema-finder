import React from "react";

function Header({ data }) {
  if (!data) return null; // safety check

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600&display=swap');

        /* ══ HEADER SHELL ══ */
        .hdr-root {
          position: relative;
          width: 100%;
          height: 72vh;
          min-height: 420px;
          overflow: hidden;
          font-family: 'Outfit', sans-serif;
        }

        /* ── Background image layer ── */
        .hdr-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center top;
          transform: scale(1.04);
          animation: hdr-zoom 18s ease-in-out infinite alternate;
          transition: background-image 0.6s ease;
        }
        @keyframes hdr-zoom {
          from { transform: scale(1.04); }
          to   { transform: scale(1.12); }
        }

        /* ── Gradient overlays ── */
        /* bottom fade to dark */
        .hdr-gradient-bottom {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            #0c0b13        0%,
            rgba(12,11,19,0.85) 30%,
            rgba(12,11,19,0.35) 60%,
            transparent    100%
          );
        }
        /* left vignette for text readability */
        .hdr-gradient-left {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(12,11,19,0.78) 0%,
            rgba(12,11,19,0.3)  45%,
            transparent         100%
          );
        }
        /* subtle top edge */
        .hdr-gradient-top {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(12,11,19,0.5) 0%,
            transparent        18%
          );
        }

        /* ── Film-grain texture ── */
        .hdr-grain {
          position: absolute;
          inset: 0;
          opacity: 0.055;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px;
          pointer-events: none;
        }

        /* ── Content ── */
        .hdr-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 0 48px 44px;
          gap: 0;
        }

        /* media type badge */
        .hdr-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #a89cf7;
          background: rgba(101,86,205,0.18);
          border: 1px solid rgba(101,86,205,0.35);
          border-radius: 6px;
          padding: 4px 11px;
          margin-bottom: 14px;
          width: fit-content;
          animation: hdr-fadein 0.7s ease both;
        }
        .hdr-badge-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #6556CD;
          box-shadow: 0 0 8px rgba(101,86,205,0.8);
          animation: hdr-blink 2s ease-in-out infinite;
        }
        @keyframes hdr-blink {
          0%,100%{ opacity:1; }
          50%    { opacity:0.4; }
        }

        /* title */
        .hdr-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(40px, 6vw, 78px);
          line-height: 0.95;
          letter-spacing: 0.03em;
          color: #ffffff;
          text-shadow:
            0 2px 30px rgba(0,0,0,0.7),
            0 0  80px rgba(101,86,205,0.18);
          margin-bottom: 16px;
          animation: hdr-fadein 0.7s 0.1s ease both;
          max-width: 700px;
        }

        /* meta row — rating, year, lang */
        .hdr-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 14px;
          animation: hdr-fadein 0.7s 0.2s ease both;
          flex-wrap: wrap;
        }
        .hdr-meta-chip {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.58);
        }
        .hdr-meta-chip i { font-size: 13px; color: rgba(168,156,247,0.75); }
        .hdr-meta-sep {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
        }

        /* overview */
        .hdr-overview {
          font-size: 14px;
          font-weight: 400;
          line-height: 1.7;
          color: rgba(255,255,255,0.60);
          max-width: 560px;
          margin-bottom: 28px;
          animation: hdr-fadein 0.7s 0.3s ease both;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* CTA buttons */
        .hdr-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          animation: hdr-fadein 0.7s 0.4s ease both;
          flex-wrap: wrap;
        }
        .hdr-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 26px;
          border-radius: 100px;
          background: linear-gradient(120deg, #6556CD, #4338ca);
          color: #fff;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          border: none;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
          box-shadow: 0 6px 24px rgba(101,86,205,0.45);
          text-decoration: none;
        }
        .hdr-btn-primary:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 10px 32px rgba(101,86,205,0.6);
          filter: brightness(1.1);
        }
        .hdr-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          border-radius: 100px;
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.75);
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.03em;
          border: 1px solid rgba(255,255,255,0.12);
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          backdrop-filter: blur(8px);
        }
        .hdr-btn-secondary:hover {
          background: rgba(255,255,255,0.12);
          color: #fff;
          border-color: rgba(255,255,255,0.22);
          transform: translateY(-2px);
        }

        /* vote star */
        .hdr-vote {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border-radius: 100px;
          background: rgba(251,191,36,0.1);
          border: 1px solid rgba(251,191,36,0.25);
          color: #fbbf24;
          font-size: 12px;
          font-weight: 600;
        }
        .hdr-vote i { font-size: 13px; }

        /* scroll hint */
        .hdr-scroll-hint {
          position: absolute;
          bottom: 20px;
          right: 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          opacity: 0.35;
          animation: hdr-fadein 1s 0.8s ease both;
        }
        .hdr-scroll-hint span {
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #fff;
          writing-mode: vertical-lr;
        }
        .hdr-scroll-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, #fff, transparent);
          animation: hdr-scroll-line 1.6s ease-in-out infinite;
        }
        @keyframes hdr-scroll-line {
          0%   { transform: scaleY(0); transform-origin: top; opacity: 1; }
          50%  { transform: scaleY(1); transform-origin: top; opacity: 1; }
          100% { transform: scaleY(1); transform-origin: bottom; opacity: 0; }
        }

        @keyframes hdr-fadein {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

        /* ══ RESPONSIVE ══ */
        @media (max-width: 1024px) {
          .hdr-content { padding: 0 32px 36px; }
          .hdr-title   { font-size: clamp(36px, 7vw, 62px); }
        }

        @media (max-width: 768px) {
          .hdr-root    { height: 62vh; min-height: 360px; }
          .hdr-content { padding: 0 20px 28px; }
          .hdr-title   { font-size: clamp(30px, 9vw, 50px); }
          .hdr-overview{ font-size: 13px; -webkit-line-clamp: 2; }
          .hdr-gradient-left { display: none; }
          .hdr-btn-primary, .hdr-btn-secondary { font-size: 12px; padding: 9px 18px; }
          .hdr-scroll-hint { display: none; }
        }

        @media (max-width: 480px) {
          .hdr-root    { height: 58vh; min-height: 320px; }
          .hdr-content { padding: 0 16px 24px; }
          .hdr-title   { font-size: clamp(28px, 10vw, 44px); margin-bottom: 10px; }
          .hdr-meta    { gap: 10px; margin-bottom: 10px; }
          .hdr-overview{ display: none; }
          .hdr-actions { gap: 8px; }
        }
      `}</style>

      <div className="hdr-root">
        {/* Background image */}
        <div
          className="hdr-bg"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${
              data.backdrop_path || data.poster_path || data.profile_path
            })`,
          }}
        />

        {/* Overlay layers */}
        <div className="hdr-gradient-bottom" />
        <div className="hdr-gradient-left" />
        <div className="hdr-gradient-top" />
        <div className="hdr-grain" />

        {/* Content */}
        <div className="hdr-content">
          {/* Badge */}
          {data.media_type && (
            <div className="hdr-badge">
              <span className="hdr-badge-dot" />
              {data.media_type === "tv"
                ? "TV Series"
                : data.media_type === "movie"
                  ? "Movie"
                  : "Trending"}
            </div>
          )}

          {/* Title */}
          <h1 className="hdr-title">
            {data.title || data.name || data.original_name}
          </h1>

          {/* Meta chips */}
          <div className="hdr-meta">
            {data.vote_average > 0 && (
              <>
                <div className="hdr-vote">
                  <i className="ri-star-fill" />
                  {data.vote_average?.toFixed(1)}
                </div>
                <span className="hdr-meta-sep" />
              </>
            )}
            {(data.release_date || data.first_air_date) && (
              <>
                <div className="hdr-meta-chip">
                  <i className="ri-calendar-line" />
                  {(data.release_date || data.first_air_date)?.slice(0, 4)}
                </div>
                <span className="hdr-meta-sep" />
              </>
            )}
            {data.original_language && (
              <div className="hdr-meta-chip">
                <i className="ri-translate-2" />
                {data.original_language?.toUpperCase()}
              </div>
            )}
          </div>

          {/* Overview */}
          <p className="hdr-overview">
            {data.overview?.slice(0, 180)}
            {data.overview?.length > 180 ? "…" : ""}
          </p>

          {/* Action buttons */}
          <div className="hdr-actions">
            <button className="hdr-btn-primary">
              <i className="ri-play-fill" />
              Watch Now
            </button>
            <button className="hdr-btn-secondary">
              <i className="ri-information-line" />
              More Info
            </button>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="hdr-scroll-hint">
          <div className="hdr-scroll-line" />
          <span>scroll</span>
        </div>
      </div>
    </>
  );
}

export default Header;
