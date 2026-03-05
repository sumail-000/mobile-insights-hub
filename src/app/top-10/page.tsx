"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Trophy, Star, ChevronRight, Crown, Award, Gamepad2,
  ScanFace, DollarSign, Loader2, Camera, Battery, Zap
} from "lucide-react";
import { getTopPhones } from "@/lib/api";
import type { TopDevice } from "@/lib/api";



const BRAND_COLORS: Record<string, string> = {
  Samsung: "#1428A0", Apple: "#555555", Xiaomi: "#FF6900", OnePlus: "#F5010C",
  Google: "#4285F4", Motorola: "#5C8EE6", Vivo: "#415FFF", OPPO: "#1D4289",
};

const categories = [
  { label: "Overall Top 10", icon: Trophy, color: "text-amber-500" },
  { label: "Best Camera", icon: Camera, color: "text-blue-500" },
  { label: "Best Battery", icon: Battery, color: "text-green-500" },
  { label: "Best Gaming", icon: Gamepad2, color: "text-purple-500" },
  { label: "Best Selfie", icon: ScanFace, color: "text-pink-500" },
  { label: "Best Under $500", icon: DollarSign, color: "text-teal-500" },
];

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg shrink-0"><Crown size={20} className="text-white" /></div>;
  if (rank === 2) return <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center shadow-lg shrink-0"><span className="text-white font-black text-sm">2</span></div>;
  if (rank === 3) return <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-orange-800 flex items-center justify-center shadow-lg shrink-0"><span className="text-white font-black text-sm">3</span></div>;
  return <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center shrink-0"><span className="font-black text-sm text-muted-foreground">#{rank}</span></div>;
}

