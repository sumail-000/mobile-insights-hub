"use client";

import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import Navbar from "@/components/Navbar";


import Footer from "@/components/Footer";


import { Slider } from "@/components/ui/slider";


import {
  Search, SlidersHorizontal, X, ChevronRight, Cpu, MemoryStick,
  HardDrive, Camera, Battery, Monitor, Wifi, Star, Filter,
  Smartphone, ChevronDown, ChevronUp, GitCompare, ExternalLink,
  Zap, Shield, RefreshCw, Loader2
} from "lucide-react";
import { getDevices, Device } from "@/lib/api";



// ─── Filter Categories (91mobiles-style) ──────────────────────────────────────
const filterConfig = [
  {
    key: "network", title: "Network", icon: Wifi,
    options: ["5G", "4G LTE", "VoLTE", "Dual SIM", "eSIM"]
  },
  {
    key: "brands", title: "Brand", icon: Smartphone,
    options: ["Samsung", "Apple", "Xiaomi", "OnePlus", "Google", "Motorola", "Vivo", "OPPO", "Realme", "Infinix", "Tecno", "Nokia", "Sony"]
  },
  {
    key: "ram", title: "RAM", icon: MemoryStick,
    options: ["4 GB & above", "6 GB & above", "8 GB & above", "12 GB & above", "16 GB & above"]
  },
  {
    key: "storage", title: "Internal Storage", icon: HardDrive,
    options: ["64 GB & above", "128 GB & above", "256 GB & above", "512 GB & above", "1 TB & above"]
  },
  {
    key: "camera", title: "Main Camera", icon: Camera,
    options: ["12 MP & above", "48 MP & above", "64 MP & above", "108 MP & above", "200 MP & above"]
  },
  {
    key: "battery", title: "Battery", icon: Battery,
    options: ["4000 mAh & above", "5000 mAh & above", "6000 mAh & above", "7000 mAh & above"]
  },
  {
    key: "display", title: "Refresh Rate", icon: RefreshCw,
    options: ["60 Hz", "90 Hz & above", "120 Hz & above", "144 Hz & above"]
  },
  {
    key: "chipset", title: "Processor", icon: Cpu,
    options: ["Snapdragon", "MediaTek Dimensity", "Apple Silicon", "Exynos", "Google Tensor"]
  },
  {
    key: "os", title: "Operating System", icon: Shield,
    options: ["Android", "iOS", "HarmonyOS"]
  },
];


interface Filters {
  search: string;
  brands: string[];
  priceRange: number[];
  ram: string[];
  storage: string[];
  camera: string[];
  battery: string[];
  display: string[];
  chipset: string[];
  network: string[];
  os: string[];
}

