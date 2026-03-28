import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import axios from "../../utils/Axios";

// ─── TMDB HELPER ─────────────────────────────────────────────────────────────
const tmdb = async (endpoint) => {
  try {
    const { data } = await axios.get(endpoint);
    return data;
  } catch (err) {
    throw new Error(`TMDB error ${err.response?.status}`);
  }
};

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const MEDIA_TYPES = [
  { id: "all",   label: "All",      icon: "ri-apps-2-line", desc: "Everything"    },
  { id: "movie", label: "Movies",   icon: "ri-film-line",   desc: "Feature films" },
  { id: "tv",    label: "TV Shows", icon: "ri-tv-2-line",   desc: "Series & shows"},
];

const LANGUAGES = [
  { id: "en", label: "English",    flag: "🇺🇸", native: "English"    },
  { id: "hi", label: "Hindi",      flag: "🇮🇳", native: "हिन्दी"      },
  { id: "ta", label: "Tamil",      flag: "🇮🇳", native: "தமிழ்"       },
  { id: "te", label: "Telugu",     flag: "🇮🇳", native: "తెలుగు"      },
  { id: "ko", label: "Korean",     flag: "🇰🇷", native: "한국어"       },
  { id: "ja", label: "Japanese",   flag: "🇯🇵", native: "日本語"       },
  { id: "fr", label: "French",     flag: "🇫🇷", native: "Français"   },
  { id: "es", label: "Spanish",    flag: "🇪🇸", native: "Español"    },
  { id: "de", label: "German",     flag: "🇩🇪", native: "Deutsch"    },
  { id: "zh", label: "Chinese",    flag: "🇨🇳", native: "中文"        },
  { id: "pt", label: "Portuguese", flag: "🇧🇷", native: "Português"  },
  { id: "it", label: "Italian",    flag: "🇮🇹", native: "Italiano"   },
];

const SORT_OPTIONS = [
  { id: "popularity.desc",    label: "Most Popular", icon: "ri-fire-line"     },
  { id: "vote_average.desc",  label: "Top Rated",    icon: "ri-star-line"     },
  { id: "release_date.desc",  label: "Newest First", icon: "ri-calendar-line" },
  { id: "release_date.asc",   label: "Oldest First", icon: "ri-history-line"  },
];

const EMPTY_FILTERS = {
  mediaType: "all",
  language:  "",
  genre:     "",
  sortBy:    "popularity.desc",
};

const TABS = [
  { id: "type",  icon: "ri-apps-2-line",      label: "Type"     },
  { id: "lang",  icon: "ri-global-line",       label: "Language" },
  { id: "genre", icon: "ri-price-tag-3-line",  label: "Genre"    },
  { id: "sort",  icon: "ri-sort-desc",         label: "Sort"     },
];

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
}