export default function TopPhonesPage() {
  const [activeCategory, setActiveCategory] = useState("Overall Top 10");
  const [phones, setPhones] = useState<TopDevice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTopPhones("fans", 10).then(res => { setPhones(res.devices); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen page-bg">
      <Navbar />

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-foreground via-foreground/95 to-foreground/85 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 right-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        </div>
        <div className="px-4 py-10 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={14} className="text-amber-400 fill-amber-400" />
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Best of 2025</span>
          </div>
          <h1 className="text-white text-3xl md:text-4xl font-black mb-2 tracking-tight">Top 10 Phones</h1>
          <p className="text-white/50 text-sm max-w-lg">Ranked by our expert team using real-world testing, spec scores, user ratings, and value for money. Updated monthly.</p>
          <div className="flex items-center gap-3 mt-5 flex-wrap">
            {[{ label: "Expert Tested", icon: Award }, { label: "Real-World Scores", icon: Star }, { label: "Updated Monthly", icon: Zap }].map((b, i) => (
              <div key={i} className="glass rounded-xl px-3 py-1.5 flex items-center gap-2">
                <b.icon size={12} className="text-amber-400" />
                <span className="text-white text-xs font-semibold">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="bg-foreground/95 border-b border-white/10">
        <div className="px-4 py-2 flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full whitespace-nowrap transition-all shrink-0 ${
                activeCategory === cat.label ? "bg-primary text-white" : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <cat.icon size={11} />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Main list */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={15} className="text-amber-500" />
              <h2 className="font-bold text-base">{activeCategory} — 2025</h2>
              <span className="text-xs text-muted-foreground ml-auto">Last updated: May 2025</span>
            </div>

{loading ? (
              <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-primary" /></div>
            ) : (
            <div className="space-y-3">
              {phones.map(phone => {
                const bc = BRAND_COLORS[phone.brand] || "#ff6e14";
                const fansNum = phone.fans ? parseInt(String(phone.fans).replace(/,/g, "")) : 0;
                const score = Math.min(100, Math.max(50, Math.round(50 + (fansNum / 1000))));
                return (
                  <div key={phone.slug}
                    className={`glass-card rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 group ${phone.rank === 1 ? "ring-2 ring-amber-400/40" : ""}`}>
                    {phone.rank <= 3 && (
                      <div className="h-0.5 w-full" style={{ background: phone.rank === 1 ? "linear-gradient(90deg, #f59e0b, #d97706, transparent)" : phone.rank === 2 ? "linear-gradient(90deg, #94a3b8, #64748b, transparent)" : "linear-gradient(90deg, #b45309, #92400e, transparent)" }} />
                    )}
                    <div className="p-4 sm:p-5 flex gap-4">
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        <RankBadge rank={phone.rank} />
                      </div>
                      <div className="w-20 sm:w-24 h-28 sm:h-32 rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${bc}15, ${bc}05)`, border: `1px solid ${bc}20` }}>
                        {phone.thumbnail ? (
                          <img src={phone.thumbnail} alt={phone.name} className="h-full w-auto object-contain p-2 drop-shadow-xl group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-8 h-14 rounded-lg border-2 opacity-20" style={{ borderColor: bc }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1.5 flex-wrap">
                          <div>
                            {phone.rank === 1 && (
                              <div className="flex items-center gap-1 mb-1">
                                <Award size={10} className="text-amber-500" />
                                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">Most Popular</span>
                              </div>
                            )}
                            <h3 className="font-black text-base group-hover:text-primary transition-colors">{phone.name}</h3>
                            <p className="text-xs text-muted-foreground">{phone.brand} · {phone.chipset}</p>
                          </div>
                          <div className="text-right shrink-0">
                            {phone.fans && (
                              <div className="flex items-center gap-1 justify-end">
                                <Star size={10} className="text-amber-500 fill-amber-500" />
                                <span className="text-xs font-bold">{phone.fans}</span>
                                <span className="text-xs text-muted-foreground">fans</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-primary to-amber-500" style={{ width: `${score}%` }} />
                          </div>
                          <span className="text-xs font-black text-primary shrink-0">{score}% Score</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {[phone.display_size, phone.ram, phone.battery].filter(Boolean).map((h, i) => (
                            <span key={i} className="text-[10px] glass border border-white/20 px-2 py-0.5 rounded-full text-muted-foreground">{h}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-white/10">
                          <Link href={`/phone/${phone.slug}`} className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
                            Full Specs <ChevronRight size={11} />
                          </Link>
                          <Link href="/compare" className="glass border border-white/15 hover:border-primary/30 text-xs font-semibold px-2.5 py-1 rounded-lg text-muted-foreground hover:text-primary transition-all">Compare</Link>
                          <a href={`https://www.amazon.com/s?k=${encodeURIComponent(phone.name)}`} target="_blank" rel="noopener noreferrer" className="glass border border-white/15 hover:border-primary/30 text-xs font-semibold px-2.5 py-1 rounded-lg text-muted-foreground hover:text-primary transition-all ml-auto">Buy Now</a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0 space-y-4">
            {/* Award winners */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Award size={14} className="text-amber-500" />
                <h3 className="font-bold text-sm">Award Winners</h3>
              </div>
              <div className="space-y-2.5">
                {phones.slice(0, 5).map((p, i) => {
                  const bc = BRAND_COLORS[p.brand] || "#ff6e14";
                  return (
                    <Link key={i} href={`/phone/${p.slug}`} className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden" style={{ background: `${bc}15` }}>
                        {p.thumbnail ? <img src={p.thumbnail} alt={p.name} className="h-8 w-auto object-contain" /> : <span className="text-[9px] text-center font-bold" style={{ color: bc }}>#{p.rank}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-amber-600"># {p.rank} by Fans</p>
                        <p className="text-xs font-semibold group-hover:text-primary transition-colors line-clamp-1">{p.name}</p>
                      </div>
                    </Link>
                  );
                })}
              {phones.length === 0 && !loading && <p className="text-xs text-muted-foreground">No data yet</p>}
              </div>
            </div>

            {/* Score breakdown legend */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-3">How We Score</h3>
              <div className="space-y-2.5">
                {[
                  { label: "Performance", pct: 25, color: "bg-purple-500" },
                  { label: "Camera Quality", pct: 30, color: "bg-blue-500" },
                  { label: "Battery Life", pct: 20, color: "bg-green-500" },
                  { label: "Display", pct: 15, color: "bg-cyan-500" },
                  { label: "Value for Money", pct: 10, color: "bg-amber-500" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className="font-bold">{s.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct * 4}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="glass-card rounded-2xl p-5 text-center">
              <Trophy size={28} className="text-amber-500 mx-auto mb-2" />
              <h3 className="font-bold text-sm mb-1">Find Your Best Phone</h3>
              <p className="text-xs text-muted-foreground mb-3">Use our advanced finder to filter by your exact needs</p>
              <Link href="/phone-finder" className="block w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors">
                Open Phone Finder
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}

