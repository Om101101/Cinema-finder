import React, { useEffect, useState } from "react";
import axios from "../../utils/Axios";

function TrailerModal({ item, onClose }) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!item) return;

    const fetchTrailer = async () => {
      setLoading(true);
      setError(false);
      setTrailerKey(null);

      try {
        // media_type could be "movie" or "tv"; fallback to "movie"
        const type = item.media_type === "tv" ? "tv" : "movie";
        const { data } = await axios.get(`/${type}/${item.id}/videos`);

        // Prefer official YouTube trailer, then teaser, then any YouTube video
        const videos = data.results || [];
        const trailer =
          videos.find(
            (v) => v.site === "YouTube" && v.type === "Trailer" && v.official,
          ) ||
          videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
          videos.find((v) => v.site === "YouTube" && v.type === "Teaser") ||
          videos.find((v) => v.site === "YouTube");

        if (trailer) {
          setTrailerKey(trailer.key);
        } else {
          setError(true);
        }
      } catch (err) {
        console.log("Trailer fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTrailer();
  }, [item]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!item) return null;

  const title = item.title || item.name || "Untitled";
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@400;500;600&display=swap');

        /* ── Backdrop ── */
        .tm-backdrop {
          position: fixed; inset: 0; z-index: 999;
          background: rgba(8, 7, 14, 0.88);
          backdrop-filter: blur(14px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: tmFadeIn 0.22s ease;
        }
        @keyframes tmFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ── Modal box ── */
        .tm-modal {
          width: 100%; max-width: 860px;
          background: #13111d;
          border: 1px solid rgba(101,86,205,0.22);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(101,86,205,0.1);
          animation: tmSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1);
          font-family: 'Outfit', sans-serif;
        }
        @keyframes tmSlideUp {
          from { opacity: 0; transform: translateY(32px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }

        /* ── Header bar ── */
        .tm-header {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .tm-title-wrap { display: flex; align-items: center; gap: 10px; }
        .tm-accent-bar {
          width: 3px; height: 24px; border-radius: 3px;
          background: linear-gradient(180deg, #6556CD, rgba(101,86,205,0.3));
        }
        .tm-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px; letter-spacing: 0.05em;
          color: #fff; margin: 0;
        }
        .tm-year {
          font-size: 13px; color: rgba(255,255,255,0.35);
          font-weight: 500; margin-top: 1px;
        }

        /* close button */
        .tm-close {
          width: 34px; height: 34px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.6);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 18px;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .tm-close:hover {
          background: rgba(220,50,50,0.2);
          border-color: rgba(220,50,50,0.4);
          color: #ff6b6b;
        }

        /* ── Video area ── */
        .tm-video-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          background: #0c0b13;
        }
        .tm-iframe {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          border: none;
        }

        /* Loading state */
        .tm-loading {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 16px; background: #0c0b13;
        }
        .tm-spinner {
          width: 44px; height: 44px; position: relative;
        }
        .tm-ring1 {
          position: absolute; inset: 0; border-radius: 50%;
          border: 2px solid transparent;
          border-top-color: #6556CD;
          animation: tmSpin 0.9s linear infinite;
        }
        .tm-ring2 {
          position: absolute; inset: 7px; border-radius: 50%;
          border: 2px solid transparent;
          border-bottom-color: rgba(168,156,247,0.5);
          animation: tmSpin 1.4s linear infinite reverse;
        }
        @keyframes tmSpin { to { transform: rotate(360deg); } }
        .tm-loading-text {
          font-size: 13px; color: rgba(255,255,255,0.4); letter-spacing: 0.04em;
        }

        /* Error state */
        .tm-error {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 12px; background: #0c0b13;
        }
        .tm-error-icon {
          width: 52px; height: 52px; border-radius: 50%;
          background: rgba(220,50,50,0.12);
          border: 1px solid rgba(220,50,50,0.25);
          display: flex; align-items: center; justify-content: center;
          color: #ff6b6b; font-size: 22px;
        }
        .tm-error-text {
          font-size: 14px; color: rgba(255,255,255,0.45);
          text-align: center; line-height: 1.5; max-width: 260px;
        }
        .tm-error-text strong { color: rgba(255,255,255,0.7); display: block; margin-bottom: 4px; }

        /* ── Footer ── */
        .tm-footer {
          padding: 12px 20px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex; align-items: center; gap: 8px;
        }
        .tm-yt-badge {
          display: flex; align-items: center; gap: 6px;
          padding: 4px 12px; border-radius: 20px;
          background: rgba(255,0,0,0.1);
          border: 1px solid rgba(255,0,0,0.2);
          font-size: 12px; font-weight: 600; color: #ff4444;
        }
        .tm-yt-badge i { font-size: 14px; }
        .tm-footer-hint {
          font-size: 11px; color: rgba(255,255,255,0.25); margin-left: auto;
        }

        /* Mobile */
        @media (max-width: 600px) {
          .tm-modal { border-radius: 16px; }
          .tm-title  { font-size: 18px; }
        }
      `}</style>

      {/* Backdrop — click outside to close */}
      <div className="tm-backdrop" onClick={onClose}>
        <div className="tm-modal" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="tm-header">
            <div className="tm-title-wrap">
              <div className="tm-accent-bar" />
              <div>
                <h2 className="tm-title">{title}</h2>
                {year && <div className="tm-year">{year}</div>}
              </div>
            </div>
            <button className="tm-close" onClick={onClose} aria-label="Close">
              <i className="ri-close-line" />
            </button>
          </div>

          {/* Video */}
          <div className="tm-video-wrap">
            {loading && (
              <div className="tm-loading">
                <div className="tm-spinner">
                  <div className="tm-ring1" />
                  <div className="tm-ring2" />
                </div>
                <span className="tm-loading-text">
                  Searching for trailer…
                </span>
              </div>
            )}

            {!loading && error && (
              <div className="tm-error">
                <div className="tm-error-icon">
                  <i className="ri-video-off-line" />
                </div>
                <div className="tm-error-text">
                  <strong>Trailer not available</strong>
                  The trailer for this movie is currently not available
                </div>
              </div>
            )}

            {!loading && !error && trailerKey && (
              <iframe
                className="tm-iframe"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
                title={`${title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>

          {/* Footer */}
          <div className="tm-footer">
            <div className="tm-yt-badge">
              <i className="ri-youtube-fill" />
              YouTube Trailer
            </div>
            <span className="tm-footer-hint">
              Close it by pressing ESC or clicking outside.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default TrailerModal;
