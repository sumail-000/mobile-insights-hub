"use client";

import { useState, useEffect } from "react";
import { Wifi, MemoryStick, HardDrive, Zap, Monitor, Brain, ChevronRight, TrendingUp, Users, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import _heroBanner from "@/assets/hero-banner.jpg";
import { getDevices } from "@/lib/api";
const heroBanner = _heroBanner.src;

const popularFeatures = [
  { icon: Wifi, label: "5G Phones" },
  { icon: MemoryStick, label: "8GB & Above RAM" },
  { icon: HardDrive, label: "256 GB & Above Memory" },
  { icon: Zap, label: "Slimmest Phones" },
  { icon: Monitor, label: "120Hz Refresh Rate" },
  { icon: Brain, label: "AI Smartphones" },
];

const BRAND_BG: Record<string, string> = {
  Samsung: "#f0f4f8", Apple: "#f5f5f5", Xiaomi: "#f8f3f0", OnePlus: "#fff0f0",
  Google: "#f0f4ff", Motorola: "#f0f4ff", Vivo: "#f0f0ff", OPPO: "#f0f0f8",
};
type TrendingPhone = { name: string; slug: string; fans: string; image: string; bg: string };

const brands = ["Any Brand", "Samsung", "Apple", "Xiaomi", "OnePlus", "Google", "Vivo", "Motorola", "Realme", "Oppo"];
const minPrices = ["No Min", "$100", "$200", "$300", "$400", "$500", "$600", "$700", "$800"];
const maxPrices = ["No Max", "$200", "$300", "$400", "$500", "$600", "$800", "$1000", "$1500+"];
const ramOptions = ["Any RAM", "2 GB", "4 GB", "6 GB", "8 GB", "12 GB", "16 GB+"];
const storageOptions = ["Any Storage", "64 GB", "128 GB", "256 GB", "512 GB", "1 TB"];

const selectClass = "w-full bg-white/60 backdrop-blur-sm border border-border/60 rounded-lg px-3 py-2 text-sm font-medium text-foreground focus:outline-none focus:border-primary/60 focus:bg-white/80 transition-all appearance-none cursor-pointer";

export default function HeroFinder() {
  const [brand, setBrand] = useState("Any Brand");
  const [minPrice, setMinPrice] = useState("No Min");
  const [maxPrice, setMaxPrice] = useState("No Max");
  const [ram, setRam] = useState("Any RAM");
  const [storage, setStorage] = useState("Any Storage");
  const [trendingPhones, setTrendingPhones] = useState<TrendingPhone[]>([]);
  const router = useRouter();

  useEffect(() => {
    getDevices({ sort: "fans", limit: 5 }).then(res => {
      setTrendingPhones(res.devices.map(d => ({
        name: d.name,
        slug: d.slug,
        fans: d.fans ? `${d.fans} fans` : "",
        image: d.thumbnail || "",
        bg: BRAND_BG[d.brand] || "#f5f5f5",
      })));
    }).catch(() => {});
  }, []);

  const handleFind = () => {
    router.push("/phone-finder");
  };

  return (
    <section className="relative overflow-hidden">
      {/* Hero image background */}
      <div className="relative h-52 md:h-72 lg:h-80 overflow-hidden">
        <img src={heroBanner} alt="Latest Smartphones" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent flex items-center">
          <div className="px-6 md:px-10 w-full">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-2">MobilePhoneCompare 2026</p>
            <h1 className="text-white text-2xl md:text-4xl font-black leading-tight mb-2">
              Find Your Perfect<br />Smartphone
            </h1>
            <p className="text-white/60 text-sm max-w-sm">
              Compare specs, read reviews, discover the best phones at every price.
            </p>
          </div>
        </div>
      </div>

      {/* Finder tool */}
      <div className="px-4 py-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Phone finder card */}
          <div className="md:col-span-2 glass-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal size={16} className="text-primary" />
              <h2 className="text-base font-bold">Find a Mobile For You</h2>
            </div>

            {/* Filter grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {/* Brand */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Brand</label>
                <div className="relative">
                  <select value={brand} onChange={e => setBrand(e.target.value)} className={selectClass}>
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <ChevronRight size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground rotate-90 pointer-events-none" />
                </div>
              </div>

              {/* Min Price */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Min Price</label>
                <div className="relative">
                  <select value={minPrice} onChange={e => setMinPrice(e.target.value)} className={selectClass}>
                    {minPrices.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <ChevronRight size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground rotate-90 pointer-events-none" />
                </div>
              </div>

              {/* Max Price */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Max Price</label>
                <div className="relative">
                  <select value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className={selectClass}>
                    {maxPrices.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <ChevronRight size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground rotate-90 pointer-events-none" />
                </div>
              </div>

              {/* RAM */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">RAM</label>
                <div className="relative">
                  <select value={ram} onChange={e => setRam(e.target.value)} className={selectClass}>
                    {ramOptions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <ChevronRight size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground rotate-90 pointer-events-none" />
                </div>
              </div>

              {/* Storage */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Storage</label>
                <div className="relative">
                  <select value={storage} onChange={e => setStorage(e.target.value)} className={selectClass}>
                    {storageOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronRight size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground rotate-90 pointer-events-none" />
                </div>
              </div>

              {/* Find button fills last cell */}
              <div className="flex flex-col justify-end">
                <button
                  onClick={handleFind}
                  className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors shadow-md flex items-center justify-center gap-2 h-[38px]"
                >
                  <Search size={14} />
                  Find Mobiles
                </button>
              </div>
            </div>

            {/* Divider + Popular features */}
            <div className="border-t border-border/40 pt-3">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">Mobiles by Popular Features</p>
              <div className="flex flex-wrap gap-2">
                {popularFeatures.map((f, i) => (
                  <Link
                    key={i}
                    href="/phone-finder"
                    className="flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-primary bg-white/50 hover:bg-white/70 border border-border/50 hover:border-primary/30 px-2.5 py-1.5 rounded-lg transition-all group"
                  >
                    <f.icon size={12} className="text-muted-foreground group-hover:text-primary shrink-0" />
                    {f.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Trending this week */}
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <TrendingUp size={13} className="text-primary" />
                <h3 className="font-bold text-sm">Trending This Week</h3>
              </div>
              <Link href="/phone-finder" className="text-primary text-[10px] font-semibold hover:underline">View All</Link>
            </div>
            <div className="space-y-1.5">
              {trendingPhones.map((phone, i) => (
                <Link
                  key={i}
                  href={`/phone/${phone.slug}`}
                  className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-white/30 transition-colors group"
                >
                  <span className="text-[10px] font-black text-muted-foreground w-4 shrink-0 text-center">{i + 1}</span>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-white/50" style={{ backgroundColor: phone.bg }}>
                    <img src={phone.image} alt={phone.name} className="h-8 w-auto object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold group-hover:text-primary transition-colors line-clamp-1">{phone.name}</p>
                    <div className="flex items-center gap-1">
                      <Users size={9} className="text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">{phone.fans}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-primary shrink-0">{phone.fans}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
