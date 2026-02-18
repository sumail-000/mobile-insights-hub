import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Slider } from "@/components/ui/slider";
import {
  Search, SlidersHorizontal, X, ChevronRight, Cpu, MemoryStick,
  HardDrive, Camera, Battery, Monitor, Wifi, Zap, Star, Filter,
  Smartphone, ChevronDown, ChevronUp
} from "lucide-react";

// ─── Filter Data ─────────────────────────────────────────────────────────────
const brands = ["Samsung", "Apple", "Xiaomi", "OnePlus", "Google", "Motorola", "Vivo", "OPPO", "Realme", "Infinix", "Tecno", "Nokia", "Huawei", "Honor", "Sony", "Asus", "Nothing"];
const ramOptions = ["2 GB", "3 GB", "4 GB", "6 GB", "8 GB", "12 GB", "16 GB", "18 GB"];
const storageOptions = ["16 GB", "32 GB", "64 GB", "128 GB", "256 GB", "512 GB", "1 TB"];
const cameraOptions = ["8 MP & above", "12 MP & above", "48 MP & above", "64 MP & above", "108 MP & above", "200 MP & above"];
const batteryOptions = ["3000 mAh+", "4000 mAh+", "5000 mAh+", "6000 mAh+", "7000 mAh+"];
const displayOptions = ["60 Hz", "90 Hz", "120 Hz", "144 Hz", "165 Hz"];
const chipsetOptions = ["Snapdragon", "MediaTek", "Exynos", "Apple Silicon", "Kirin"];
const networkOptions = ["4G LTE", "5G"];
const osOptions = ["Android", "iOS", "HarmonyOS"];
const screenSizeOptions = ["Under 5.5\"", "5.5\" - 6.0\"", "6.0\" - 6.5\"", "6.5\" & above"];

