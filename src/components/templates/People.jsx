import React, { useState, useEffect, useCallback, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PremiumLoader from "./PremiumLoader";
import Topnav from "./Topnav";
import instance from "../../utils/Axios";

// ─────────────────────────────────────────────────────────────────
// PersonCard
// ─────────────────────────────────────────────────────────────────
const DEPT_CONFIG = {
  Acting: { label: "Actor", icon: "ri-user-star-line", color: "#f4845f" },
  Directing: { label: "Director", icon: "ri-film-line", color: "#60b8f4" },
  Writing: { label: "Writer", icon: "ri-quill-pen-line", color: "#60f49e" },
  Production: { label: "Producer", icon: "ri-movie-2-line", color: "#f4d060" },
  Sound: { label: "Composer", icon: "ri-music-2-line", color: "#c084fc" },
  Camera: { label: "DP", icon: "ri-camera-lens-line", color: "#f4a260" },
};
const getDept = (dept) =>
  DEPT_CONFIG[dept] || {
    label: dept || "Talent",
    icon: "ri-user-line",
    color: "#f4845f",
  };

const PersonCard = ({ person, index }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const dept = getDept(person.known_for_department);

  const profileUrl =
    person.profile_path && !imgError
      ? `https://image.tmdb.org/t/p/w342${person.profile_path}`
      : null;

  // Known for titles — max 2
  const knownFor = (person.known_for || [])
    .slice(0, 2)
    .map((k) => k.title || k.name)
    .filter(Boolean);

  const tmdbUrl = `https://www.themoviedb.org/person/${person.id}`;

  return (
    <a
      href={tmdbUrl}
      target="_blank"
      rel="noreferrer"
      className="pc-card"
      style={{ animationDelay: `${(index % 20) * 40}ms` }}
    >
      {/* ── Portrait image ── */}
      <div className="pc-img-wrap">
        {profileUrl ? (
          <>
            {!imgLoaded && <div className="pc-img-skel" />}
            <img
              src={profileUrl}
              alt={person.name}
              className={`pc-img ${imgLoaded ? "pc-img--loaded" : ""}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </>
        ) : (
          <div className="pc-img-placeholder">
            <i className="ri-user-3-line pc-placeholder-icon" />
          </div>
        )}

        {/* ── Department badge ── */}
        <div className="pc-dept-badge" style={{ "--dept-color": dept.color }}>
          <i className={dept.icon} />
          <span>{dept.label}</span>
        </div>

        {/* ── Hover overlay ── */}
        <div className="pc-hover-overlay">
          <div className="pc-overlay-inner">
            <i className="ri-external-link-line pc-link-icon" />
            <span className="pc-view-text">View Profile</span>
          </div>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="pc-info">
        <h3 className="pc-name">{person.name}</h3>
        {knownFor.length > 0 && (
          <div className="pc-known-for">
            <span className="pc-kf-label">Known for</span>
            <div className="pc-kf-titles">
              {knownFor.map((t, i) => (
                <span key={i} className="pc-kf-pill">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </a>
  );
};

// ─────────────────────────────────────────────────────────────────
// PersonCardSkeleton
// ─────────────────────────────────────────────────────────────────
const PersonCardSkeleton = () => (
  <div className="pc-skeleton">
    <div className="pc-skel-img" />
    <div className="pc-skel-info">
      <div className="pc-skel-name" />
      <div className="pc-skel-sub" />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────
// BackButton
// ─────────────────────────────────────────────────────────────────
const BackButton = () => {
  const [hov, setHov] = useState(false);
  const handleBack = () => {
    if (window.history.length > 1) window.history.back();
    else window.location.href = "/";
  };
  return (
    <button
      className="back-btn"
      onClick={handleBack}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label="Go back"
    >
      <i
        className={`back-icon ${hov ? "ri-arrow-left-s-line" : "ri-arrow-left-line"}`}
      />
      <span>Back</span>
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────
// ScrollTopBtn
// ─────────────────────────────────────────────────────────────────
const ScrollTopBtn = () => {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const h = () => setVis(window.scrollY > 600);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  if (!vis) return null;
  return (
    <button
      className="scroll-top-btn"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      ↑
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────
// People — main
// ─────────────────────────────────────────────────────────────────
const People = () => {
  const [people, setPeople] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const pageRef = useRef(1);
  const fetchingRef = useRef(false);

  const fetchPage = useCallback(async (pg, reset = false) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setIsFetching(true);
    try {
      const { data } = await instance.get(`person/popular?page=${pg}`);
      const results = data.results || [];
      setTotalResults(data.total_results || 0);

      if (reset) {
        setPeople(results);
      } else {
        setPeople((prev) => {
          const ids = new Set(prev.map((p) => p.id));
          return [...prev, ...results.filter((r) => !ids.has(r.id))];
        });
      }
      const next = pg + 1;
      pageRef.current = next;
      setPage(next);
      setHasMore(pg < (data.total_pages || 1) && pg < 20);
    } catch (err) {
      console.error(
        "TMDB people fetch error:",
        err?.response?.data || err.message,
      );
    } finally {
      fetchingRef.current = false;
      setIsFetching(false);
      setInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(1, true);
  }, [fetchPage]);

  const loadMore = () => {
    if (!fetchingRef.current && hasMore) fetchPage(pageRef.current, false);
  };

  if (initialLoad) return <PremiumLoader />;

  return (
    <div className="people-page">
      <Topnav
        onSearch={(item) => {
          if (item?.id)
            window.open(
              `https://www.themoviedb.org/${item.media_type === "tv" ? "tv" : "movie"}/${item.id}`,
              "_blank",
            );
        }}
      />

      {/* ── Page Header ── */}
      <div className="ph-wrap">
        {/* Grain overlay */}
        <div className="ph-grain" />

        <div className="ph-back">
          <BackButton />
        </div>

        <div className="ph-content">
          <div className="ph-eyebrow">
            <span className="ph-eyebrow-line" />
            <span className="ph-eyebrow-text">TMDB · Popular</span>
            <span className="ph-eyebrow-line" />
          </div>
          <h1 className="ph-title">
            The <em>People</em>
            <br />
            Behind the Screen
          </h1>
          <p className="ph-sub">
            {totalResults.toLocaleString()} artists, actors & directors
          </p>
        </div>

        {/* Decorative number */}
        <div className="ph-deco-num" aria-hidden="true">
          PEOPLE
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="content-area">
        <InfiniteScroll
          dataLength={people.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <div className="people-grid people-grid--loader">
              {Array.from({ length: 8 }).map((_, i) => (
                <PersonCardSkeleton key={i} />
              ))}
            </div>
          }
          endMessage={
            <div className="end-message">
              🎭 You've seen all {people.length} popular people
            </div>
          }
          scrollThreshold={0.85}
          style={{ overflow: "visible" }}
        >
          <div className="people-grid">
            {people.map((person, i) => (
              <PersonCard key={person.id} person={person} index={i} />
            ))}
            {/* Fill skeletons while next page loads */}
            {isFetching &&
              people.length > 0 &&
              Array.from({ length: 4 }).map((_, i) => (
                <PersonCardSkeleton key={`sk-${i}`} />
              ))}
          </div>
        </InfiniteScroll>
      </div>

      <ScrollTopBtn />

      <style>{PAGE_CSS}</style>
    </div>
  );
};

const PAGE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=Bebas+Neue&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #0a0a0a;
    --surf:      #111111;
    --surf-2:    #181818;
    --surf-3:    #222222;
    --border:    rgba(255,255,255,.07);
    --border-h:  rgba(244,132,95,.3);
    --acc:       #f4845f;
    --acc-dim:   rgba(244,132,95,.08);
    --acc-glow:  rgba(244,132,95,.15);
    --text:      #f5f0ea;
    --text-2:    #8a7f76;
    --text-3:    #3a3530;
    --ease:      cubic-bezier(.22,1,.36,1);
    --font-disp: 'Cormorant Garamond', serif;
    --font-body: 'DM Sans', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }

  .people-page { min-height: 100vh; background: var(--bg); }

  /* ── Page Header ── */
  .ph-wrap {
    position: relative;
    min-height: 340px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0 48px 52px;
    overflow: hidden;
    background:
      radial-gradient(ellipse 70% 60% at 20% 50%, rgba(244,132,95,.06) 0%, transparent 70%),
      linear-gradient(to bottom, #0a0a0a 0%, #0f0d0b 100%);
    border-bottom: 1px solid var(--border);
  }

  /* SVG noise grain */
  .ph-grain {
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    opacity: .035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 160px 160px;
  }

  .ph-back {
    position: absolute;
    top: 20px;
    left: 48px;
    z-index: 10;
  }

  .ph-content {
    position: relative;
    z-index: 2;
    max-width: 700px;
  }

  .ph-eyebrow {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }
  .ph-eyebrow-line {
    height: 1px;
    width: 32px;
    background: var(--acc);
    opacity: .5;
    border-radius: 1px;
  }
  .ph-eyebrow-text {
    font-family: var(--font-body);
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: var(--acc);
    opacity: .7;
  }

  .ph-title {
    font-family: var(--font-disp);
    font-size: clamp(52px, 7vw, 96px);
    font-weight: 300;
    line-height: .95;
    color: var(--text);
    letter-spacing: -.01em;
  }
  .ph-title em {
    font-style: italic;
    color: var(--acc);
    font-weight: 300;
  }

  .ph-sub {
    margin-top: 18px;
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 400;
    color: var(--text-2);
    letter-spacing: .04em;
  }

  /* Large decorative word */
  .ph-deco-num {
    position: absolute;
    right: -20px;
    bottom: -10px;
    font-family: 'Bebas Neue', cursive;
    font-size: clamp(80px, 14vw, 180px);
    letter-spacing: .05em;
    color: rgba(244,132,95,.04);
    line-height: 1;
    pointer-events: none;
    user-select: none;
    z-index: 1;
  }

  /* ── Content ── */
  .content-area {
    max-width: 1440px;
    margin: 0 auto;
    padding: 48px 32px 80px;
  }

  /* ── People Grid ── */
  .people-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 24px;
  }
  .people-grid--loader { margin-top: 24px; }

  /* ── Person Card ── */
  .pc-card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    animation: pcFadeIn .5s var(--ease) both;
  }
  @keyframes pcFadeIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: none; }
  }

  /* Portrait image wrapper — 3:4 aspect */
  .pc-img-wrap {
    position: relative;
    aspect-ratio: 2 / 3;
    border-radius: 12px;
    overflow: hidden;
    background: var(--surf-2);
  }

  .pc-img-skel {
    position: absolute;
    inset: 0;
    background: linear-gradient(110deg, var(--surf-2) 30%, var(--surf-3) 50%, var(--surf-2) 70%);
    background-size: 200% 100%;
    animation: shimmer 1.6s ease-in-out infinite;
  }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  .pc-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity .35s var(--ease), transform .45s var(--ease);
  }
  .pc-img--loaded { opacity: 1; }

  .pc-img-placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surf-2);
  }
  .pc-placeholder-icon {
    font-size: 48px;
    color: var(--text-3);
    opacity: .4;
  }

  /* Department badge */
  .pc-dept-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(10,10,10,.82);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,.08);
    font-family: var(--font-body);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .07em;
    text-transform: uppercase;
    color: var(--dept-color, var(--acc));
    transition: opacity .2s;
  }
  .pc-dept-badge i { font-size: 11px; }

  /* Hover overlay */
  .pc-hover-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(10,10,10,.85) 0%, transparent 60%);
    opacity: 0;
    transition: opacity .3s var(--ease);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 20px;
  }
  .pc-overlay-inner {
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: var(--font-body);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: var(--acc);
    transform: translateY(6px);
    transition: transform .3s var(--ease);
  }
  .pc-link-icon { font-size: 14px; }
  .pc-view-text { }

  .pc-card:hover .pc-hover-overlay { opacity: 1; }
  .pc-card:hover .pc-overlay-inner { transform: translateY(0); }
  .pc-card:hover .pc-img { transform: scale(1.04); }
  .pc-card:hover .pc-img-wrap { box-shadow: 0 20px 50px rgba(0,0,0,.6), 0 0 0 1px rgba(244,132,95,.15); }

  /* Info section */
  .pc-info { padding: 0 2px; }

  .pc-name {
    font-family: var(--font-disp);
    font-size: 17px;
    font-weight: 400;
    color: var(--text);
    line-height: 1.2;
    margin-bottom: 8px;
    letter-spacing: .01em;
    transition: color .2s;
  }
  .pc-card:hover .pc-name { color: var(--acc); }

  .pc-known-for { display: flex; flex-direction: column; gap: 5px; }
  .pc-kf-label {
    font-family: var(--font-body);
    font-size: 9.5px;
    font-weight: 600;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--text-3);
  }
  .pc-kf-titles { display: flex; flex-wrap: wrap; gap: 4px; }
  .pc-kf-pill {
    font-family: var(--font-body);
    font-size: 10.5px;
    font-weight: 500;
    color: var(--text-2);
    background: var(--surf-2);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 2px 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 140px;
    transition: border-color .2s, color .2s;
  }
  .pc-card:hover .pc-kf-pill { border-color: rgba(244,132,95,.2); color: var(--text); }

  /* ── Skeleton ── */
  .pc-skeleton { display: flex; flex-direction: column; gap: 12px; }
  .pc-skel-img {
    aspect-ratio: 2 / 3;
    border-radius: 12px;
    background: linear-gradient(110deg, var(--surf-2) 30%, var(--surf-3) 50%, var(--surf-2) 70%);
    background-size: 200% 100%;
    animation: shimmer 1.6s ease-in-out infinite;
  }
  .pc-skel-info { display: flex; flex-direction: column; gap: 7px; padding: 0 2px; }
  .pc-skel-name { height: 16px; border-radius: 4px; background: var(--surf-2); width: 75%; animation: shimmer 1.6s ease-in-out infinite; }
  .pc-skel-sub  { height: 11px; border-radius: 4px; background: var(--surf-2); width: 55%; animation: shimmer 1.6s ease-in-out .2s infinite; }

  /* ── Back Button ── */
  .back-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 16px 8px 12px; border-radius: 999px;
    background: rgba(10,10,10,.82); border: 1.5px solid rgba(255,255,255,.08);
    color: rgba(245,240,234,.45); font-family: var(--font-body);
    font-size: 13px; font-weight: 600; letter-spacing: .04em;
    cursor: pointer; backdrop-filter: blur(10px);
    transition: all .22s var(--ease);
  }
  .back-btn:hover {
    border-color: rgba(244,132,95,.35); color: var(--acc);
    background: rgba(244,132,95,.06); transform: translateX(-2px);
  }
  .back-icon { font-size: 18px; display: flex; align-items: center; }

  /* ── Scroll top ── */
  .scroll-top-btn {
    position: fixed; bottom: 32px; right: 32px; z-index: 200;
    width: 44px; height: 44px; border-radius: 50%;
    background: var(--acc); color: #0a0a0a; font-size: 18px; font-weight: 700;
    border: none; cursor: pointer; box-shadow: 0 8px 24px rgba(0,0,0,.5);
    display: flex; align-items: center; justify-content: center;
    transition: transform .2s, background .2s;
  }
  .scroll-top-btn:hover { transform: translateY(-3px); background: #f8a080; }

  /* ── Infinite scroll states ── */
  .scroll-loader { padding: 40px 0; }

  .end-message {
    text-align: center; padding: 56px 0 24px;
    font-family: var(--font-body); font-size: 14px;
    color: var(--text-2); letter-spacing: .04em;
    border-top: 1px solid var(--border);
    margin-top: 24px;
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .people-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 16px; }
  }
  @media (max-width: 600px) {
    .ph-wrap     { min-height: 280px; padding: 0 20px 40px; }
    .ph-back     { top: 16px; left: 20px; }
    .ph-deco-num { font-size: 80px; }
    .content-area { padding: 32px 16px 60px; }
    .people-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px; }
    .scroll-top-btn { bottom: 20px; right: 20px; }
  }
`;

export default People;
