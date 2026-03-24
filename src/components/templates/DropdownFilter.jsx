import React, { useState, useRef, useEffect } from "react";

// Enhanced Filter Options (Netflix/Hotstar style)
const FILTER_CATEGORIES = [
  { id: "all", label: "All", type: "category" },
  { id: "movies", label: "Movies", type: "category" },
  { id: "series", label: "TV Shows", type: "category" },
  { id: "kids", label: "Kids", type: "category" },
  
  { id: "hindi", label: "Hindi", type: "language" },
  { id: "english", label: "English", type: "language" },
  { id: "tamil", label: "Tamil", type: "language" },
  { id: "telugu", label: "Telugu", type: "language" },
  
  { id: "action", label: "Action", type: "genre" },
  { id: "comedy", label: "Comedy", type: "genre" },
  { id: "horror", label: "Horror", type: "genre" },
  { id: "romance", label: "Romance", type: "genre" },
  { id: "thriller", label: "Thriller", type: "genre" },
];

function DropdownFilter({ onFilterChange, selectedFilter = "all" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(selectedFilter);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterSelect = (filterId) => {
    setSelected(filterId);
    onFilterChange(filterId);
    setIsOpen(false);
  };

  const getSelectedLabel = () => {
    const filter = FILTER_CATEGORIES.find(f => f.id === selected);
    return filter ? filter.label : "All";
  };

  const getFilteredOptions = () => {
    return FILTER_CATEGORIES.filter(f => f.id !== "all");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Custom Trigger Button - Netflix/Hotstar Style */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-full 
          bg-gradient-to-r from-zinc-800/80 to-zinc-900/80 
          border-2 border-zinc-700/50 hover:border-rose-500/50 
          backdrop-blur-sm hover:backdrop-blur-md
          text-white/90 hover:text-white font-medium 
          transition-all duration-300 ease-out
          shadow-lg hover:shadow-rose-500/25 hover:scale-[1.02]
          ${isOpen ? 'border-rose-500 shadow-rose-500/50 ring-2 ring-rose-500/30' : ''}
        `}
      >
        <span className="text-sm truncate max-w-[140px]">{getSelectedLabel()}</span>
        <i 
          className={`ri-arrow-down-s-line w-5 h-5 transition-transform text-white/70 hover:text-white 
                     ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Custom Dropdown Menu */}
      {isOpen && (
        <div className={`
          absolute right-0 mt-2 w-72 bg-zinc-900/95 backdrop-blur-xl 
          border border-zinc-700 rounded-2xl shadow-2xl shadow-black/50
          py-2 max-h-96 overflow-y-auto z-50
          animate-in slide-in-from-top-2 duration-200
        `}>
          {/* Filter Tabs/Chips Style */}
          <div className="px-4 py-3 border-b border-zinc-800">
            <div className="flex flex-wrap gap-2">
              {["all", "movies", "series"].map((quickFilter) => (
                <button
                  key={quickFilter}
                  onClick={() => handleFilterSelect(quickFilter)}
                  className={`
                    px-3 py-1.5 rounded-full text-xs font-medium transition-all
                    ${selected === quickFilter 
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/25' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                    }
                  `}
                >
                  {FILTER_CATEGORIES.find(f => f.id === quickFilter)?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Filter Grid */}
          <div className="grid grid-cols-2 gap-2 p-4">
            {getFilteredOptions().map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleFilterSelect(filter.id)}
                className={`
                  flex items-center justify-between px-3 py-2.5 rounded-xl 
                  text-left transition-all group hover:bg-zinc-800/50
                  ${selected === filter.id 
                    ? 'bg-gradient-to-r from-rose-500/20 to-pink-500/20 border-2 border-rose-400/50 text-white shadow-lg' 
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  }
                `}
              >
                <span className="text-sm font-medium group-hover:translate-x-1 transition-transform">
                  {filter.label}
                </span>
                {selected === filter.id && (
                  <i className="ri-close-fill w-5 h-5 text-rose-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export default DropdownFilter;