// ─── Mock Phone Results ───────────────────────────────────────────────────────
const phoneResults = [
  {
    name: "Samsung Galaxy S26 Ultra",
    brand: "Samsung",
    releaseDate: "Feb 2026",
    price: "$1,299",
    score: 99,
    chipset: "Snapdragon 8 Elite 2",
    ram: "16 GB RAM",
    mainCamera: "200 MP + 50 MP + 12 MP",
    frontCamera: "12 MP",
    battery: "5500 mAh | 65W Fast Charging",
    display: "6.9 inches | AMOLED | 120Hz",
    color: "#1428A0",
    bg: "#EEF0FA",
    network: "5G",
  },
  {
    name: "iPhone 17 Pro Max",
    brand: "Apple",
    releaseDate: "Sep 2025",
    price: "$1,199",
    score: 98,
    chipset: "Apple A19 Pro",
    ram: "8 GB RAM",
    mainCamera: "48 MP + 48 MP + 12 MP",
    frontCamera: "24 MP",
    battery: "4685 mAh | 27W Charging",
    display: "6.9 inches | OLED | ProMotion",
    color: "#555",
    bg: "#F5F5F5",
    network: "5G",
  },
  {
    name: "OnePlus 15R",
    brand: "OnePlus",
    releaseDate: "Jan 2026",
    price: "$579",
    score: 95,
    chipset: "Snapdragon 8 Gen 3",
    ram: "12 GB RAM",
    mainCamera: "50 MP + 8 MP + 2 MP",
    frontCamera: "16 MP",
    battery: "6000 mAh | 100W SuperVOOC",
    display: "6.78 inches | AMOLED | 120Hz",
    color: "#F5010C",
    bg: "#FFF0F0",
    network: "5G",
  },
  {
    name: "Motorola Edge 70 Pro",
    brand: "Motorola",
    releaseDate: "Dec 2025",
    price: "$699",
    score: 91,
    chipset: "Snapdragon 7 Gen 4",
    ram: "12 GB RAM",
    mainCamera: "50 MP + 13 MP",
    frontCamera: "50 MP",
    battery: "5000 mAh | 68W Turbo",
    display: "6.7 inches | pOLED | 144Hz",
    color: "#002B5C",
    bg: "#EDF1F8",
    network: "5G",
  },
  {
    name: "Xiaomi 17 Ultra",
    brand: "Xiaomi",
    releaseDate: "Mar 2026",
    price: "$1,099",
    score: 98,
    chipset: "Snapdragon 8 Elite 2",
    ram: "16 GB RAM",
    mainCamera: "200 MP + 50 MP + 50 MP",
    frontCamera: "32 MP",
    battery: "6500 mAh | 90W HyperCharge",
    display: "6.85 inches | AMOLED | 120Hz",
    color: "#FF6900",
    bg: "#FFF3EC",
    network: "5G",
  },
  {
    name: "Realme P4 Power",
    brand: "Realme",
    releaseDate: "Nov 2025",
    price: "$299",
    score: 79,
    chipset: "Snapdragon 7s Gen 2",
    ram: "8 GB RAM",
    mainCamera: "50 MP + 8 MP",
    frontCamera: "32 MP",
    battery: "7000 mAh | 30W Turbo",
    display: "6.72 inches | AMOLED | 120Hz",
    color: "#E4A900",
    bg: "#FFFCE6",
    network: "5G",
  },
  {
    name: "Google Pixel 10 Pro",
    brand: "Google",
    releaseDate: "Oct 2025",
    price: "$999",
    score: 96,
    chipset: "Google Tensor G5",
    ram: "12 GB RAM",
    mainCamera: "50 MP + 48 MP + 48 MP",
    frontCamera: "10.5 MP",
    battery: "5060 mAh | 45W Wired",
    display: "6.3 inches | OLED | 120Hz",
    color: "#4285F4",
    bg: "#EFF4FF",
    network: "5G",
  },
  {
    name: "Vivo X200 Ultra",
    brand: "Vivo",
    releaseDate: "Jan 2026",
    price: "$849",
    score: 94,
    chipset: "Dimensity 9400",
    ram: "12 GB RAM",
    mainCamera: "200 MP + 50 MP + 50 MP",
    frontCamera: "32 MP",
    battery: "6000 mAh | 90W FlashCharge",
    display: "6.82 inches | AMOLED | 120Hz",
    color: "#415FFF",
    bg: "#EEF0FF",
    network: "5G",
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
  screenSize: string[];
}

function FilterSection({
  title,
  icon: Icon,
  options,
  selected,
  onToggle,
}: {
  title: string;
  icon: React.ElementType;
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-border/50 pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-primary" />
          <span className="text-sm font-semibold">{title}</span>
          {selected.length > 0 && (
            <span className="bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {selected.length}
            </span>
          )}
        </div>
        {open ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
      </button>
      {open && (
        <div className="space-y-1.5">
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => onToggle(opt)}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                  selected.includes(opt)
                    ? "bg-primary border-primary"
                    : "border-border group-hover:border-primary/50"
                }`}
              >
                {selected.includes(opt) && (
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span
                onClick={() => onToggle(opt)}
                className={`text-xs transition-colors ${selected.includes(opt) ? "text-primary font-medium" : "text-foreground group-hover:text-primary"}`}
              >
                {opt}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 90 ? "bg-green-700" : score >= 75 ? "bg-amber-600" : "bg-red-600";
  return (
    <div className={`${color} text-white rounded-lg px-2.5 py-1.5 text-center leading-tight min-w-[52px]`}>
      <div className="text-xl font-black leading-none">{score}%</div>
      <div className="text-[9px] opacity-80 font-medium">Spec Score</div>
    </div>
  );
}

export default function PhoneFinderPage() {
  const [filters, setFilters] = useState<Filters>({
    search: "",
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
    screenSize: [],
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleFilter = (key: keyof Filters, val: string) => {
    setFilters(prev => {
      const arr = prev[key] as string[];
      return {
        ...prev,
        [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val],
      };
    });
  };

  const activeCount = [
    filters.brands, filters.ram, filters.storage, filters.camera,
    filters.battery, filters.display, filters.chipset, filters.network, filters.os, filters.screenSize
  ].reduce((a, b) => a + b.length, 0);

  const clearAll = () => setFilters(prev => ({
    ...prev,
    brands: [], ram: [], storage: [], camera: [],
    battery: [], display: [], chipset: [], network: [], os: [], screenSize: [],
    priceRange: [0, 1500],
  }));

  // Simple filter logic
  const results = phoneResults.filter(p => {
    if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !p.brand.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
    if (filters.network.length > 0 && !filters.network.some(n => p.network === n)) return false;
    const price = parseInt(p.price.replace(/[^0-9]/g, ""));
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
    return true;
  });

  const sidebar = (
    <aside className="w-full">
      {/* Filter header */}
      <div className="glass-card rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-primary" />
            <h2 className="font-bold text-sm">Filters</h2>
            {activeCount > 0 && (
              <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5 font-bold">{activeCount}</span>
            )}
          </div>
          {activeCount > 0 && (
            <button onClick={clearAll} className="text-xs text-primary hover:underline font-semibold flex items-center gap-1">
              <X size={12} /> Clear All
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={filters.search}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Search phones..."
            className="w-full bg-background/50 border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Price Range */}
        <div className="mb-4 border-b border-border/50 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} className="text-primary" />
            <span className="text-sm font-semibold">Price Range</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-1.5 rounded">${filters.priceRange[0]}</span>
            <span className="text-muted-foreground text-xs flex-1 text-center">—</span>
            <span className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-1.5 rounded">${filters.priceRange[1]}{filters.priceRange[1] >= 1500 ? "+" : ""}</span>
          </div>
          <Slider
            value={filters.priceRange}
            onValueChange={v => setFilters(prev => ({ ...prev, priceRange: v }))}
            min={0}
            max={1500}
            step={50}
          />
        </div>

        <FilterSection title="Brand" icon={Smartphone} options={brands} selected={filters.brands} onToggle={v => toggleFilter("brands", v)} />
        <FilterSection title="Network" icon={Wifi} options={networkOptions} selected={filters.network} onToggle={v => toggleFilter("network", v)} />
        <FilterSection title="Chipset" icon={Cpu} options={chipsetOptions} selected={filters.chipset} onToggle={v => toggleFilter("chipset", v)} />
        <FilterSection title="RAM" icon={MemoryStick} options={ramOptions} selected={filters.ram} onToggle={v => toggleFilter("ram", v)} />
        <FilterSection title="Internal Storage" icon={HardDrive} options={storageOptions} selected={filters.storage} onToggle={v => toggleFilter("storage", v)} />
        <FilterSection title="Main Camera" icon={Camera} options={cameraOptions} selected={filters.camera} onToggle={v => toggleFilter("camera", v)} />
        <FilterSection title="Battery" icon={Battery} options={batteryOptions} selected={filters.battery} onToggle={v => toggleFilter("battery", v)} />
        <FilterSection title="Refresh Rate" icon={Monitor} options={displayOptions} selected={filters.display} onToggle={v => toggleFilter("display", v)} />
        <FilterSection title="Screen Size" icon={Monitor} options={screenSizeOptions} selected={filters.screenSize} onToggle={v => toggleFilter("screenSize", v)} />
        <FilterSection title="OS" icon={Cpu} options={osOptions} selected={filters.os} onToggle={v => toggleFilter("os", v)} />
      </div>

      <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-md">
        Apply Filters ({results.length} results)
      </button>
    </aside>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-foreground via-foreground/90 to-foreground/80 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          </div>
          <div className="max-w-screen-xl mx-auto px-4 py-10 relative z-10">
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">Advanced Search</p>
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">Phone Finder</h1>
            <p className="text-white/60 text-sm">Filter by exact specs to find your perfect smartphone</p>
          </div>
        </div>

        {/* Quick price filter bar */}
        <div className="bg-foreground/95 border-b border-white/10">
          <div className="max-w-screen-xl mx-auto px-4 py-2 flex items-center gap-3 overflow-x-auto scrollbar-hide">
            <span className="text-white/50 text-xs whitespace-nowrap shrink-0">Filter by Price:</span>
            {["Under $200", "$200–$400", "$400–$600", "$600–$800", "$800–$1000", "$1000+"].map((p, i) => (
              <button key={i} className="glass text-white/80 text-xs px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-primary/30 hover:text-white transition-colors shrink-0">
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 py-6">
          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="glass-card w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm"
            >
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-primary" />
                <span>Filters</span>
                {activeCount > 0 && <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5">{activeCount}</span>}
              </div>
              {sidebarOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {sidebarOpen && <div className="mt-3">{sidebar}</div>}
          </div>

          <div className="flex gap-6">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-64 shrink-0">{sidebar}</div>

            {/* Results */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-bold text-foreground">{results.length}</span> phones
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Sort:</span>
                  <select className="glass-card text-sm px-3 py-1.5 rounded-lg border-0 focus:outline-none text-foreground cursor-pointer">
                    <option>Popularity</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest First</option>
                    <option>Spec Score</option>
                  </select>
                </div>
              </div>

              {/* Active filters chips */}
              {activeCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {[...filters.brands, ...filters.network, ...filters.ram, ...filters.chipset].map((f, i) => (
                    <span key={i} className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full font-medium">
                      {f}
                      <X size={10} className="cursor-pointer hover:text-primary/70" onClick={() => {
                        const key = filters.brands.includes(f) ? "brands"
                          : filters.network.includes(f) ? "network"
                          : filters.ram.includes(f) ? "ram" : "chipset";
                        toggleFilter(key as keyof Filters, f);
                      }} />
                    </span>
                  ))}
                </div>
              )}

              <div className="space-y-4">
                {results.length === 0 ? (
                  <div className="glass-card rounded-xl p-12 text-center">
                    <Search size={40} className="text-muted-foreground mx-auto mb-4" />
                    <p className="font-semibold text-lg mb-2">No phones found</p>
                    <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters</p>
                    <button onClick={clearAll} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors">
                      Clear All Filters
                    </button>
                  </div>
                ) : results.map((phone, i) => (
                  <a
                    key={i}
                    href="#"
                    className="glass-card rounded-xl p-5 flex gap-5 hover:shadow-xl hover:border-primary/30 hover:-translate-y-0.5 transition-all group block"
                  >
                    {/* Phone visual */}
                    <div className="shrink-0 flex flex-col items-center gap-2">
                      <div
                        className="w-20 h-32 rounded-2xl border-2 flex items-center justify-center relative"
                        style={{ borderColor: phone.color + "55", backgroundColor: phone.color + "0d" }}
                      >
                        <ScoreBadge score={phone.score} />
                        <Smartphone size={28} style={{ color: phone.color + "99" }} className="absolute bottom-3" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <p className="font-bold text-foreground group-hover:text-primary transition-colors text-base leading-tight">{phone.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Release: {phone.releaseDate}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-foreground text-lg">{phone.price}</p>
                          <a href="#" className="text-primary text-xs font-semibold hover:underline">Go to Store</a>
                        </div>
                      </div>

                      {/* Specs grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-3">
                        {[
                          { icon: Cpu, label: phone.chipset },
                          { icon: MemoryStick, label: phone.ram },
                          { icon: Camera, label: phone.mainCamera + " Rear Camera" },
                          { icon: Camera, label: phone.frontCamera + " Front Camera" },
                          { icon: Battery, label: phone.battery },
                          { icon: Monitor, label: phone.display },
                        ].map((spec, j) => (
                          <div key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <spec.icon size={12} className="text-primary/70 shrink-0" />
                            <span className="line-clamp-1">{spec.label}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-amber-500 fill-amber-500" />
                          <span className="text-xs font-semibold">4.{Math.min(9, Math.floor(phone.score / 10))}/5</span>
                          <span className="text-xs text-muted-foreground">({(phone.score * 30 + 100).toLocaleString()} ratings)</span>
                        </div>
                        <span className="text-muted-foreground">·</span>
                        <a href="#" className="text-primary text-xs font-semibold hover:underline">View All Specs</a>
                        <span className="text-muted-foreground">·</span>
                        <button className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                          + Compare
                        </button>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {results.length > 0 && (
                <div className="mt-6 glass-card rounded-xl p-4 flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map(p => (
                    <button
                      key={p}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${p === 1 ? "bg-primary text-white" : "hover:bg-primary/10 hover:text-primary"}`}
                    >
                      {p}
                    </button>
                  ))}
                  <button className="flex items-center gap-1 text-sm text-primary font-semibold px-3 py-2 hover:bg-primary/10 rounded-lg transition-colors">
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
