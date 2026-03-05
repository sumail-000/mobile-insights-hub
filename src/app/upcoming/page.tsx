"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ChevronRight, Bell, Calendar, Search, X,
  Cpu, Camera, Battery, Monitor, MemoryStick, Star,
  Smartphone, Filter, Globe, Loader2
} from "lucide-react";
import { getUpcoming } from "@/lib/api";
import type { UpcomingPhone } from "@/lib/api";

const statusColors: Record<string, string> = {
  Confirmed: "bg-green-600",
  Rumored: "bg-purple-600",
  Official: "bg-primary",
};

const BRAND_COLORS: Record<string, string> = {
  Samsung: "#1428A0", Apple: "#555555", Xiaomi: "#FF6900", OnePlus: "#F5010C",
  Google: "#4285F4", Motorola: "#5C8EE6", Vivo: "#415FFF", OPPO: "#1D4289",
};

export default function UpcomingPage() {
  const [phones, setPhones] = useState<UpcomingPhone[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeQuarter, setActiveQuarter] = useState("All");
  const [activeBrand, setActiveBrand] = useState("All");
  const [search, setSearch] = useState("");
  const [notified, setNotified] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    getUpcoming().then(res => { setPhones(res.upcoming); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = phones.filter(p => {
    const matchQ = activeQuarter === "All" || p.launch_quarter === activeQuarter;
    const matchB = activeBrand === "All" || p.brand === activeBrand;
    const matchS = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    return matchQ && matchB && matchS;
  });

  const toggleNotify = (slug: string) => {
    setNotified(prev => prev.includes(slug) ? prev.filter(n => n !== slug) : [...prev, slug]);
  };

  const quarters = ["All", ...Array.from(new Set(phones.map(p => p.launch_quarter).filter(Boolean)))];
  const brands = ["All", ...Array.from(new Set(phones.map(p => p.brand)))];

  return (
    <div className="min-h-screen page-bg">
      <Navbar />

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-foreground via-foreground/95 to-foreground/85 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 right-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        <div className="px-4 py-10 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={14} className="text-primary" />
            <span className="text-primary text-xs font-bold uppercase tracking-widest">Coming Soon</span>
          </div>
          <h1 className="text-white text-3xl md:text-4xl font-black mb-2 tracking-tight">Upcoming Mobiles</h1>
          <p className="text-white/50 text-sm max-w-lg mb-5">Track upcoming smartphone launches — confirmed releases, leaked specs, expected prices, and launch dates all in one place.</p>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
              <Smartphone size={14} className="text-primary" />
              <span className="text-white text-xs font-semibold">{phones.length} Upcoming Phones</span>
            </div>
            <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
              <Bell size={14} className="text-primary" />
              <span className="text-white text-xs font-semibold">Set Launch Alerts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-foreground/95 border-b border-white/10">
        <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <span className="text-white/40 text-xs whitespace-nowrap shrink-0 font-medium flex items-center gap-1">
            <Calendar size={11} /> Quarter:
          </span>
          {quarters.map(q => (
            <button key={q} onClick={() => setActiveQuarter(q)}
              className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-all shrink-0 font-medium border ${
                activeQuarter === q ? "bg-primary text-white border-primary" : "border-white/20 text-white/70 hover:border-primary/50 hover:text-white"
              }`}>{q}</button>
          ))}
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Brand filter + search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <Filter size={13} className="text-muted-foreground shrink-0" />
            {brands.map(b => (
              <button key={b} onClick={() => setActiveBrand(b)}
                className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-medium border transition-all shrink-0 ${
                  activeBrand === b ? "border-primary bg-primary/10 text-primary" : "border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}>{b}</button>
            ))}
          </div>
          <div className="relative shrink-0 sm:ml-auto">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search phones..."
              className="glass-card pl-9 pr-4 py-2 text-xs rounded-xl border-0 focus:outline-none focus:ring-1 focus:ring-primary/40 w-52" />
            {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X size={12} /></button>}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-primary" /></div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-muted-foreground"><span className="font-bold text-foreground">{filtered.length}</span> upcoming phones</span>
            </div>
            <div className="space-y-4">
              {filtered.length === 0 ? (
                <div className="glass-card rounded-2xl p-14 text-center">
                  <Smartphone size={36} className="text-muted-foreground mx-auto mb-4 opacity-40" />
                  <p className="font-bold text-lg mb-1">No phones found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                </div>
              ) : filtered.map(phone => {
                const bc = phone.brand_color || BRAND_COLORS[phone.brand] || "#ff6e14";
                return (
                  <div key={phone.slug} className="glass-card rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 group">
                    <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${bc}50, ${bc}20, transparent)` }} />
                    <div className="p-4 sm:p-5 flex gap-4 sm:gap-6">
                      <div className="w-28 sm:w-36 h-40 sm:h-48 rounded-2xl flex items-center justify-center shrink-0 relative overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${bc}15, ${bc}05)`, border: `1px solid ${bc}25` }}>
                        {phone.thumbnail_url ? (
                          <img src={phone.thumbnail_url} alt={phone.name} className="h-full w-auto object-contain p-3 drop-shadow-xl group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-20 rounded-xl border-2 opacity-25" style={{ borderColor: bc }} />
                            <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: bc }}>Coming Soon</span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{phone.hype}% Hype</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${statusColors[phone.status] || "bg-gray-600"}`}>{phone.status}</span>
                              <span className="glass text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/20 flex items-center gap-1">
                                <Calendar size={9} /> {phone.launch_date || phone.launch_quarter}
                              </span>
                            </div>
                            <h3 className="text-lg font-black group-hover:text-primary transition-colors">{phone.name}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">{phone.description}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs text-muted-foreground">Expected Price</p>
                            <p className="font-black text-xl" style={{ color: bc }}>{phone.expected_price}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-3 mt-3">
                          {[
                            { icon: Cpu, label: phone.chipset },
                            { icon: MemoryStick, label: phone.ram ? phone.ram + " RAM" : null },
                            { icon: Camera, label: phone.camera ? phone.camera + " Camera" : null },
                            { icon: Battery, label: phone.battery },
                            { icon: Monitor, label: phone.display },
                          ].filter(s => s.label).map((spec, j) => (
                            <div key={j} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <div className="w-5 h-5 glass rounded-md flex items-center justify-center shrink-0">
                                <spec.icon size={10} className="text-primary/70" />
                              </div>
                              <span className="line-clamp-1 text-[11px]">{spec.label}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-2.5 border-t border-white/10 flex-wrap gap-2">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Star size={11} className="text-amber-500 fill-amber-500" />
                              <span className="font-semibold">{phone.followers}</span>
                              <span>following</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Globe size={11} />
                              <span>{phone.launch_quarter}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => toggleNotify(phone.slug)}
                              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                                notified.includes(phone.slug)
                                  ? "bg-primary/15 border-primary/40 text-primary"
                                  : "glass border-white/20 hover:border-primary/40 text-muted-foreground hover:text-primary"
                              }`}>
                              <Bell size={11} className={notified.includes(phone.slug) ? "fill-primary" : ""} />
                              {notified.includes(phone.slug) ? "Notified" : "Notify Me"}
                            </button>
                            <Link href={`/phone/${phone.slug}`} className="flex items-center gap-1 text-primary text-xs font-bold hover:underline">
                              Full Specs <ChevronRight size={11} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

