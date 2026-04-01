import React, { useState, useEffect, useCallback, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PremiumLoader from "./PremiumLoader";
import Topnav from "./Topnav";
import Cards from "./Cards";
import instance from "../../utils/Axios";

// ─────────────────────────────────────────────────────────────────
// DropdownFilter — same as TrendingPage, fully self-contained
// ─────────────────────────────────────────────────────────────────
const MEDIA_TYPES = [
  { id: "all", label: "All", icon: "ri-apps-2-line", desc: "Everything" },
  { id: "movie", label: "Movies", icon: "ri-film-line", desc: "Feature films" },
  { id: "tv", label: "TV Shows", icon: "ri-tv-2-line", desc: "Series & shows" },
];
const LANGUAGES = [
  { id: "en", label: "English", flag: "🇺🇸", native: "English" },
  { id: "hi", label: "Hindi", flag: "🇮🇳", native: "हिन्दी" },
  { id: "ta", label: "Tamil", flag: "🇮🇳", native: "தமிழ்" },
  { id: "te", label: "Telugu", flag: "🇮🇳", native: "తెలుగు" },
  { id: "ko", label: "Korean", flag: "🇰🇷", native: "한국어" },
  { id: "ja", label: "Japanese", flag: "🇯🇵", native: "日本語" },
  { id: "fr", label: "French", flag: "🇫🇷", native: "Français" },
  { id: "es", label: "Spanish", flag: "🇪🇸", native: "Español" },
  { id: "de", label: "German", flag: "🇩🇪", native: "Deutsch" },
  { id: "zh", label: "Chinese", flag: "🇨🇳", native: "中文" },
  { id: "pt", label: "Portuguese", flag: "🇧🇷", native: "Português" },
  { id: "it", label: "Italian", flag: "🇮🇹", native: "Italiano" },
];
const SORT_OPTIONS = [
  { id: "popularity.desc", label: "Most Popular", icon: "ri-fire-line" },
  { id: "vote_average.desc", label: "Top Rated", icon: "ri-star-line" },
  { id: "release_date.desc", label: "Newest First", icon: "ri-calendar-line" },
  { id: "release_date.asc", label: "Oldest First", icon: "ri-history-line" },
];
const DF_TABS = [
  { id: "type", icon: "ri-apps-2-line", label: "Type" },
  { id: "lang", icon: "ri-global-line", label: "Language" },
  { id: "genre", icon: "ri-price-tag-3-line", label: "Genre" },
  { id: "sort", icon: "ri-sort-desc", label: "Sort" },
];
const EMPTY_FILTERS = {
  mediaType: "all",
  language: "",
  genre: "",
  sortBy: "popularity.desc",
};

function useGenres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      instance.get("/genre/movie/list"),
      instance.get("/genre/tv/list"),
    ])
      .then(([m, t]) => {
        if (cancelled) return;
        const merged = [...m.data.genres, ...t.data.genres];
        const unique = Array.from(
          new Map(merged.map((g) => [g.id, g])).values(),
        );
        setGenres(unique.sort((a, b) => a.name.localeCompare(b.name)));
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return { genres, loading, error };
}

const TypeTab = ({ filters, update }) => (
  <div className="df-section">
    <p className="df-hint">What kind of content are you looking for?</p>
    <div className="df-type-grid">
      {MEDIA_TYPES.map((m) => {
        const active = filters.mediaType === m.id;
        return (
          <button
            key={m.id}
            className={`df-type-card ${active ? "df-type-card--active" : ""}`}
            onClick={() => update("mediaType", m.id)}
            aria-pressed={active}
          >
            <i className={`${m.icon} df-type-icon`} />
            <span className="df-type-label">{m.label}</span>
            <span className="df-type-desc">{m.desc}</span>
            {active && (
              <span className="df-check-ring">
                <i className="ri-check-line" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

const LangTab = ({ filters, update }) => {
  const [search, setSearch] = useState("");
  const filtered = search.trim()
    ? LANGUAGES.filter(
        (l) =>
          l.label.toLowerCase().includes(search.toLowerCase()) ||
          l.native.toLowerCase().includes(search.toLowerCase()),
      )
    : LANGUAGES;
  return (
    <div className="df-section">
      <div className="df-search-box">
        <i className="ri-search-line df-search-icon" />
        <input
          className="df-search-input"
          placeholder="Search language…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="df-search-clear" onClick={() => setSearch("")}>
            <i className="ri-close-line" />
          </button>
        )}
      </div>
      {filtered.length === 0 ? (
        <p className="df-empty">No languages match "{search}"</p>
      ) : (
        <div className="df-lang-grid">
          {filtered.map((l) => {
            const active = filters.language === l.id;
            return (
              <button
                key={l.id}
                className={`df-lang-card ${active ? "df-lang-card--active" : ""}`}
                onClick={() => update("language", l.id)}
              >
                <span className="df-flag">{l.flag}</span>
                <span className="df-lang-info">
                  <span className="df-lang-name">{l.label}</span>
                  <span className="df-lang-native">{l.native}</span>
                </span>
                {active && <i className="ri-check-line df-lang-check" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const GenreTab = ({ filters, update, genres, loading, error }) => {
  const [search, setSearch] = useState("");
  const filtered = search.trim()
    ? genres.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))
    : genres;
  if (error)
    return (
      <div className="df-error">
        <i className="ri-error-warning-line" />
        <p>Failed to load genres.</p>
      </div>
    );
  return (
    <div className="df-section">
      <div className="df-search-box">
        <i className="ri-search-line df-search-icon" />
        <input
          className="df-search-input"
          placeholder="Search genre…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="df-search-clear" onClick={() => setSearch("")}>
            <i className="ri-close-line" />
          </button>
        )}
      </div>
      {loading ? (
        <div className="df-skel-grid">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="df-skel-chip"
              style={{ width: `${55 + ((i * 17) % 55)}px` }}
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="df-empty">No genres match "{search}"</p>
      ) : (
        <div className="df-chip-grid">
          {filtered.map((g) => {
            const active = filters.genre === g.id;
            return (
              <button
                key={g.id}
                className={`df-chip ${active ? "df-chip--active" : ""}`}
                onClick={() => update("genre", g.id)}
              >
                {active && (
                  <i
                    className="ri-check-line"
                    style={{ fontSize: 11, marginRight: 3 }}
                  />
                )}
                {g.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const SortTab = ({ filters, update }) => (
  <div className="df-section">
    <p className="df-hint">How should results be ordered?</p>
    <div className="df-sort-list">
      {SORT_OPTIONS.map((s) => {
        const active = filters.sortBy === s.id;
        return (
          <button
            key={s.id}
            className={`df-sort-row ${active ? "df-sort-row--active" : ""}`}
            onClick={() => update("sortBy", s.id)}
          >
            <i className={`${s.icon} df-sort-icon`} />
            <span
              className={`df-sort-radio ${active ? "df-sort-radio--active" : ""}`}
            />
            <span className="df-sort-label">{s.label}</span>
            {active && <i className="ri-check-line df-sort-check" />}
          </button>
        );
      })}
    </div>
  </div>
);

const DropdownFilter = ({ onFilterChange }) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("type");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const { genres, loading: genreLoading, error: genreError } = useGenres();
  const dropRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onOutside = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("touchstart", onOutside);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("touchstart", onOutside);
    };
  }, [open]);

  const update = useCallback(
    (key, value) => {
      setFilters((prev) => {
        const isSame = prev[key] === value;
        const isRequired = key === "mediaType" || key === "sortBy";
        const next = { ...prev, [key]: isSame && !isRequired ? "" : value };
        onFilterChange?.(next);
        return next;
      });
    },
    [onFilterChange],
  );

  const clearAll = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    onFilterChange?.(EMPTY_FILTERS);
  }, [onFilterChange]);

  const activeCount = [
    filters.mediaType !== "all",
    !!filters.language,
    !!filters.genre,
    filters.sortBy !== "popularity.desc",
  ].filter(Boolean).length;

  const summaryParts = [
    filters.mediaType !== "all" &&
      MEDIA_TYPES.find((m) => m.id === filters.mediaType)?.label,
    filters.language && LANGUAGES.find((l) => l.id === filters.language)?.label,
    filters.genre && genres.find((g) => g.id === filters.genre)?.name,
    filters.sortBy !== "popularity.desc" &&
      SORT_OPTIONS.find((s) => s.id === filters.sortBy)?.label,
  ].filter(Boolean);

  const tabHas = (id) =>
    (id === "type" && filters.mediaType !== "all") ||
    (id === "lang" && !!filters.language) ||
    (id === "genre" && !!filters.genre) ||
    (id === "sort" && filters.sortBy !== "popularity.desc");

  const renderTab = () => {
    switch (tab) {
      case "type":
        return <TypeTab filters={filters} update={update} />;
      case "lang":
        return <LangTab filters={filters} update={update} />;
      case "genre":
        return (
          <GenreTab
            filters={filters}
            update={update}
            genres={genres}
            loading={genreLoading}
            error={genreError}
          />
        );
      case "sort":
        return <SortTab filters={filters} update={update} />;
      default:
        return null;
    }
  };

  return (
    <>
      <style>{DF_CSS}</style>
      <div className="df-root" ref={dropRef}>
        <button
          ref={triggerRef}
          className={`df-trigger${open ? " df-trigger--open" : ""}${activeCount > 0 ? " df-trigger--active" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <i className="ri-sliders-2-line df-trig-icon" />
          <span className="df-trig-text">
            {summaryParts.length ? summaryParts.join(" · ") : "Filters"}
          </span>
          {activeCount > 0 && <span className="df-badge">{activeCount}</span>}
          <i
            className={`ri-arrow-down-s-line df-trig-arrow${open ? " df-trig-arrow--up" : ""}`}
          />
        </button>

        {open && (
          <div
            className="df-panel"
            role="dialog"
            aria-label="Content filters"
            aria-modal="true"
          >
            <div className="df-header">
              <div className="df-header-left">
                <i className="ri-equalizer-3-line df-header-icon" />
                <span className="df-header-title">Filter & Sort</span>
                {activeCount > 0 && (
                  <span className="df-header-count">{activeCount} active</span>
                )}
              </div>
              <div className="df-header-right">
                {activeCount > 0 && (
                  <button className="df-clear-btn" onClick={clearAll}>
                    <i className="ri-delete-bin-line" /> Clear
                  </button>
                )}
                <button
                  className="df-close-btn"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  <i className="ri-close-line" />
                </button>
              </div>
            </div>
            <div className="df-tabs" role="tablist">
              {DF_TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  className={`df-tab${tab === t.id ? " df-tab--active" : ""}`}
                  onClick={() => setTab(t.id)}
                >
                  <i className={t.icon} />
                  <span>{t.label}</span>
                  {tabHas(t.id) && <span className="df-dot" />}
                </button>
              ))}
            </div>
            <div className="df-body" key={tab}>
              {renderTab()}
            </div>
            {summaryParts.length > 0 && (
              <div className="df-footer">
                <span className="df-footer-label">Filtering by</span>
                <div className="df-footer-chips">
                  {summaryParts.map((p, i) => (
                    <span key={i} className="df-footer-chip">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

const DF_CSS = `
  @import url('https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css');
  .df-root {
    --acc:#c084fc; --acc-2:#e9d5ff; --acc-glow:rgba(192,132,252,.18);
    --acc-dim:rgba(192,132,252,.08); --acc-border:rgba(192,132,252,.28);
    --bg:#08080f; --surf:#0f0f1c; --surf-2:#161625; --surf-3:#1e1e32;
    --border:rgba(255,255,255,.07); --border-h:rgba(192,132,252,.25);
    --text:#f0eaff; --text-2:#9b8ab0; --text-3:#4a4060;
    --radius:16px; --ease:cubic-bezier(.22,1,.36,1); --font:'DM Sans',sans-serif;
    font-family:var(--font); position:relative; display:inline-block; z-index:100;
  }
  .df-root *, .df-root *::before, .df-root *::after { box-sizing:border-box; }
  .df-root button { cursor:pointer; font-family:var(--font); }

  .df-trigger {
    display:inline-flex; align-items:center; gap:8px;
    padding:0 16px; height:44px; border-radius:999px;
    background:var(--surf-2); border:1.5px solid var(--border);
    color:var(--text-2); font-size:13.5px; font-weight:500;
    white-space:nowrap; transition:all .2s var(--ease); max-width:min(300px,72vw);
  }
  .df-trigger:hover { border-color:var(--border-h); color:var(--text); background:var(--acc-dim); }
  .df-trigger--open, .df-trigger--active { border-color:var(--acc-border); background:var(--acc-dim); color:var(--text); }
  .df-trigger--open { box-shadow:0 0 0 3px var(--acc-glow); }
  .df-trig-icon { font-size:16px; color:var(--acc); flex-shrink:0; }
  .df-trig-text { flex:1; overflow:hidden; text-overflow:ellipsis; max-width:180px; }
  .df-badge {
    min-width:20px; height:20px; border-radius:999px; background:var(--acc);
    color:#08080f; font-size:10px; font-weight:700;
    display:flex; align-items:center; justify-content:center; padding:0 5px; flex-shrink:0;
    animation:dfpop .2s var(--ease);
  }
  @keyframes dfpop { from{scale:.4;opacity:0} to{scale:1;opacity:1} }
  .df-trig-arrow { font-size:18px; color:var(--text-3); flex-shrink:0; transition:transform .2s var(--ease),color .2s; }
  .df-trig-arrow--up { transform:rotate(180deg); color:var(--acc); }

  .df-panel {
    position:absolute; top:calc(100% + 12px); right:0; left:auto;
    width:min(460px,92vw);
    background:var(--surf); border:1px solid var(--border); border-radius:var(--radius);
    box-shadow:0 40px 80px rgba(0,0,0,.8),0 0 0 1px rgba(255,255,255,.04),inset 0 1px 0 rgba(255,255,255,.05);
    overflow:hidden; animation:dfslide .25s var(--ease); z-index:300;
  }
  @keyframes dfslide { from{opacity:0;transform:translateY(-8px) scale(.98)} to{opacity:1;transform:none} }

  .df-header { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid var(--border); }
  .df-header-left  { display:flex; align-items:center; gap:9px; }
  .df-header-icon  { font-size:16px; color:var(--acc); }
  .df-header-title { font-family:'Bebas Neue',cursive; font-size:16px; color:var(--text); letter-spacing:.05em; }
  .df-header-count { font-size:11px; font-weight:600; color:var(--acc); background:var(--acc-dim); border:1px solid var(--acc-border); border-radius:999px; padding:2px 9px; }
  .df-header-right { display:flex; align-items:center; gap:6px; }
  .df-clear-btn { display:flex; align-items:center; gap:5px; padding:5px 10px; border-radius:8px; border:none; background:transparent; color:var(--text-3); font-size:12px; font-weight:600; transition:all .15s; }
  .df-clear-btn:hover { color:#f87171; background:rgba(248,113,113,.1); }
  .df-close-btn { width:30px; height:30px; border-radius:50%; border:none; background:var(--surf-3); color:var(--text-2); font-size:17px; display:flex; align-items:center; justify-content:center; transition:all .15s; }
  .df-close-btn:hover { color:var(--text); }

  .df-tabs { display:flex; gap:2px; padding:10px 14px 0; border-bottom:1px solid var(--border); overflow-x:auto; scrollbar-width:none; }
  .df-tabs::-webkit-scrollbar { display:none; }
  .df-tab { position:relative; display:flex; align-items:center; gap:5px; padding:8px 13px; border-radius:8px 8px 0 0; background:transparent; border:none; border-bottom:2px solid transparent; color:var(--text-3); font-size:13px; font-weight:500; white-space:nowrap; transition:all .15s; }
  .df-tab:hover { color:var(--text-2); background:rgba(255,255,255,.03); }
  .df-tab--active { color:var(--text)!important; border-bottom-color:var(--acc)!important; background:rgba(192,132,252,.06)!important; }
  .df-tab i { font-size:14px; }
  .df-dot { position:absolute; top:8px; right:7px; width:5px; height:5px; border-radius:50%; background:var(--acc); }

  .df-body { padding:18px 20px; overflow-y:auto; max-height:310px; scrollbar-width:thin; scrollbar-color:var(--surf-3) transparent; animation:dfbody .18s var(--ease); }
  @keyframes dfbody { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:none} }
  .df-hint  { font-size:12px; color:var(--text-3); margin-bottom:14px; }
  .df-empty { font-size:13px; color:var(--text-3); text-align:center; padding:24px 0; }
  .df-error { text-align:center; padding:24px; color:#f87171; display:flex; flex-direction:column; align-items:center; gap:8px; }
  .df-error i { font-size:28px; } .df-error p { font-size:13px; margin:0; }

  .df-search-box { display:flex; align-items:center; gap:8px; background:var(--surf-2); border:1px solid var(--border); border-radius:10px; padding:0 12px; margin-bottom:13px; transition:border-color .15s; }
  .df-search-box:focus-within { border-color:var(--acc-border); }
  .df-search-icon  { font-size:15px; color:var(--text-3); flex-shrink:0; }
  .df-search-input { flex:1; background:transparent; border:none; outline:none; height:38px; font-size:13px; font-family:var(--font); color:var(--text); }
  .df-search-input::placeholder { color:var(--text-3); }
  .df-search-clear { background:transparent; border:none; color:var(--text-3); font-size:16px; padding:0; display:flex; align-items:center; }
  .df-search-clear:hover { color:var(--text-2); }

  .df-type-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
  .df-type-card { position:relative; display:flex; flex-direction:column; align-items:center; gap:7px; padding:20px 10px 16px; border-radius:14px; border:1.5px solid var(--border); background:var(--surf-2); color:var(--text-3); font-size:13px; font-weight:500; transition:all .2s var(--ease); }
  .df-type-card:hover { border-color:var(--border-h); color:var(--text-2); background:var(--acc-dim); }
  .df-type-card--active { border-color:var(--acc)!important; background:linear-gradient(145deg,rgba(192,132,252,.15),rgba(192,132,252,.05))!important; color:var(--text)!important; box-shadow:0 0 24px var(--acc-glow); }
  .df-type-icon { font-size:27px; }
  .df-type-card--active .df-type-icon { color:var(--acc); }
  .df-type-label { font-weight:600; font-size:13px; }
  .df-type-desc  { font-size:11px; color:var(--text-3); }
  .df-check-ring { position:absolute; top:9px; right:9px; width:20px; height:20px; border-radius:50%; background:var(--acc); color:#08080f; font-size:11px; display:flex; align-items:center; justify-content:center; animation:dfpop .2s var(--ease); }

  .df-lang-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(130px,1fr)); gap:8px; }
  .df-lang-card { display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:10px; border:1.5px solid var(--border); background:var(--surf-2); color:var(--text-3); transition:all .15s; }
  .df-lang-card:hover { border-color:var(--border-h); color:var(--text); }
  .df-lang-card--active { border-color:var(--acc)!important; background:var(--acc-dim)!important; color:var(--text)!important; }
  .df-flag { font-size:20px; line-height:1; flex-shrink:0; }
  .df-lang-info  { flex:1; min-width:0; text-align:left; }
  .df-lang-name  { display:block; font-size:13px; font-weight:500; }
  .df-lang-native { display:block; font-size:10px; color:var(--text-3); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .df-lang-check { font-size:14px; color:var(--acc); flex-shrink:0; margin-left:auto; }

  .df-chip-grid { display:flex; flex-wrap:wrap; gap:7px; }
  .df-chip { display:inline-flex; align-items:center; padding:5px 13px; border-radius:999px; border:1px solid var(--border); background:transparent; color:var(--text-3); font-size:12.5px; font-weight:500; transition:all .15s; }
  .df-chip:hover { border-color:var(--border-h); color:var(--text); background:var(--acc-dim); }
  .df-chip--active { border-color:var(--acc)!important; background:var(--acc-dim)!important; color:var(--acc)!important; font-weight:600; }
  .df-skel-grid { display:flex; flex-wrap:wrap; gap:7px; }
  .df-skel-chip { height:30px; border-radius:999px; background:var(--surf-2); animation:dfpulse 1.4s ease-in-out infinite; }
  @keyframes dfpulse { 0%,100%{opacity:.5} 50%{opacity:.2} }

  .df-sort-list { display:flex; flex-direction:column; gap:6px; }
  .df-sort-row { display:flex; align-items:center; gap:12px; padding:13px 15px; border-radius:11px; border:1.5px solid var(--border); background:var(--surf-2); color:var(--text-3); text-align:left; transition:all .15s; }
  .df-sort-row:hover { border-color:var(--border-h); color:var(--text); background:var(--acc-dim); }
  .df-sort-row--active { border-color:var(--acc)!important; background:var(--acc-dim)!important; color:var(--text)!important; }
  .df-sort-icon { font-size:17px; color:var(--text-3); }
  .df-sort-row--active .df-sort-icon { color:var(--acc); }
  .df-sort-radio { width:16px; height:16px; border-radius:50%; flex-shrink:0; border:2px solid var(--text-3); position:relative; transition:border-color .15s; }
  .df-sort-radio--active { border-color:var(--acc); }
  .df-sort-radio--active::after { content:''; position:absolute; inset:3px; border-radius:50%; background:var(--acc); }
  .df-sort-label { flex:1; font-size:13.5px; font-weight:500; }
  .df-sort-check { color:var(--acc); font-size:15px; }

  .df-footer { display:flex; align-items:center; flex-wrap:wrap; gap:7px; padding:11px 20px; border-top:1px solid var(--border); background:rgba(255,255,255,.012); }
  .df-footer-label { font-size:10.5px; color:var(--text-3); text-transform:uppercase; letter-spacing:.08em; flex-shrink:0; }
  .df-footer-chips { display:flex; flex-wrap:wrap; gap:5px; }
  .df-footer-chip { padding:2px 10px; border-radius:999px; font-size:11px; font-weight:600; background:var(--acc-dim); border:1px solid var(--acc-border); color:var(--acc); }

  @media (max-width: 600px) {
    .df-panel { right:0; left:auto; width:min(460px,95vw); }
  }
`;

// ─────────────────────────────────────────────────────────────────
// TrailerModal
// ─────────────────────────────────────────────────────────────────
const TrailerModal = ({ item, onClose }) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!item) return;
    setLoading(true);
    setError(false);
    setTrailerKey(null);
    const mediaType = item.media_type === "tv" ? "tv" : "movie";
    instance
      .get(`${mediaType}/${item.id}/videos`)
      .then(({ data }) => {
        const vids = data.results || [];
        const trailer =
          vids.find(
            (v) => v.site === "YouTube" && v.type === "Trailer" && v.official,
          ) ||
          vids.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
          vids.find((v) => v.site === "YouTube" && v.type === "Teaser") ||
          vids.find((v) => v.site === "YouTube");
        if (trailer) setTrailerKey(trailer.key);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [item]);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const title = item?.title || item?.name || "";
  return (
    <div className="tm-overlay" onClick={onClose}>
      <div className="tm-panel" onClick={(e) => e.stopPropagation()}>
        <div className="tm-header">
          <div className="tm-title-wrap">
            <span className="tm-badge">▶ Trailer</span>
            <h2 className="tm-title">{title}</h2>
          </div>
          <button className="tm-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="tm-video-wrap">
          {loading && (
            <div className="tm-state">
              <div className="tm-spinner" />
              <span>Fetching trailer…</span>
            </div>
          )}
          {!loading && error && (
            <div className="tm-state tm-state--error">
              <span className="tm-error-icon">🎬</span>
              <p>No trailer available for this title.</p>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(title + " official trailer")}`}
                target="_blank"
                rel="noreferrer"
                className="tm-yt-link"
              >
                Search on YouTube →
              </a>
            </div>
          )}
          {!loading && trailerKey && (
            <iframe
              className="tm-iframe"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
              title={`${title} Trailer`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>
      <style>{`
        .tm-overlay { position:fixed; inset:0; z-index:9000; background:rgba(0,0,0,.88); backdrop-filter:blur(12px); display:flex; align-items:center; justify-content:center; animation:tmFadeIn .25s ease; padding:20px; }
        @keyframes tmFadeIn { from{opacity:0} to{opacity:1} }
        .tm-panel { width:100%; max-width:900px; background:#0f0f1c; border:1px solid rgba(192,132,252,.15); border-radius:18px; overflow:hidden; box-shadow:0 40px 100px rgba(0,0,0,.9); animation:tmSlideUp .3s cubic-bezier(.22,1,.36,1); }
        @keyframes tmSlideUp { from{transform:translateY(30px) scale(.97);opacity:0} to{transform:none;opacity:1} }
        .tm-header { display:flex; align-items:center; justify-content:space-between; padding:16px 22px; border-bottom:1px solid rgba(192,132,252,.1); background:rgba(192,132,252,.03); }
        .tm-title-wrap { display:flex; align-items:center; gap:12px; min-width:0; }
        .tm-badge { font-family:'DM Sans',sans-serif; font-size:10px; font-weight:700; letter-spacing:.1em; color:#08080f; background:#c084fc; border-radius:5px; padding:3px 9px; flex-shrink:0; }
        .tm-title { font-family:'Bebas Neue',cursive; font-size:20px; letter-spacing:.06em; color:#f0eaff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin:0; }
        .tm-close { width:34px; height:34px; border-radius:50%; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1); color:rgba(240,230,255,.6); font-size:14px; cursor:pointer; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all .2s; }
        .tm-close:hover { background:rgba(192,132,252,.15); color:#c084fc; border-color:rgba(192,132,252,.3); }
        .tm-video-wrap { position:relative; width:100%; padding-top:56.25%; background:#08080f; }
        .tm-iframe { position:absolute; inset:0; width:100%; height:100%; border:none; }
        .tm-state { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; font-family:'DM Sans',sans-serif; font-size:14px; color:rgba(240,220,255,.45); }
        .tm-spinner { width:36px; height:36px; border:3px solid rgba(192,132,252,.15); border-top-color:#c084fc; border-radius:50%; animation:tmSpin .8s linear infinite; }
        @keyframes tmSpin { to{transform:rotate(360deg)} }
        .tm-state--error { gap:10px; }
        .tm-error-icon { font-size:40px; }
        .tm-state--error p { margin:0; color:rgba(240,220,255,.4); }
        .tm-yt-link { font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; color:#c084fc; text-decoration:none; border:1px solid rgba(192,132,252,.3); border-radius:8px; padding:7px 16px; transition:background .2s; }
        .tm-yt-link:hover { background:rgba(192,132,252,.1); }
        @media(max-width:600px) { .tm-overlay{padding:0;align-items:flex-end} .tm-panel{border-radius:18px 18px 0 0;max-width:100%} }
      `}</style>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// HeroBanner — Popular variant
// ─────────────────────────────────────────────────────────────────
const HeroBanner = ({ item, onPlayTrailer }) => {
  if (!item) return null;
  const title = item.title || item.name || "";
  const backdrop = item.backdrop_path
    ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
    : null;
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  const rating = item.vote_average?.toFixed(1);
  const isTV = item.media_type === "tv";

  return (
    <div
      className="hero"
      style={{ backgroundImage: backdrop ? `url(${backdrop})` : "none" }}
    >
      <div className="hero-gradient" />
      <div className="hero-content">
        {/* Popular badge — purple variant */}
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          {isTV ? "📺 Popular on TV" : "🎬 Popular in Cinemas"}
        </div>
        <h1 className="hero-title">{title}</h1>
        <div className="hero-meta">
          {year && <span className="hero-year">{year}</span>}
          {isTV && <span className="hero-type-pill">TV Series</span>}
          {rating && (
            <span className="hero-rating">
              <svg viewBox="0 0 24 24" fill="#c084fc" width="14" height="14">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
              </svg>
              {rating}
            </span>
          )}
        </div>
        {item.overview && (
          <p className="hero-overview">{item.overview.slice(0, 220)}…</p>
        )}
        <div className="hero-actions">
          <button className="hero-play-btn" onClick={() => onPlayTrailer(item)}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch Trailer
          </button>
          <a
            href={`https://www.themoviedb.org/${isTV ? "tv" : "movie"}/${item.id}`}
            target="_blank"
            rel="noreferrer"
            className="hero-cta"
          >
            More Info →
          </a>
        </div>
      </div>
      <style>{`
        .hero { position:relative; height:520px; background-size:cover; background-position:center 20%; display:flex; align-items:flex-end; overflow:hidden; }
        .hero-gradient { position:absolute; inset:0; background:linear-gradient(to right,rgba(8,8,15,.95) 0%,rgba(8,8,15,.55) 55%,rgba(8,8,15,.1) 100%),linear-gradient(to top,#08080f 0%,transparent 45%); }
        .hero-content { position:relative; z-index:2; max-width:600px; padding:0 48px 64px; animation:heroIn .7s cubic-bezier(.22,1,.36,1) both; }
        @keyframes heroIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        .hero-badge {
          display:inline-flex; align-items:center; gap:7px;
          font-family:'DM Sans',sans-serif; font-size:11px; font-weight:700;
          letter-spacing:.1em; text-transform:uppercase;
          color:#08080f; background:#c084fc; border-radius:6px; padding:4px 12px; margin-bottom:16px;
        }
        .hero-badge-dot { width:6px; height:6px; border-radius:50%; background:#08080f; opacity:.6; animation:pulse 1.6s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }
        .hero-title { font-family:'Bebas Neue',cursive; font-size:clamp(40px,6vw,72px); color:#f0eaff; letter-spacing:.04em; line-height:1; margin:0 0 12px; text-shadow:0 4px 30px rgba(0,0,0,.5); }
        .hero-meta { display:flex; align-items:center; gap:12px; margin-bottom:14px; flex-wrap:wrap; }
        .hero-year { font-family:'DM Sans',sans-serif; font-size:14px; color:rgba(240,220,255,.55); }
        .hero-type-pill { font-family:'DM Sans',sans-serif; font-size:11px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:#c084fc; border:1px solid rgba(192,132,252,.3); border-radius:4px; padding:2px 8px; }
        .hero-rating { display:flex; align-items:center; gap:4px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; color:#c084fc; }
        .hero-overview { font-family:'DM Sans',sans-serif; font-size:15px; font-weight:300; color:rgba(240,220,255,.7); line-height:1.65; margin:0 0 24px; max-width:480px; }
        .hero-actions { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
        .hero-play-btn { display:inline-flex; align-items:center; gap:8px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; letter-spacing:.04em; color:#08080f; background:#c084fc; border:none; border-radius:8px; padding:11px 24px; cursor:pointer; transition:background .2s,transform .2s; }
        .hero-play-btn:hover { background:#d8b4fe; transform:translateY(-1px); }
        .hero-cta { display:inline-block; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; letter-spacing:.04em; color:rgba(240,220,255,.65); background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.12); border-radius:8px; padding:11px 24px; text-decoration:none; transition:all .2s; }
        .hero-cta:hover { color:#f0eaff; border-color:rgba(192,132,252,.3); background:rgba(192,132,252,.08); }
        @media(max-width:600px) { .hero{height:420px;} .hero-content{padding:0 20px 48px;} }
      `}</style>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// SectionHeading — Popular variant
// ─────────────────────────────────────────────────────────────────
const SectionHeading = ({ mediaType, sortBy, totalResults }) => {
  const typeLabel =
    mediaType === "tv"
      ? "TV Shows"
      : mediaType === "movie"
        ? "Movies"
        : "Everything";

  const sortLabel =
    sortBy === "popularity.desc"
      ? "Most Popular"
      : sortBy === "vote_average.desc"
        ? "Top Rated"
        : sortBy === "release_date.desc"
          ? "Newest First"
          : sortBy === "release_date.asc"
            ? "Classic First"
            : "Most Popular";

  const isDefault = mediaType === "all" && sortBy === "popularity.desc";

  return (
    <div className="sh-wrap">
      <div className="sh-eyebrow">
        <span className="sh-star">⭐</span>
        <span className="sh-eyebrow-text">
          {isDefault ? "What Everyone's Watching" : `Showing ${sortLabel}`}
        </span>
        <span className="sh-divider" />
        <span className="sh-count">{totalResults.toLocaleString()} titles</span>
      </div>
      <h2 className="sh-title">
        {isDefault ? (
          <>
            {" "}
            Popular <span className="sh-accent">Right Now</span>{" "}
          </>
        ) : (
          <>
            {" "}
            {sortLabel} <span className="sh-accent">{typeLabel}</span>{" "}
          </>
        )}
      </h2>
      <style>{`
        .sh-wrap { margin-bottom:24px; }
        .sh-eyebrow { display:flex; align-items:center; gap:10px; margin-bottom:8px; }
        .sh-star { font-size:15px; }
        .sh-eyebrow-text { font-family:'DM Sans',sans-serif; font-size:11px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:rgba(192,132,252,.5); }
        .sh-divider { flex:0 0 1px; height:14px; background:rgba(192,132,252,.2); }
        .sh-count { font-family:'DM Sans',sans-serif; font-size:11px; font-weight:600; letter-spacing:.06em; color:rgba(240,220,255,.25); }
        .sh-title { font-family:'Bebas Neue',cursive; font-size:clamp(32px,5vw,52px); letter-spacing:.06em; color:#f0eaff; line-height:1; margin:0; }
        .sh-accent { color:#c084fc; position:relative; }
        .sh-accent::after { content:''; position:absolute; left:0; bottom:-3px; width:100%; height:2px; background:linear-gradient(to right,#c084fc,transparent); border-radius:2px; }
        @media(max-width:600px) { .sh-title { font-size:30px; } }
      `}</style>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// BackButton
// ─────────────────────────────────────────────────────────────────
const BackButton = () => {
  const [hovered, setHovered] = useState(false);
  const handleBack = () => {
    if (window.history.length > 1) window.history.back();
    else window.location.href = "/";
  };
  return (
    <>
      <style>{`
        @import url('https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css');
        .back-btn { display:inline-flex; align-items:center; gap:8px; padding:8px 16px 8px 12px; border-radius:999px; background:rgba(15,15,28,.85); border:1.5px solid rgba(255,255,255,.08); color:rgba(240,220,255,.5); font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; letter-spacing:.04em; cursor:pointer; transition:all .22s cubic-bezier(.22,1,.36,1); backdrop-filter:blur(10px); position:relative; overflow:hidden; }
        .back-btn::before { content:''; position:absolute; inset:0; border-radius:999px; background:linear-gradient(120deg,rgba(192,132,252,.12),transparent 70%); opacity:0; transition:opacity .22s; }
        .back-btn:hover { border-color:rgba(192,132,252,.35); color:#c084fc; background:rgba(192,132,252,.06); transform:translateX(-2px); box-shadow:0 4px 20px rgba(0,0,0,.4),0 0 0 1px rgba(192,132,252,.1); }
        .back-btn:hover::before { opacity:1; }
        .back-btn:active { transform:translateX(-4px) scale(.97); }
        .back-icon { font-size:18px; line-height:1; display:flex; align-items:center; transition:transform .22s cubic-bezier(.22,1,.36,1); flex-shrink:0; }
        .back-btn:hover .back-icon { transform:translateX(-3px); }
        .back-label { position:relative; z-index:1; }
        .back-label::after { content:''; position:absolute; left:0; bottom:-1px; width:0; height:1px; background:#c084fc; border-radius:1px; transition:width .22s cubic-bezier(.22,1,.36,1); }
        .back-btn:hover .back-label::after { width:100%; }
      `}</style>
      <button
        className="back-btn"
        onClick={handleBack}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Go back"
      >
        <i
          className={`back-icon ${hovered ? "ri-arrow-left-s-line" : "ri-arrow-left-line"}`}
        />
        <span className="back-label">Back</span>
      </button>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────
// ScrollTopBtn
// ─────────────────────────────────────────────────────────────────
const ScrollTopBtn = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const h = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  if (!visible) return null;
  return (
    <>
      <button
        className="scroll-top-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑
      </button>
      <style>{`
        .scroll-top-btn { position:fixed; bottom:32px; right:32px; z-index:200; width:44px; height:44px; border-radius:50%; background:#c084fc; color:#08080f; font-size:18px; font-weight:700; border:none; cursor:pointer; box-shadow:0 8px 24px rgba(0,0,0,.5); transition:transform .2s,background .2s; display:flex; align-items:center; justify-content:center; }
        .scroll-top-btn:hover { transform:translateY(-3px); background:#d8b4fe; }
      `}</style>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────
// PopularPage — main
// Endpoints used:
//   "all"   + default sort  → movie/popular  + tv/popular  (interleaved)
//   "movie" + default sort  → movie/popular
//   "tv"    + default sort  → tv/popular
//   any with filters/sort   → discover/movie or discover/tv
// ─────────────────────────────────────────────────────────────────
const Popular = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [heroItem, setHeroItem] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [trailerItem, setTrailerItem] = useState(null);
  const [filters, setFilters] = useState({
    mediaType: "all",
    language: "",
    genre: "",
    sortBy: "popularity.desc",
  });

  const filtersRef = useRef(filters);
  const pageRef = useRef(1);
  const fetchingRef = useRef(false);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // ── Decide which API path(s) to hit ──────────────────────────
  //   Returns { paths: string[], dual: boolean }
  //   dual = true means fetch movie/popular AND tv/popular and interleave
  const buildPaths = (pg, f) => {
    const { mediaType, language, genre, sortBy } = f;
    const needsDiscover = !!language || !!genre || sortBy !== "popularity.desc";

    if (needsDiscover) {
      // For "all" with discover we default to movie (TMDB has no combined discover)
      const type = mediaType === "tv" ? "tv" : "movie";
      let path = `discover/${type}?page=${pg}&sort_by=${sortBy}&include_adult=false&vote_count.gte=50`;
      if (language) path += `&with_original_language=${language}`;
      if (genre) path += `&with_genres=${genre}`;
      return { paths: [path], dual: false, type };
    }

    if (mediaType === "movie")
      return {
        paths: [`movie/popular?page=${pg}`],
        dual: false,
        type: "movie",
      };
    if (mediaType === "tv")
      return { paths: [`tv/popular?page=${pg}`], dual: false, type: "tv" };

    // "all" + default sort → fetch both and interleave
    return {
      paths: [`movie/popular?page=${pg}`, `tv/popular?page=${pg}`],
      dual: true,
      type: "all",
    };
  };

  const fetchPage = useCallback(async (pg, f, reset = false) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setIsFetching(true);
    try {
      const { paths, dual, type } = buildPaths(pg, f);

      let results = [];
      let totalRes = 0;
      let totalPages = 1;

      if (dual) {
        // Fetch movie/popular + tv/popular in parallel, interleave
        const [movieRes, tvRes] = await Promise.all(
          paths.map((p) => instance.get(p)),
        );
        const movieItems = (movieRes.data.results || []).map((r) => ({
          ...r,
          media_type: "movie",
        }));
        const tvItems = (tvRes.data.results || []).map((r) => ({
          ...r,
          media_type: "tv",
        }));

        // Interleave: pick alternately from each list
        const maxLen = Math.max(movieItems.length, tvItems.length);
        for (let i = 0; i < maxLen; i++) {
          if (i < movieItems.length) results.push(movieItems[i]);
          if (i < tvItems.length) results.push(tvItems[i]);
        }

        // Total = sum of both (capped for display)
        totalRes =
          (movieRes.data.total_results || 0) + (tvRes.data.total_results || 0);
        totalPages = Math.min(
          movieRes.data.total_pages || 1,
          tvRes.data.total_pages || 1,
        );
      } else {
        const { data } = await instance.get(paths[0]);
        results = (data.results || []).map((r) => ({
          ...r,
          media_type: r.media_type || type,
        }));
        totalRes = data.total_results || 0;
        totalPages = data.total_pages || 1;
      }

      setTotalResults(totalRes);

      if (reset) {
        setMovies(results);
        if (results.length > 0) {
          setHeroItem(
            results[Math.floor(Math.random() * Math.min(results.length, 5))],
          );
        }
      } else {
        setMovies((prev) => {
          const ids = new Set(prev.map((m) => m.id));
          return [...prev, ...results.filter((r) => !ids.has(r.id))];
        });
      }

      const next = pg + 1;
      pageRef.current = next;
      setPage(next);
      setHasMore(pg < totalPages && pg < 20);
    } catch (err) {
      console.error(
        "TMDB popular fetch error:",
        err?.response?.data || err.message,
      );
    } finally {
      fetchingRef.current = false;
      setIsFetching(false);
      setInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    setInitialLoad(true);
    setMovies([]);
    pageRef.current = 1;
    setPage(1);
    setHasMore(true);
    fetchPage(1, filters, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadMore = () => {
    if (!fetchingRef.current && hasMore)
      fetchPage(pageRef.current, filtersRef.current, false);
  };

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  if (initialLoad) return <PremiumLoader />;

  return (
    <div className="popular">
      <Topnav
        onSearch={(item) => {
          if (item?.id)
            window.open(
              `https://www.themoviedb.org/${item.media_type === "tv" ? "tv" : "movie"}/${item.id}`,
              "_blank",
            );
        }}
      />

      <div className="hero-wrapper">
        <HeroBanner item={heroItem} onPlayTrailer={setTrailerItem} />
        <div className="hero-back-btn">
          <BackButton />
        </div>
      </div>

      <div className="content-area">
        <SectionHeading
          mediaType={filters.mediaType}
          sortBy={filters.sortBy}
          totalResults={totalResults}
        />

        <div className="filter-bar">
          <div className="filter-bar-left">
            <span className="filter-bar-label">Browse by</span>
          </div>
          <div className="filter-bar-right">
            <DropdownFilter onFilterChange={handleFilterChange} />
          </div>
        </div>

        <div className="section-divider" />

        <InfiniteScroll
          dataLength={movies.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <div className="scroll-loader">
              <div className="scroll-spinner" />
              <span>Loading more titles…</span>
            </div>
          }
          endMessage={
            <div className="end-message">
              ⭐ You've explored it all — {movies.length} popular titles
            </div>
          }
          scrollThreshold={0.85}
          style={{ overflow: "visible" }}
        >
          <Cards
            data={movies}
            loading={isFetching && movies.length === 0}
            onPlayTrailer={setTrailerItem}
          />
        </InfiniteScroll>
      </div>

      <ScrollTopBtn />

      {trailerItem && (
        <TrailerModal item={trailerItem} onClose={() => setTrailerItem(null)} />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body { background:#08080f; color:#f0eaff; font-family:'DM Sans',sans-serif; min-height:100vh; }

        .popular { min-height:100vh; background:#08080f; }
        .content-area { max-width:1400px; margin:0 auto; padding:48px 32px 80px; }

        .hero-wrapper { position:relative; }
        .hero-back-btn { position:absolute; top:20px; left:32px; z-index:10; }

        .filter-bar { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
        .filter-bar-left { display:flex; align-items:center; gap:10px; }
        .filter-bar-label {
          font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600;
          letter-spacing:.1em; text-transform:uppercase; color:rgba(192,132,252,.4);
        }
        .filter-bar-right { position:relative; z-index:200; }

        .section-divider {
          height:1px;
          background:linear-gradient(to right,rgba(192,132,252,.25),transparent);
          margin-bottom:28px; border-radius:1px;
        }

        .scroll-loader { display:flex; align-items:center; justify-content:center; gap:14px; padding:40px 0; font-family:'DM Sans',sans-serif; font-size:13px; color:rgba(192,132,252,.5); letter-spacing:.06em; }
        .scroll-spinner { width:22px; height:22px; border:2px solid rgba(192,132,252,.15); border-top-color:#c084fc; border-radius:50%; animation:spin .8s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }

        .end-message { text-align:center; padding:48px 0 24px; font-family:'DM Sans',sans-serif; font-size:14px; color:rgba(240,220,255,.3); letter-spacing:.04em; }

        @media(max-width:768px) {
          .content-area { padding:32px 16px 60px; }
          .hero-back-btn { top:14px; left:16px; }
          .filter-bar { flex-direction:column; align-items:flex-start; gap:12px; }
          .filter-bar-right { align-self:flex-end; }
        }
      `}</style>
    </div>
  );
};

export default Popular;
