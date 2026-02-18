import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Slider } from "@/components/ui/slider";
import {
  Search, SlidersHorizontal, X, ChevronRight, Cpu, MemoryStick,
  HardDrive, Camera, Battery, Monitor, Wifi, Star, Filter,
  Smartphone, ChevronDown, ChevronUp, GitCompare, ExternalLink,
  Zap, Shield, RefreshCw
} from "lucide-react";

// ─── Phone Images ──────────────────────────────────────────────────────────────
import samsungImg from "@/assets/phones/samsung-s25-ultra.png";
import iphoneImg from "@/assets/phones/iphone-16-pro-max.png";
import oneplusImg from "@/assets/phones/oneplus-13.png";
import motorolaImg from "@/assets/phones/motorola-edge-50.png";
import xiaomiImg from "@/assets/phones/xiaomi-15-ultra.png";
import realmeImg from "@/assets/phones/realme-p4.png";
import googleImg from "@/assets/phones/google-pixel-9-pro.png";
import vivoImg from "@/assets/phones/vivo-x200.png";

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

// ─── Mock Phone Data ───────────────────────────────────────────────────────────
const phoneResults = [
  {
    id: 1,
    name: "Samsung Galaxy S26 Ultra",
    brand: "Samsung",
    releaseDate: "Feb 2026",
    price: 1299,
    priceLabel: "$1,299",
    score: 99,
    chipset: "Snapdragon 8 Elite 2",
    ram: "16 GB RAM",
    ramGB: 16,
    storageGB: 512,
    mainCamera: "200 MP + 50 MP + 12 MP",
    mainCameraMP: 200,
    frontCamera: "12 MP",
    battery: "5500 mAh | 65W Fast Charging",
    batteryMAh: 5500,
    display: "6.9\" AMOLED | 120Hz",
    refreshHz: 120,
    network: ["5G", "4G LTE", "VoLTE", "Dual SIM"],
    os: "Android",
    color: "#1428A0",
    image: samsungImg,
    isNew: true,
    userRating: 4.7,
    ratingCount: "2,341",
    expertRating: 9.2,
    award: "Best Flagship 2026",
  },
  {
    id: 2,
    name: "iPhone 17 Pro Max",
    brand: "Apple",
    releaseDate: "Sep 2025",
    price: 1199,
    priceLabel: "$1,199",
    score: 98,
    chipset: "Apple A19 Pro",
    ram: "8 GB RAM",
    ramGB: 8,
    storageGB: 256,
    mainCamera: "48 MP + 48 MP + 12 MP",
    mainCameraMP: 48,
    frontCamera: "24 MP",
    battery: "4685 mAh | 27W Charging",
    batteryMAh: 4685,
    display: "6.9\" OLED | ProMotion 120Hz",
    refreshHz: 120,
    network: ["5G", "4G LTE", "eSIM"],
    os: "iOS",
    color: "#555555",
    image: iphoneImg,
    isNew: false,
    userRating: 4.8,
    ratingCount: "8,219",
    expertRating: 9.4,
    award: "Best Camera Phone",
  },
  {
    id: 3,
    name: "OnePlus 13",
    brand: "OnePlus",
    releaseDate: "Jan 2026",
    price: 699,
    priceLabel: "$699",
    score: 95,
    chipset: "Snapdragon 8 Gen 3",
    ram: "12 GB RAM",
    ramGB: 12,
    storageGB: 256,
    mainCamera: "50 MP + 48 MP + 48 MP",
    mainCameraMP: 50,
    frontCamera: "32 MP",
    battery: "6000 mAh | 100W SuperVOOC",
    batteryMAh: 6000,
    display: "6.82\" AMOLED | 120Hz",
    refreshHz: 120,
    network: ["5G", "4G LTE", "VoLTE", "Dual SIM"],
    os: "Android",
    color: "#F5010C",
    image: oneplusImg,
    isNew: true,
    userRating: 4.6,
    ratingCount: "1,874",
    expertRating: 8.9,
    award: "Best Value Flagship",
  },
  {
    id: 4,
    name: "Motorola Edge 50 Pro",
    brand: "Motorola",
    releaseDate: "Dec 2025",
    price: 549,
    priceLabel: "$549",
    score: 91,
    chipset: "Snapdragon 7 Gen 4",
    ram: "12 GB RAM",
    ramGB: 12,
    storageGB: 256,
    mainCamera: "50 MP + 13 MP",
    mainCameraMP: 50,
    frontCamera: "50 MP",
    battery: "5000 mAh | 68W Turbo",
    batteryMAh: 5000,
    display: "6.7\" pOLED | 144Hz",
    refreshHz: 144,
    network: ["5G", "4G LTE", "VoLTE"],
    os: "Android",
    color: "#002B5C",
    image: motorolaImg,
    isNew: false,
    userRating: 4.4,
    ratingCount: "923",
    expertRating: 8.4,
    award: "Best Mid-Range 2025",
  },
  {
    id: 5,
    name: "Xiaomi 17 Ultra",
    brand: "Xiaomi",
    releaseDate: "Mar 2026",
    price: 1099,
    priceLabel: "$1,099",
    score: 98,
    chipset: "Snapdragon 8 Elite 2",
    ram: "16 GB RAM",
    ramGB: 16,
    storageGB: 512,
    mainCamera: "200 MP + 50 MP + 50 MP",
    mainCameraMP: 200,
    frontCamera: "32 MP",
    battery: "6500 mAh | 90W HyperCharge",
    batteryMAh: 6500,
    display: "6.85\" AMOLED | 120Hz",
    refreshHz: 120,
    network: ["5G", "4G LTE", "Dual SIM"],
    os: "Android",
    color: "#FF6900",
    image: xiaomiImg,
    isNew: true,
    userRating: 4.7,
    ratingCount: "441",
    expertRating: 9.1,
    award: "Best Camera Megapixels",
  },
  {
    id: 6,
    name: "Realme 13 Pro+",
    brand: "Realme",
    releaseDate: "Nov 2025",
    price: 399,
    priceLabel: "$399",
    score: 85,
    chipset: "Snapdragon",
    ram: "8 GB RAM",
    ramGB: 8,
    storageGB: 256,
    mainCamera: "50 MP + 64 MP",
    mainCameraMP: 64,
    frontCamera: "32 MP",
    battery: "5000 mAh | 67W Turbo",
    batteryMAh: 5000,
    display: "6.7\" AMOLED | 120Hz",
    refreshHz: 120,
    network: ["5G", "4G LTE", "VoLTE", "Dual SIM"],
    os: "Android",
    color: "#E4A900",
    image: realmeImg,
    isNew: false,
    userRating: 4.3,
    ratingCount: "3,102",
    expertRating: 8.0,
    award: "Best Under $400",
  },
  {
    id: 7,
    name: "Google Pixel 10 Pro",
    brand: "Google",
    releaseDate: "Oct 2025",
    price: 999,
    priceLabel: "$999",
    score: 96,
    chipset: "Google Tensor G5",
    ram: "12 GB RAM",
    ramGB: 12,
    storageGB: 256,
    mainCamera: "50 MP + 48 MP + 48 MP",
    mainCameraMP: 50,
    frontCamera: "10.5 MP",
    battery: "5060 mAh | 45W Wired",
    batteryMAh: 5060,
    display: "6.3\" OLED | 120Hz",
    refreshHz: 120,
    network: ["5G", "4G LTE", "eSIM"],
    os: "Android",
    color: "#4285F4",
    image: googleImg,
    isNew: false,
    userRating: 4.5,
    ratingCount: "1,633",
    expertRating: 8.8,
    award: "Best AI Features",
  },
  {
    id: 8,
    name: "Vivo X200 Pro",
    brand: "Vivo",
    releaseDate: "Jan 2026",
    price: 849,
    priceLabel: "$849",
    score: 94,
    chipset: "MediaTek Dimensity",
    ram: "12 GB RAM",
    ramGB: 12,
    storageGB: 256,
    mainCamera: "200 MP + 50 MP + 50 MP",
    mainCameraMP: 200,
    frontCamera: "32 MP",
    battery: "6000 mAh | 90W FlashCharge",
    batteryMAh: 6000,
    display: "6.82\" AMOLED | 120Hz",
    refreshHz: 120,
    network: ["5G", "4G LTE", "VoLTE", "Dual SIM"],
    os: "Android",
    color: "#415FFF",
    image: vivoImg,
    isNew: true,
    userRating: 4.6,
    ratingCount: "711",
    expertRating: 8.7,
    award: "Best Zeiss Camera",
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
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");

  const toggleFilter = (key: keyof Filters, val: string) => {
    setFilters(prev => {
      const arr = prev[key] as string[];
      return { ...prev, [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] };
    });
  };

  const activeCount = [
    filters.brands, filters.ram, filters.storage, filters.camera,
    filters.battery, filters.display, filters.chipset, filters.network, filters.os
  ].reduce((a, b) => a + b.length, 0);

  const clearAll = () => setFilters(prev => ({
    ...prev,
    brands: [], ram: [], storage: [], camera: [],
    battery: [], display: [], chipset: [], network: [], os: [],
    priceRange: [0, 1500],
  }));

  // Filtering logic
  const filteredResults = useMemo(() => {
    return phoneResults.filter(p => {
      if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !p.brand.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
      if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) return false;
      if (filters.network.length > 0 && !filters.network.some(n => p.network.includes(n))) return false;
      if (filters.os.length > 0 && !filters.os.includes(p.os)) return false;
      if (filters.chipset.length > 0 && !filters.chipset.some(c => p.chipset.includes(c))) return false;
      if (filters.ram.length > 0) {
        const minRam = Math.max(...filters.ram.map(r => parseInt(r)));
        if (p.ramGB < minRam) return false;
      }
      if (filters.storage.length > 0) {
        const minStorage = Math.max(...filters.storage.map(s => {
          const n = parseInt(s);
          return s.includes("TB") ? n * 1024 : n;
        }));
        if (p.storageGB < minStorage) return false;
      }
      if (filters.camera.length > 0) {
        const minCam = Math.max(...filters.camera.map(c => parseInt(c)));
        if (p.mainCameraMP < minCam) return false;
      }
      if (filters.battery.length > 0) {
        const minBat = Math.max(...filters.battery.map(b => parseInt(b)));
        if (p.batteryMAh < minBat) return false;
      }
      if (filters.display.length > 0) {
        const minHz = Math.max(...filters.display.map(d => parseInt(d)));
        if (p.refreshHz < minHz) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "score") return b.score - a.score;
      if (sortBy === "newest") return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      return b.score - a.score;
    });
  }, [filters, sortBy]);

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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-foreground via-foreground/95 to-foreground/85 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 right-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute top-4 right-1/3 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl" />
          </div>
          <div className="max-w-screen-xl mx-auto px-4 py-10 relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary text-xs font-bold uppercase tracking-widest">Advanced Search</span>
              <div className="h-px flex-1 max-w-[60px] bg-primary/30" />
            </div>
            <h1 className="text-white text-3xl md:text-4xl font-black mb-2 tracking-tight">Phone Finder</h1>
            <p className="text-white/50 text-sm max-w-lg">Use filters to find your perfect smartphone by exact specifications — brand, chipset, camera, battery, and more.</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
                <Smartphone size={14} className="text-primary" />
                <span className="text-white text-xs font-semibold">{phoneResults.length} Phones</span>
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
          <div className="max-w-screen-xl mx-auto px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide">
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

        <div className="max-w-screen-xl mx-auto px-4 py-6">
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
                  Showing <span className="font-bold text-foreground text-base">{filteredResults.length}</span>
                  <span className="text-xs ml-1">of {phoneResults.length} phones</span>
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground hidden sm:block">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="glass text-xs px-3 py-1.5 rounded-lg border border-white/10 focus:outline-none focus:border-primary/30 text-foreground cursor-pointer bg-transparent"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="score">Spec Score</option>
                  </select>
                </div>
              </div>

              {/* Active filter chips */}
              {activeChips.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {activeChips.map((chip, i) => (
                    <span key={i} className="flex items-center gap-1.5 bg-primary/15 border border-primary/25 text-primary text-xs px-3 py-1.5 rounded-full font-medium">
                      {chip.label}
                      <X
                        size={10}
                        className="cursor-pointer hover:text-primary/60 transition-colors"
                        onClick={() => toggleFilter(chip.key, chip.label)}
                      />
                    </span>
                  ))}
                  <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-primary px-2 py-1.5 transition-colors font-medium">
                    Clear all
                  </button>
                </div>
              )}

              {/* Phone Cards */}
              <div className="space-y-4">
                {filteredResults.length === 0 ? (
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
                  <div
                    key={phone.id}
                    className="glass-card rounded-2xl overflow-hidden hover:shadow-2xl hover:border-primary/25 hover:-translate-y-0.5 transition-all duration-300 group"
                  >
                    {/* Top accent line */}
                    <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${phone.color}40, ${phone.color}20, transparent)` }} />
                    
                    <div className="p-4 sm:p-5 flex gap-4 sm:gap-5">
                      {/* Phone Image */}
                      <div className="shrink-0">
                        <div
                          className="w-24 sm:w-28 h-36 sm:h-40 rounded-2xl overflow-hidden relative flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${phone.color}15, ${phone.color}05)`, border: `1px solid ${phone.color}25` }}
                        >
                          <ScoreBadge score={phone.score} />
                          <img
                            src={phone.image}
                            alt={phone.name}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        {/* Name + Price */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              {phone.isNew && (
                                <span className="bg-green-500/15 border border-green-500/30 text-green-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">New</span>
                              )}
                            </div>
                            <h3 className="font-black text-base sm:text-lg leading-tight group-hover:text-primary transition-colors mt-0.5">
                              {phone.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Released: {phone.releaseDate}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-black text-xl sm:text-2xl leading-none" style={{ color: phone.color }}>{phone.priceLabel}</p>
                            <a href="#" className="text-primary text-xs font-bold hover:underline flex items-center gap-1 justify-end mt-1">
                              Go to Store <ExternalLink size={10} />
                            </a>
                          </div>
                        </div>

                        {/* Award badge */}
                        {phone.award && (
                          <div className="flex items-center gap-1.5 mb-2.5">
                            <div className="glass border border-amber-500/25 text-amber-500 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                              <Star size={9} className="fill-amber-500" />
                              {phone.award}
                            </div>
                          </div>
                        )}

                        {/* Specs grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-3">
                          {[
                            { icon: Cpu, label: phone.chipset },
                            { icon: MemoryStick, label: phone.ram },
                            { icon: Camera, label: `${phone.mainCamera} Rear` },
                            { icon: Camera, label: `${phone.frontCamera} Selfie` },
                            { icon: Battery, label: phone.battery },
                            { icon: Monitor, label: phone.display },
                          ].map((spec, j) => (
                            <div key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="w-5 h-5 glass rounded-md flex items-center justify-center shrink-0">
                                <spec.icon size={10} className="text-primary/80" />
                              </div>
                              <span className="line-clamp-1">{spec.label}</span>
                            </div>
                          ))}
                        </div>

                        {/* Ratings + actions */}
                        <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-white/8 flex-wrap">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Star size={11} className="text-amber-500 fill-amber-500" />
                              <span className="text-xs font-bold">{phone.userRating}/5</span>
                              <span className="text-xs text-muted-foreground hidden sm:inline">({phone.ratingCount})</span>
                            </div>
                            <div className="text-muted-foreground/30">|</div>
                            <span className="text-xs text-muted-foreground">Expert: <span className="font-bold text-foreground">{phone.expertRating}/10</span></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <a href="#" className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
                              View All Specs <ChevronRight size={11} />
                            </a>
                            <button className="glass border border-white/10 hover:border-primary/30 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 text-muted-foreground hover:text-primary">
                              <GitCompare size={10} /> Compare
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {filteredResults.length > 0 && (
                <div className="mt-6 glass-card rounded-2xl p-4 flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map(p => (
                    <button
                      key={p}
                      className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                        p === 1 ? "bg-primary text-white shadow-lg" : "hover:bg-primary/10 hover:text-primary text-muted-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button className="flex items-center gap-1 text-sm text-primary font-bold px-3 py-2 hover:bg-primary/10 rounded-xl transition-all">
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