function useGenres() {
  const [genres, setGenres]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [movRes, tvRes] = await Promise.all([
          tmdb("/genre/movie/list"),
          tmdb("/genre/tv/list"),
        ]);
        if (cancelled) return;
        const merged = [...movRes.genres, ...tvRes.genres];
        const unique  = Array.from(new Map(merged.map((g) => [g.id, g])).values());
        setGenres(unique.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  return { genres, loading, error };
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

/** Type selection tab (All / Movies / TV Shows) */
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

/** Language selection tab with search */
const LangTab = ({ filters, update }) => {
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () =>
      search.trim()
        ? LANGUAGES.filter(
            (l) =>
              l.label.toLowerCase().includes(search.toLowerCase()) ||
              l.native.toLowerCase().includes(search.toLowerCase()),
          )
        : LANGUAGES,
    [search],
  );

  return (
    <div className="df-section">
      <div className="df-search-box">
        <i className="ri-search-line df-search-icon" />
        <input
          className="df-search-input"
          placeholder="Search language…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search languages"
        />
        {search && (
          <button
            className="df-search-clear"
            onClick={() => setSearch("")}
            aria-label="Clear search"
          >
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
                aria-pressed={active}
              >
                <span className="df-flag" role="img" aria-label={l.label}>
                  {l.flag}
                </span>
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

/** Genre chip grid with search — genres fetched from TMDB */
const GenreTab = ({ filters, update, genres, loading, error }) => {
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () =>
      search.trim()
        ? genres.filter((g) =>
            g.name.toLowerCase().includes(search.toLowerCase()),
          )
        : genres,
    [genres, search],
  );

  if (error)
    return (
      <div className="df-error">
        <i className="ri-error-warning-line" />
        <p>Failed to load genres. Check your API key.</p>
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
          aria-label="Search genres"
        />
        {search && (
          <button
            className="df-search-clear"
            onClick={() => setSearch("")}
            aria-label="Clear search"
          >
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
                aria-pressed={active}
              >
                {active && (
                  <i className="ri-check-line" style={{ fontSize: 11, marginRight: 3 }} />
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

/** Sort order selection tab */
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
            aria-pressed={active}
          >
            <i className={`${s.icon} df-sort-icon`} />
            <span className={`df-sort-radio ${active ? "df-sort-radio--active" : ""}`} />
            <span className="df-sort-label">{s.label}</span>
            {active && <i className="ri-check-line df-sort-check" />}
          </button>
        );
      })}
    </div>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
/**
 * DropdownFilter
 *
 * Props:
 *   onFilterChange(filters) — called whenever any filter value changes.
 *   filters object shape:
 *     { mediaType: "all"|"movie"|"tv", language: string, genre: number|"", sortBy: string }
 */
export default function DropdownFilter({ onFilterChange }) {
  const [open, setOpen]       = useState(false);
  const [tab, setTab]         = useState("type");
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const { genres, loading: genreLoading, error: genreError } = useGenres();
  const isMobile  = useIsMobile(640);
  const dropRef   = useRef(null);
  const panelRef  = useRef(null);
  const triggerRef = useRef(null);

  // ── Focus trap & close on outside click / Escape ──────────────────────────
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onOutside = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("touchstart", onOutside);
    if (isMobile) document.body.style.overflow = "hidden"; // prevent body scroll
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("touchstart", onOutside);
      document.body.style.overflow = "";
    };
  }, [open, isMobile]);

  // ── Update a single filter key ─────────────────────────────────────────────
  // Toggle behaviour: clicking the active value deselects it (except required fields).
  const update = useCallback(
    (key, value) => {
      setFilters((prev) => {
        const isSame     = prev[key] === value;
        const isRequired = key === "mediaType" || key === "sortBy";
        const next = {
          ...prev,
          [key]: isSame && !isRequired ? "" : value,
        };
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

  // ── Derived display values ─────────────────────────────────────────────────
  const activeCount = useMemo(
    () =>
      [
        filters.mediaType !== "all",
        !!filters.language,
        !!filters.genre,
        filters.sortBy !== "popularity.desc",
      ].filter(Boolean).length,
    [filters],
  );

  const summaryParts = useMemo(() => {
    const parts = [];
    if (filters.mediaType !== "all")
      parts.push(MEDIA_TYPES.find((m) => m.id === filters.mediaType)?.label);
    if (filters.language)
      parts.push(LANGUAGES.find((l) => l.id === filters.language)?.label);
    if (filters.genre)
      parts.push(genres.find((g) => g.id === filters.genre)?.name);
    if (filters.sortBy !== "popularity.desc")
      parts.push(SORT_OPTIONS.find((s) => s.id === filters.sortBy)?.label);
    return parts.filter(Boolean);
  }, [filters, genres]);

  /** True when a given tab has a non-default value selected */
  const tabHas = (id) =>
    (id === "type"  && filters.mediaType !== "all") ||
    (id === "lang"  && !!filters.language)          ||
    (id === "genre" && !!filters.genre)             ||
    (id === "sort"  && filters.sortBy !== "popularity.desc");

  const renderTabContent = () => {
    switch (tab) {
      case "type":  return <TypeTab filters={filters} update={update} />;
      case "lang":  return <LangTab filters={filters} update={update} />;
      case "genre": return (
        <GenreTab
          filters={filters}
          update={update}
          genres={genres}
          loading={genreLoading}
          error={genreError}
        />
      );
      case "sort":  return <SortTab filters={filters} update={update} />;
      default:      return null;
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>

      <div className="df-root" ref={dropRef}>

        {/* ── TRIGGER ──────────────────────────────────────────────────── */}
        <button
          ref={triggerRef}
          className={`df-trigger${open ? " df-trigger--open" : ""}${activeCount > 0 ? " df-trigger--active" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label={`Filters${activeCount ? `, ${activeCount} active` : ""}`}
        >
          <i className="ri-sliders-2-line df-trig-icon" />
          <span className="df-trig-text">
            {summaryParts.length ? summaryParts.join(" · ") : "Filters"}
          </span>
          {activeCount > 0 && <span className="df-badge">{activeCount}</span>}
          <i className={`ri-arrow-down-s-line df-trig-arrow${open ? " df-trig-arrow--up" : ""}`} />
        </button>

        {/* ── MOBILE BACKDROP ──────────────────────────────────────────── */}
        {isMobile && open && (
          <div
            className="df-overlay"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ── PANEL ────────────────────────────────────────────────────── */}
        {open && (
          <div
            className={`df-panel${isMobile ? " df-panel--mobile" : ""}`}
            ref={panelRef}
            role="dialog"
            aria-label="Content filters"
            aria-modal="true"
          >
            {/* Drag handle — mobile only */}
            {isMobile && <div className="df-drag-handle" />}

            {/* Header */}
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
                  aria-label="Close filters"
                >
                  <i className="ri-close-line" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="df-tabs" role="tablist">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  className={`df-tab${tab === t.id ? " df-tab--active" : ""}`}
                  onClick={() => setTab(t.id)}
                >
                  <i className={t.icon} />
                  <span>{t.label}</span>
                  {tabHas(t.id) && <span className="df-dot" aria-hidden="true" />}
                </button>
              ))}
            </div>

            {/* Tab body — key forces re-mount animation on tab switch */}
            <div className="df-body" key={tab}>
              {renderTabContent()}
            </div>

            {/* Active filter summary footer */}
            {summaryParts.length > 0 && (
              <div className="df-footer">
                <span className="df-footer-label">Filtering by</span>
                <div className="df-footer-chips">
                  {summaryParts.map((p, i) => (
                    <span key={i} className="df-footer-chip">{p}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile apply button */}
            {isMobile && (
              <div className="df-apply-bar">
                <button className="df-apply-btn" onClick={() => setOpen(false)}>
                  {activeCount > 0
                    ? `Apply ${activeCount} Filter${activeCount > 1 ? "s" : ""}`
                    : "Done"}
                  <i className="ri-arrow-right-line" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css');

  /* ── DESIGN TOKENS ── */
  .df-root {
    --acc:        #6c5ce7;
    --acc-2:      #a29bfe;
    --acc-glow:   rgba(108,92,231,.18);
    --acc-dim:    rgba(108,92,231,.09);
    --acc-border: rgba(108,92,231,.3);
    --bg:         #0d0d1a;
    --surf:       #13131f;
    --surf-2:     #1a1a2e;
    --surf-3:     #222238;
    --border:         rgba(255,255,255,.07);
    --border-hover:   rgba(108,92,231,.28);
    --text:   #e8e8ff;
    --text-2: #9090c0;
    --text-3: #4a4a7a;
    --radius: 18px;
    --ease:   cubic-bezier(.22,1,.36,1);
    --font:   'DM Sans', system-ui, sans-serif;
    --font-d: 'Syne', system-ui, sans-serif;
    font-family: var(--font);
    position: relative;
    display: inline-block;
    z-index: 200;
  }
  *, *::before, *::after { box-sizing: border-box; }
  button { cursor: pointer; font-family: var(--font); }

  /* ── TRIGGER ── */
  .df-trigger {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 0 16px; height: 44px; border-radius: 999px;
    background: var(--surf-2);
    border: 1.5px solid var(--border);
    color: var(--text-2);
    font-size: 13.5px; font-weight: 500;
    white-space: nowrap;
    transition: all .2s var(--ease);
    max-width: min(300px, 72vw);
    position: relative;
  }
  .df-trigger:hover {
    border-color: var(--border-hover);
    color: var(--text);
    background: var(--acc-dim);
  }
  .df-trigger--open,
  .df-trigger--active {
    border-color: var(--acc-border);
    background: var(--acc-dim);
    color: var(--text);
  }
  .df-trigger--open { box-shadow: 0 0 0 3px var(--acc-glow); }

  .df-trig-icon  { font-size: 16px; color: var(--acc); flex-shrink: 0; }
  .df-trig-text  { flex: 1; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }

  @media (max-width: 360px) {
    .df-trig-text  { display: none; }
    .df-trigger    { padding: 0 12px; }
  }

  .df-badge {
    min-width: 20px; height: 20px; border-radius: 999px;
    background: var(--acc); color: #fff;
    font-size: 10px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    padding: 0 5px; flex-shrink: 0;
    animation: df-pop .25s var(--ease);
  }
  .df-trig-arrow {
    font-size: 18px; color: var(--text-3); flex-shrink: 0;
    transition: transform .2s var(--ease), color .2s;
  }
  .df-trig-arrow--up { transform: rotate(180deg); color: var(--acc); }

  /* ── MOBILE OVERLAY ── */
  .df-overlay {
    position: fixed; inset: 0; z-index: 299;
    background: rgba(0,0,0,.65);
    backdrop-filter: blur(3px);
    animation: df-fade-in .2s ease;
  }
  @keyframes df-fade-in { from{opacity:0} to{opacity:1} }

  /* ── PANEL ── */
  .df-panel {
    position: absolute;
    top: calc(100% + 12px); left: 0;
    width: min(460px, 92vw);
    background: var(--surf);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow:
      0 40px 80px rgba(0,0,0,.75),
      0 0 0 1px rgba(255,255,255,.04),
      inset 0 1px 0 rgba(255,255,255,.06);
    overflow: hidden;
    animation: df-slide-in .25s var(--ease);
    z-index: 300;
  }
  @media (max-width: 480px) {
    .df-panel:not(.df-panel--mobile) { left: auto; right: 0; width: 96vw; }
  }

  /* Mobile bottom-sheet */
  .df-panel--mobile {
    position: fixed !important;
    top: auto !important; bottom: 0 !important;
    left: 0 !important; right: 0 !important;
    width: 100% !important;
    border-radius: 22px 22px 0 0 !important;
    max-height: 88dvh;
    display: flex; flex-direction: column;
    animation: df-sheet-up .3s var(--ease) !important;
  }

  @keyframes df-slide-in {
    from { opacity:0; transform: translateY(-10px) scale(.97) }
    to   { opacity:1; transform: none }
  }
  @keyframes df-sheet-up {
    from { transform: translateY(100%) }
    to   { transform: none }
  }

  /* Drag handle (mobile) */
  .df-drag-handle {
    width: 40px; height: 4px; border-radius: 99px;
    background: var(--surf-3);
    margin: 12px auto 4px;
    flex-shrink: 0;
  }

  /* ── HEADER ── */
  .df-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .df-header-left  { display: flex; align-items: center; gap: 9px; }
  .df-header-icon  { font-size: 16px; color: var(--acc); }
  .df-header-title {
    font-family: var(--font-d); font-size: 15px;
    color: var(--text); font-weight: 700;
  }
  .df-header-count {
    font-size: 11px; font-weight: 600; color: var(--acc-2);
    background: var(--acc-dim); border: 1px solid var(--acc-border);
    border-radius: 999px; padding: 2px 9px;
  }
  .df-header-right { display: flex; align-items: center; gap: 6px; }
  .df-clear-btn {
    display: flex; align-items: center; gap: 5px;
    padding: 5px 10px; border-radius: 8px; border: none;
    background: transparent; color: var(--text-3);
    font-size: 12px; font-weight: 600;
    transition: all .15s;
  }
  .df-clear-btn:hover { color: #f87171; background: rgba(248,113,113,.1); }
  .df-close-btn {
    width: 30px; height: 30px; border-radius: 50%; border: none;
    background: var(--surf-3); color: var(--text-2); font-size: 17px;
    display: flex; align-items: center; justify-content: center;
    transition: all .15s;
  }
  .df-close-btn:hover { color: var(--text); }

  /* ── TABS ── */
  .df-tabs {
    display: flex; gap: 2px;
    padding: 10px 14px 0;
    border-bottom: 1px solid var(--border);
    overflow-x: auto; scrollbar-width: none;
    flex-shrink: 0;
  }
  .df-tabs::-webkit-scrollbar { display: none; }
  .df-tab {
    position: relative;
    display: flex; align-items: center; gap: 5px;
    padding: 8px 13px;
    border-radius: 8px 8px 0 0;
    background: transparent; border: none;
    border-bottom: 2px solid transparent;
    color: var(--text-3); font-size: 13px; font-weight: 500;
    white-space: nowrap;
    transition: all .15s;
  }
  .df-tab:hover { color: var(--text-2); background: rgba(255,255,255,.03); }
  .df-tab--active {
    color: var(--text) !important;
    border-bottom-color: var(--acc) !important;
    background: rgba(108,92,231,.07) !important;
  }
  .df-tab i { font-size: 14px; }
  .df-dot {
    position: absolute; top: 8px; right: 7px;
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--acc);
  }

  /* ── BODY ── */
  .df-body {
    padding: 18px 20px;
    overflow-y: auto;
    max-height: 310px;
    scrollbar-width: thin;
    scrollbar-color: var(--surf-3) transparent;
    flex: 1;
    animation: df-body-in .18s var(--ease);
  }
  .df-panel--mobile .df-body { max-height: none; }
  .df-body::-webkit-scrollbar       { width: 4px; }
  .df-body::-webkit-scrollbar-thumb { background: var(--surf-3); border-radius: 99px; }
  @keyframes df-body-in { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:none} }

  .df-hint  { font-size: 12px; color: var(--text-3); margin-bottom: 14px; margin-top: 0; }
  .df-empty { font-size: 13px; color: var(--text-3); text-align: center; padding: 24px 0; }
  .df-error {
    text-align: center; padding: 24px; color: #f87171;
    display: flex; flex-direction: column; align-items: center; gap: 8px;
  }
  .df-error i { font-size: 28px; }
  .df-error p { font-size: 13px; margin: 0; }

  /* ── SEARCH BOX ── */
  .df-search-box {
    display: flex; align-items: center; gap: 8px;
    background: var(--surf-2); border: 1px solid var(--border);
    border-radius: 10px; padding: 0 12px; margin-bottom: 13px;
    transition: border-color .15s;
  }
  .df-search-box:focus-within { border-color: var(--acc-border); }
  .df-search-icon  { font-size: 15px; color: var(--text-3); flex-shrink: 0; }
  .df-search-input {
    flex: 1; background: transparent; border: none; outline: none;
    height: 38px; font-size: 13px; font-family: var(--font); color: var(--text);
  }
  .df-search-input::placeholder { color: var(--text-3); }
  .df-search-clear {
    background: transparent; border: none;
    color: var(--text-3); font-size: 16px; padding: 0;
    display: flex; align-items: center; transition: color .15s;
  }
  .df-search-clear:hover { color: var(--text-2); }

  /* ── TYPE CARDS ── */
  .df-type-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
  .df-type-card {
    position: relative;
    display: flex; flex-direction: column; align-items: center;
    gap: 7px; padding: 22px 10px 18px;
    border-radius: 14px; border: 1.5px solid var(--border);
    background: var(--surf-2); color: var(--text-3);
    font-size: 13px; font-weight: 500;
    transition: all .2s var(--ease);
  }
  .df-type-card:hover {
    border-color: var(--border-hover);
    color: var(--text-2);
    background: var(--acc-dim);
  }
  .df-type-card--active {
    border-color: var(--acc) !important;
    background: linear-gradient(145deg, rgba(108,92,231,.18), rgba(108,92,231,.06)) !important;
    color: var(--text) !important;
    box-shadow: 0 0 24px var(--acc-glow);
  }
  .df-type-icon { font-size: 28px; color: inherit; }
  .df-type-card--active .df-type-icon { color: var(--acc-2); }
  .df-type-label { font-weight: 600; font-size: 13px; }
  .df-type-desc  { font-size: 11px; color: var(--text-3); }
  .df-check-ring {
    position: absolute; top: 9px; right: 9px;
    width: 20px; height: 20px; border-radius: 50%;
    background: var(--acc); color: #fff; font-size: 11px;
    display: flex; align-items: center; justify-content: center;
    animation: df-pop .2s var(--ease);
  }
  @keyframes df-pop { from{scale:.4;opacity:0} to{scale:1;opacity:1} }

  /* ── LANGUAGE GRID ── */
  .df-lang-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px,1fr));
    gap: 8px;
  }
  @media (max-width: 400px) { .df-lang-grid { grid-template-columns: 1fr 1fr; } }
  .df-lang-card {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 10px;
    border: 1.5px solid var(--border); background: var(--surf-2);
    color: var(--text-3); transition: all .15s;
  }
  .df-lang-card:hover { border-color: var(--border-hover); color: var(--text); }
  .df-lang-card--active {
    border-color: var(--acc) !important;
    background: var(--acc-dim) !important;
    color: var(--text) !important;
  }
  .df-flag       { font-size: 20px; line-height: 1; flex-shrink: 0; }
  .df-lang-info  { flex: 1; min-width: 0; text-align: left; }
  .df-lang-name  { display: block; font-size: 13px; font-weight: 500; }
  .df-lang-native {
    display: block; font-size: 10px; color: var(--text-3);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .df-lang-check { font-size: 14px; color: var(--acc); flex-shrink: 0; margin-left: auto; }

  /* ── GENRE CHIPS ── */
  .df-chip-grid { display: flex; flex-wrap: wrap; gap: 7px; }
  .df-chip {
    display: inline-flex; align-items: center;
    padding: 5px 13px; border-radius: 999px;
    border: 1px solid var(--border); background: transparent;
    color: var(--text-3); font-size: 12.5px; font-weight: 500;
    transition: all .15s;
  }
  .df-chip:hover { border-color: var(--border-hover); color: var(--text); background: var(--acc-dim); }
  .df-chip--active {
    border-color: var(--acc) !important;
    background: var(--acc-dim) !important;
    color: var(--acc-2) !important;
    font-weight: 600;
  }

  /* Genre skeleton loader */
  .df-skel-grid { display: flex; flex-wrap: wrap; gap: 7px; }
  .df-skel-chip {
    height: 30px; border-radius: 999px; background: var(--surf-2);
    animation: df-pulse 1.4s ease-in-out infinite;
  }
  @keyframes df-pulse { 0%,100%{opacity:.5} 50%{opacity:.2} }

  /* ── SORT LIST ── */
  .df-sort-list { display: flex; flex-direction: column; gap: 6px; }
  .df-sort-row {
    display: flex; align-items: center; gap: 12px;
    padding: 13px 15px; border-radius: 11px;
    border: 1.5px solid var(--border); background: var(--surf-2);
    color: var(--text-3); text-align: left; transition: all .15s;
  }
  .df-sort-row:hover { border-color: var(--border-hover); color: var(--text); background: var(--acc-dim); }
  .df-sort-row--active {
    border-color: var(--acc) !important;
    background: var(--acc-dim) !important;
    color: var(--text) !important;
  }
  .df-sort-icon { font-size: 17px; color: var(--text-3); }
  .df-sort-row--active .df-sort-icon { color: var(--acc-2); }
  .df-sort-radio {
    width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0;
    border: 2px solid var(--text-3); position: relative; transition: border-color .15s;
  }
  .df-sort-radio--active { border-color: var(--acc); }
  .df-sort-radio--active::after {
    content: ''; position: absolute; inset: 3px;
    border-radius: 50%; background: var(--acc);
  }
  .df-sort-label { flex: 1; font-size: 13.5px; font-weight: 500; }
  .df-sort-check { color: var(--acc); font-size: 15px; }

  /* ── FOOTER SUMMARY ── */
  .df-footer {
    display: flex; align-items: center; flex-wrap: wrap; gap: 7px;
    padding: 11px 20px;
    border-top: 1px solid var(--border);
    background: rgba(255,255,255,.012);
    flex-shrink: 0;
  }
  .df-footer-label {
    font-size: 10.5px; color: var(--text-3);
    text-transform: uppercase; letter-spacing: .08em; flex-shrink: 0;
  }
  .df-footer-chips { display: flex; flex-wrap: wrap; gap: 5px; }
  .df-footer-chip {
    padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 600;
    background: var(--acc-dim); border: 1px solid var(--acc-border); color: var(--acc-2);
  }

  /* ── MOBILE APPLY BAR ── */
  .df-apply-bar {
    padding: 12px 18px 20px;
    border-top: 1px solid var(--border);
    background: var(--surf);
    flex-shrink: 0;
  }
  .df-apply-btn {
    width: 100%; height: 48px; border-radius: 12px;
    background: linear-gradient(135deg, var(--acc), #9c8ff5);
    border: none; color: #fff; font-size: 15px; font-weight: 600;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: opacity .15s, transform .1s;
  }
  .df-apply-btn:active { opacity: .9; transform: scale(.99); }
`;