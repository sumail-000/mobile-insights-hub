"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Trophy, Camera, Gamepad2, ScanFace } from "lucide-react";
import Link from "next/link";
import { getDevices } from "@/lib/api";

type TopItem = { rank: number; name: string; slug: string; value: string };
type CompItem = { phone1: string; slug1: string; img1: string; phone2: string; slug2: string; img2: string; bg1: string; bg2: string };

const bestOfItems = [
  { label: "Best Mobiles", Icon: Trophy, gradient: "from-orange-400/20 to-yellow-300/20", iconColor: "text-orange-500" },
  { label: "Best Camera", Icon: Camera, gradient: "from-blue-400/20 to-sky-300/20", iconColor: "text-blue-500" },
  { label: "Best Gaming", Icon: Gamepad2, gradient: "from-purple-400/20 to-indigo-300/20", iconColor: "text-purple-500" },
  { label: "Best Selfie", Icon: ScanFace, gradient: "from-pink-400/20 to-rose-300/20", iconColor: "text-pink-500" },
];

function TopList({ title, items, valueLabel, headerColor }: { title: string; items: TopItem[]; valueLabel: string; headerColor: string }) {
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="px-4 py-3 font-bold text-sm uppercase tracking-wide" style={{ backgroundColor: headerColor, color: "white" }}>
        {title}
      </div>
      <div className="divide-y divide-border/50">
        <div className="flex px-3 py-1.5 text-xs font-semibold text-muted-foreground bg-white/40 backdrop-blur-sm">
          <span className="w-6">#</span>
          <span className="flex-1">Device</span>
          <span>{valueLabel}</span>
        </div>
        {items.map((item, i) => (
          <Link key={i} href={`/phone/${item.slug}`} className={`flex items-center px-3 py-2 text-xs hover:bg-primary/5 transition-colors ${i % 2 === 0 ? "bg-white/30" : "bg-white/10"}`}>
            <span className="w-6 font-semibold text-muted-foreground">{item.rank}.</span>
            <span className="flex-1 font-medium hover:text-primary transition-colors">{item.name}</span>
            <span className="text-muted-foreground">{item.value}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function TopPhonesSection() {
  const [topByFans, setTopByFans] = useState<TopItem[]>([]);
  const [topByNewest, setTopByNewest] = useState<TopItem[]>([]);
  const [comparisons, setComparisons] = useState<CompItem[]>([]);

  useEffect(() => {
    getDevices({ sort: "fans", limit: 10 }).then(res => {
      setTopByFans(res.devices.map((d, i) => ({
        rank: i + 1,
        name: d.name,
        slug: d.slug,
        value: d.fans ? String(d.fans) : "-",
      })));
      if (res.devices.length >= 4) {
        const picks = res.devices.slice(0, 4);
        setComparisons([
          { phone1: picks[0].name, slug1: picks[0].slug, img1: picks[0].thumbnail, bg1: "#f0f4f8", phone2: picks[1].name, slug2: picks[1].slug, img2: picks[1].thumbnail, bg2: "#f5f5f5" },
          { phone1: picks[2].name, slug1: picks[2].slug, img1: picks[2].thumbnail, bg1: "#fff0f0", phone2: picks[3].name, slug2: picks[3].slug, img2: picks[3].thumbnail, bg2: "#f8f3f0" },
        ]);
      }
    }).catch(() => {});

    getDevices({ sort: "newest", limit: 10 }).then(res => {
      setTopByNewest(res.devices.map((d, i) => ({
        rank: i + 1,
        name: d.name,
        slug: d.slug,
        value: d.brand,
      })));
    }).catch(() => {});
  }, []);

  return (
    <section className="px-4 py-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top by newest */}
        <TopList
          title="Top 10 Latest Devices"
          items={topByNewest}
          valueLabel="Brand"
          headerColor="#4a7c59"
        />

        {/* Top by fans */}
        <TopList
          title="Top 10 by Fans"
          items={topByFans}
          valueLabel="Fans"
          headerColor="#3a5a8c"
        />

        {/* Popular comparisons + Best of */}
        <div className="space-y-4">
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wide">Popular Comparisons</h3>
              <Link href="/compare" className="text-primary text-xs font-semibold hover:underline">Compare More</Link>
            </div>
            <div className="space-y-2">
              {comparisons.map((comp, i) => (
                <Link key={i} href="/compare" className="flex items-center gap-2 p-2 rounded-lg border border-white/60 bg-white/40 backdrop-blur-sm hover:border-primary/30 hover:bg-primary/5 transition-all group">
                  <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                    <div className="w-10 h-14 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-white/60" style={{ backgroundColor: comp.bg1 }}>
                      {comp.img1 ? <img src={comp.img1} alt={comp.phone1} className="h-12 w-auto object-contain drop-shadow" /> : <span className="text-[9px] text-center px-1">{comp.phone1.slice(0,8)}</span>}
                    </div>
                    <span className="text-[10px] font-medium text-center leading-tight line-clamp-2">{comp.phone1}</span>
                  </div>
                  <div className="bg-foreground text-background text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shrink-0">VS</div>
                  <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                    <div className="w-10 h-14 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-white/60" style={{ backgroundColor: comp.bg2 }}>
                      {comp.img2 ? <img src={comp.img2} alt={comp.phone2} className="h-12 w-auto object-contain drop-shadow" /> : <span className="text-[9px] text-center px-1">{comp.phone2.slice(0,8)}</span>}
                    </div>
                    <span className="text-[10px] font-medium text-center leading-tight line-clamp-2">{comp.phone2}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Best of Mobiles */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="text-sm font-bold mb-3">Best of Mobiles</h3>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {bestOfItems.map((item, i) => (
                <Link key={i} href="/phone-finder" className={`bg-gradient-to-br ${item.gradient} backdrop-blur-sm rounded-lg p-2.5 flex items-center gap-2 border border-white/50 hover:border-primary/30 transition-colors group`}>
                  <item.Icon size={16} className={`${item.iconColor} shrink-0`} />
                  <span className="text-xs font-semibold group-hover:text-primary transition-colors">{item.label}</span>
                </Link>
              ))}
            </div>
            <div className="space-y-1">
              {["Under $200", "Under $400", "Under $600", "Under $800"].map((p, i) => (
                <Link key={i} href="/phone-finder" className="flex items-center justify-between text-xs text-muted-foreground hover:text-primary px-1 py-0.5 rounded hover:bg-primary/5 transition-colors">
                  <span>Best Phones {p}</span>
                  <ChevronRight size={10} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