// ─── Filter Section Component ─────────────────────────────────────────────────
function FilterSection({
  title, icon: Icon, options, selected, onToggle,
}: {
  title: string; icon: React.ElementType; options: string[]; selected: string[]; onToggle: (v: string) => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-white/10 pb-3 mb-3 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-2.5 group"
      >
        <div className="flex items-center gap-2">
          <Icon size={13} className="text-primary" />
          <span className="text-xs font-bold tracking-wide uppercase text-foreground/80">{title}</span>
          {selected.length > 0 && (
            <span className="bg-primary text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
              {selected.length}
            </span>
          )}
        </div>
        {open
          ? <ChevronUp size={12} className="text-muted-foreground" />
          : <ChevronDown size={12} className="text-muted-foreground" />
        }
      </button>
      {open && (
        <div className="space-y-1">
          {options.map((opt) => {
            const active = selected.includes(opt);
            return (
              <label
                key={opt}
                onClick={() => onToggle(opt)}
                className="flex items-center gap-2.5 cursor-pointer group py-0.5"
              >
                <div className={`w-3.5 h-3.5 rounded border-[1.5px] flex items-center justify-center transition-all shrink-0 ${
                  active ? "bg-primary border-primary" : "border-white/30 group-hover:border-primary/60"
                }`}>
                  {active && (
                    <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 10 10">
                      <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className={`text-xs transition-colors leading-tight ${
                  active ? "text-primary font-semibold" : "text-foreground/70 group-hover:text-foreground"
                }`}>
                  {opt}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Score Badge ──────────────────────────────────────────────────────────────
function ScoreBadge({ score }: { score: number }) {
  const bg = score >= 90 ? "from-green-600 to-green-700" : score >= 80 ? "from-amber-500 to-amber-600" : "from-red-500 to-red-600";
  return (
    <div className={`bg-gradient-to-br ${bg} text-white rounded-lg px-2 py-1.5 text-center shadow-lg absolute top-2 left-2 z-10`}>
      <div className="text-sm font-black leading-none">{score}%</div>
      <div className="text-[8px] font-semibold opacity-90 leading-tight">Spec<br />Score</div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function PhoneFinderPageInner() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Filters>({
    search: searchParams?.get("search") || "",
    brands: [],
    priceRange: [0, 1500],
    ram: [],
    storage: [],
    camera: [],
    battery: [],
    display: [],
    chipset: [],
    network: [],
    os: [],
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [phones, setPhones] = useState<Device[]>([]);
  const [totalPhones, setTotalPhones] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const toggleFilter = (key: keyof Filters, val: string) => {
    setFilters(prev => {
      const arr = prev[key] as string[];
      return { ...prev, [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] };
    });
    setCurrentPage(1);
  };

  const activeCount = [
    filters.brands, filters.ram, filters.storage, filters.camera,
    filters.battery, filters.display, filters.chipset, filters.network, filters.os
  ].reduce((a, b) => a + b.length, 0);

  const clearAll = () => {
    setFilters(prev => ({
      ...prev,
      brands: [], ram: [], storage: [], camera: [],
      battery: [], display: [], chipset: [], network: [], os: [],
      priceRange: [0, 1500],
    }));
    setCurrentPage(1);
  };

  const fetchPhones = useCallback(async () => {
    setLoading(true);
    try {
      const apiSort = sortBy === "newest" ? "newest" : sortBy === "score" ? "rating" : "name";
      const res = await getDevices({
        search: filters.search || undefined,
        brand: filters.brands.length === 1 ? filters.brands[0] : undefined,
        network: filters.network.length > 0 ? filters.network[0] : undefined,
        os: filters.os.length > 0 ? filters.os[0] : undefined,
        page: currentPage,
        limit: 20,
        sort: apiSort as "name" | "rating" | "fans" | "newest",
      });
      setPhones(res.devices);
      setTotalPhones(res.total);
      setTotalPages(res.pages);
    } catch {
      setPhones([]);
    } finally {
      setLoading(false);
    }
  }, [filters.search, filters.brands, filters.network, filters.os, sortBy, currentPage]);

  useEffect(() => {
    fetchPhones();
  }, [fetchPhones]);

  // Client-side filtering for RAM/chipset (already fetched from DB)
  const filteredResults = useMemo(() => {
    return phones.filter(p => {
      if (filters.ram.length > 0) {
        const minRam = Math.max(...filters.ram.map(r => parseInt(r)));
        const ramGB = parseInt(p.ram || "0");
        if (ramGB < minRam) return false;
      }
      if (filters.chipset.length > 0 && !filters.chipset.some(c => (p.chipset || "").toLowerCase().includes(c.toLowerCase()))) return false;
      return true;
    });
  }, [phones, filters.ram, filters.chipset]);

  // All active filter chips for display
  const activeChips: { label: string; key: keyof Filters }[] = [
    ...filters.brands.map(v => ({ label: v, key: "brands" as keyof Filters })),
    ...filters.network.map(v => ({ label: v, key: "network" as keyof Filters })),
    ...filters.ram.map(v => ({ label: v, key: "ram" as keyof Filters })),
    ...filters.chipset.map(v => ({ label: v, key: "chipset" as keyof Filters })),
    ...filters.os.map(v => ({ label: v, key: "os" as keyof Filters })),
    ...filters.camera.map(v => ({ label: v, key: "camera" as keyof Filters })),
    ...filters.battery.map(v => ({ label: v, key: "battery" as keyof Filters })),
    ...filters.display.map(v => ({ label: v, key: "display" as keyof Filters })),
    ...filters.storage.map(v => ({ label: v, key: "storage" as keyof Filters })),
  ];

  const sidebar = (
    <aside className="w-full">
      <div className="glass-card rounded-2xl p-4 sticky top-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-primary" />
            <span className="font-bold text-sm">Refine Results</span>
            {activeCount > 0 && (
              <span className="bg-primary/20 text-primary text-xs rounded-full px-2 py-0.5 font-bold">{activeCount}</span>
            )}
          </div>
          {activeCount > 0 && (
            <button onClick={clearAll} className="text-[11px] text-primary hover:text-primary/70 font-semibold flex items-center gap-1 transition-colors">
              <X size={11} /> Clear All
            </button>
          )}
        </div>

        {/* Search within filters */}
        <div className="relative mb-4">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={filters.search}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Search for a phone or brand..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/30 transition-all placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Price Range */}
        <div className="mb-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 mb-2.5">
            <Zap size={13} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-wide text-foreground/80">Price</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="glass text-xs font-bold text-primary px-2.5 py-1.5 rounded-lg border border-primary/20">
              ${filters.priceRange[0]}
            </div>
            <div className="flex-1 h-px bg-white/10" />
            <div className="glass text-xs font-bold text-primary px-2.5 py-1.5 rounded-lg border border-primary/20">
              ${filters.priceRange[1]}{filters.priceRange[1] >= 1500 ? "+" : ""}
            </div>
          </div>
          <Slider
            value={filters.priceRange}
            onValueChange={v => setFilters(prev => ({ ...prev, priceRange: v }))}
            min={0} max={1500} step={50}
            className="mb-2"
          />
          <div className="grid grid-cols-2 gap-1 mt-2">
            {[["Under $300", 0, 300], ["$300–$600", 300, 600], ["$600–$900", 600, 900], ["$900+", 900, 1500]].map(([label, min, max]) => (
              <button
                key={label as string}
                onClick={() => setFilters(prev => ({ ...prev, priceRange: [min as number, max as number] }))}
                className={`text-[10px] py-1 px-2 rounded-lg border transition-all font-medium ${
                  filters.priceRange[0] === min && filters.priceRange[1] === max
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-white/10 hover:border-primary/30 text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter sections */}
        {filterConfig.map(fc => (
          <FilterSection
            key={fc.key}
            title={fc.title}
            icon={fc.icon}
            options={fc.options}
            selected={filters[fc.key as keyof Filters] as string[]}
            onToggle={v => toggleFilter(fc.key as keyof Filters, v)}
          />
        ))}
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen page-bg">
      <Navbar />
      <main>
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-foreground via-foreground/95 to-foreground/85 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 right-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute top-4 right-1/3 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl" />
          </div>
          <div className="px-4 py-10 relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary text-xs font-bold uppercase tracking-widest">Advanced Search</span>
              <div className="h-px flex-1 max-w-[60px] bg-primary/30" />
            </div>
            <h1 className="text-white text-3xl md:text-4xl font-black mb-2 tracking-tight">Phone Finder</h1>
            <p className="text-white/50 text-sm max-w-lg">Use filters to find your perfect smartphone by exact specifications — brand, chipset, camera, battery, and more.</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
                <Smartphone size={14} className="text-primary" />
                <span className="text-white text-xs font-semibold">{loading ? "..." : `${totalPhones} Phones`}</span>
              </div>
              <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-primary" />
                <span className="text-white text-xs font-semibold">9 Filter Categories</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick price bar */}
        <div className="bg-foreground/95 border-b border-white/10">
          <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <span className="text-white/40 text-xs whitespace-nowrap shrink-0 font-medium">Quick Filter:</span>
            {[
              ["Under $300", 0, 300], ["$300–$600", 300, 600],
              ["$600–$900", 600, 900], ["$900–$1200", 900, 1200], ["$1200+", 1200, 1500]
            ].map(([label, min, max]) => (
              <button
                key={label as string}
                onClick={() => setFilters(prev => ({ ...prev, priceRange: [min as number, max as number] }))}
                className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-all shrink-0 font-medium border ${
                  filters.priceRange[0] === min && filters.priceRange[1] === max
                    ? "bg-primary text-white border-primary"
                    : "border-white/20 text-white/70 hover:border-primary/50 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
            <div className="h-4 w-px bg-white/20 mx-1 shrink-0" />
            {["5G", "Android", "iOS"].map(tag => (
              <button
                key={tag}
                onClick={() => {
                  const key = tag === "Android" || tag === "iOS" ? "os" : "network";
                  toggleFilter(key as keyof Filters, tag);
                }}
                className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-all shrink-0 font-medium border ${
                  filters.network.includes(tag) || filters.os.includes(tag)
                    ? "bg-primary text-white border-primary"
                    : "border-white/20 text-white/70 hover:border-primary/50 hover:text-white"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-6">
          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="glass-card w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm"
            >
              <div className="flex items-center gap-2">
                <Filter size={15} className="text-primary" />
                <span>Filters</span>
                {activeCount > 0 && <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5">{activeCount}</span>}
              </div>
              {mobileFilterOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
            {mobileFilterOpen && <div className="mt-3">{sidebar}</div>}
          </div>

          <div className="flex gap-6">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-60 xl:w-64 shrink-0">{sidebar}</div>

            {/* Results Panel */}
            <div className="flex-1 min-w-0">
              {/* Results header */}
              <div className="glass-card rounded-xl px-4 py-3 flex items-center justify-between mb-4 gap-3 flex-wrap">
                <p className="text-sm text-muted-foreground">
                  {loading ? (
                    <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Loading...</span>
                  ) : (
                    <>Showing <span className="font-bold text-foreground text-base">{filteredResults.length}</span>
                    <span className="text-xs ml-1">of {totalPhones} phones</span></>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground hidden sm:block">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}
                    className="glass text-xs px-3 py-1.5 rounded-lg border border-white/10 focus:outline-none focus:border-primary/30 text-foreground cursor-pointer bg-transparent"
                  >
                    <option value="name">Name A–Z</option>
                    <option value="newest">Newest First</option>
                    <option value="score">Top Rated</option>
                    <option value="fans">Most Fans</option>
                  </select>
                </div>
              </div>

              {/* Active filter chips */}
              {activeChips.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {activeChips.map((chip, i) => (
                    <span key={i} className="flex items-center gap-1.5 bg-primary/15 border border-primary/25 text-primary text-xs px-3 py-1.5 rounded-full font-medium">
                      {chip.label}
                      <X size={10} className="cursor-pointer hover:text-primary/60 transition-colors" onClick={() => toggleFilter(chip.key, chip.label)} />
                    </span>
                  ))}
                  <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-primary px-2 py-1.5 transition-colors font-medium">Clear all</button>
                </div>
              )}

              {/* Phone Cards */}
              <div className="space-y-4">
                {loading ? (
                  <div className="glass-card rounded-2xl p-14 text-center">
                    <Loader2 size={36} className="animate-spin text-primary mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Loading phones from database...</p>
                  </div>
                ) : filteredResults.length === 0 ? (
                  <div className="glass-card rounded-2xl p-14 text-center">
                    <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Search size={28} className="text-muted-foreground" />
                    </div>
                    <p className="font-bold text-lg mb-2">No phones match your filters</p>
                    <p className="text-sm text-muted-foreground mb-5">Try adjusting or clearing your filters</p>
                    <button onClick={clearAll} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg">
                      Clear All Filters
                    </button>
                  </div>
                ) : filteredResults.map((phone) => (
                  <div key={phone.slug} className="glass-card rounded-2xl overflow-hidden hover:shadow-2xl hover:border-primary/25 hover:-translate-y-0.5 transition-all duration-300 group">
                    <div className="h-0.5 w-full bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />
                    <div className="p-4 sm:p-5 flex gap-4 sm:gap-5">
                      {/* Thumbnail */}
                      <div className="shrink-0">
                        <div className="w-24 sm:w-28 h-36 sm:h-40 rounded-2xl overflow-hidden relative flex items-center justify-center bg-white/5 border border-white/10">
                          {phone.rating && (
                            <div className="absolute top-2 left-2 z-10 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-lg px-2 py-1 text-center shadow-lg">
                              <div className="text-xs font-black leading-none">{parseFloat(phone.rating || "0").toFixed(1)}</div>
                              <div className="text-[8px] font-semibold opacity-90">Rating</div>
                            </div>
                          )}
                          <img
                            src={phone.thumbnail}
                            alt={phone.name}
                            className="w-full h-full object-contain p-2"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/100x140?text=No+Image"; }}
                          />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <p className="text-xs text-primary font-semibold mb-0.5">{phone.brand}</p>
                            <h3 className="font-black text-base sm:text-lg leading-tight group-hover:text-primary transition-colors">
                              {phone.name}
                            </h3>
                            {phone.announced && (
                              <p className="text-xs text-muted-foreground mt-0.5">{phone.announced}</p>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <a href={`https://www.amazon.com/s?k=${encodeURIComponent(phone.brand + " " + phone.name)}`} target="_blank" rel="noopener noreferrer" className="text-primary text-xs font-bold hover:underline flex items-center gap-1 justify-end">
                              Find Price <ExternalLink size={10} />
                            </a>
                            {phone.fans && (
                              <p className="text-xs text-muted-foreground mt-1">{phone.fans} fans</p>
                            )}
                          </div>
                        </div>

                        {/* Specs grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-3">
                          {[
                            { icon: Cpu,          label: phone.chipset },
                            { icon: MemoryStick,  label: phone.ram },
                            { icon: Camera,       label: phone.main_camera ? `${phone.main_camera.split(',')[0]} Rear` : null },
                            { icon: Camera,       label: phone.selfie_camera ? `${phone.selfie_camera.split(',')[0]} Selfie` : null },
                            { icon: Battery,      label: phone.battery },
                            { icon: Monitor,      label: phone.display_size },
                          ].filter(s => s.label).map((spec, j) => (
                            <div key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="w-5 h-5 glass rounded-md flex items-center justify-center shrink-0">
                                <spec.icon size={10} className="text-primary/80" />
                              </div>
                              <span className="line-clamp-1">{spec.label}</span>
                            </div>
                          ))}
                        </div>

                        {/* OS + Network tags */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {phone.os && (
                            <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-medium">
                              {phone.os.split(',')[0].split(' ').slice(0, 2).join(' ')}
                            </span>
                          )}
                          {phone.network && phone.network.includes('5G') && (
                            <span className="text-[10px] bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-0.5 rounded-full font-medium">5G</span>
                          )}
                          {phone.nfc && phone.nfc.toLowerCase().includes('yes') && (
                            <span className="text-[10px] bg-purple-500/10 text-purple-500 border border-purple-500/20 px-2 py-0.5 rounded-full font-medium">NFC</span>
                          )}
                        </div>

                        {/* Rating + actions */}
                        <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-white/8 flex-wrap">
                          <div className="flex items-center gap-3">
                            {phone.rating && (
                              <div className="flex items-center gap-1">
                                <Star size={11} className="text-amber-500 fill-amber-500" />
                                <span className="text-xs font-bold">{parseFloat(phone.rating).toFixed(1)}/10</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Link href={`/phone/${phone.slug}`} className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
                              View All Specs <ChevronRight size={11} />
                            </Link>
                            <Link href="/compare" className="glass border border-white/10 hover:border-primary/30 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 text-muted-foreground hover:text-primary">
                              <GitCompare size={10} /> Compare
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <div className="mt-6 glass-card rounded-2xl p-4 flex items-center justify-center gap-2 flex-wrap">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="text-sm font-bold px-3 py-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed text-muted-foreground"
                  >
                    Prev
                  </button>
                  {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                    const page = totalPages <= 7 ? i + 1 : currentPage <= 4 ? i + 1 : currentPage >= totalPages - 3 ? totalPages - 6 + i : currentPage - 3 + i;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                          page === currentPage ? "bg-primary text-white shadow-lg" : "hover:bg-primary/10 hover:text-primary text-muted-foreground"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 text-sm text-primary font-bold px-3 py-2 hover:bg-primary/10 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function PhoneFinderPage() {
  return <Suspense><PhoneFinderPageInner /></Suspense>;
}

