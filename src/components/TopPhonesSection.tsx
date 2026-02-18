import { ChevronRight, Smartphone, Trophy, Camera, Gamepad2, ScanFace } from "lucide-react";

const topByInterest = [
  { rank: 1, name: "Samsung Galaxy S26 Ultra", hits: "29,495" },
  { rank: 2, name: "Apple iPhone 17e", hits: "20,532" },
  { rank: 3, name: "Tecno Camon 50 Pro 4G", hits: "19,706" },
  { rank: 4, name: "Samsung Galaxy A56", hits: "17,268" },
  { rank: 5, name: "Samsung Galaxy S25 Ultra", hits: "15,675" },
  { rank: 6, name: "Apple iPhone 17 Pro Max", hits: "14,920" },
  { rank: 7, name: "Samsung Galaxy A17", hits: "13,125" },
  { rank: 8, name: "Infinix GT 50 Pro", hits: "12,393" },
  { rank: 9, name: "Xiaomi Redmi Turbo 5 Max", hits: "12,361" },
  { rank: 10, name: "Xiaomi Redmi Note 15 Pro", hits: "12,320" },
];

const topByFans = [
  { rank: 1, name: "Samsung Galaxy S25 Ultra", count: "1,352" },
  { rank: 2, name: "OnePlus 13", count: "786" },
  { rank: 3, name: "Xiaomi 15 Ultra", count: "664" },
  { rank: 4, name: "Samsung Galaxy A56", count: "662" },
  { rank: 5, name: "Xiaomi Poco X7 Pro", count: "624" },
  { rank: 6, name: "Xiaomi 17 Pro Max", count: "584" },
  { rank: 7, name: "vivo X200 Pro", count: "582" },
  { rank: 8, name: "Samsung Galaxy S25", count: "523" },
  { rank: 9, name: "OnePlus 15", count: "480" },
  { rank: 10, name: "Xiaomi 15", count: "470" },
];

const popularComparisons = [
  { phone1: "Samsung Galaxy S25 Ultra", phone2: "Samsung Galaxy S26 Ultra" },
  { phone1: "Samsung Galaxy S25 Ultra", phone2: "Apple iPhone 17 Pro..." },
  { phone1: "Samsung Galaxy S24 Ultra", phone2: "Samsung Galaxy S25 Ultra" },
];

const bestOfItems = [
  { label: "Best Mobiles", Icon: Trophy, gradient: "from-orange-400/20 to-yellow-300/20", iconColor: "text-orange-500" },
  { label: "Best Camera", Icon: Camera, gradient: "from-blue-400/20 to-sky-300/20", iconColor: "text-blue-500" },
  { label: "Best Gaming", Icon: Gamepad2, gradient: "from-purple-400/20 to-indigo-300/20", iconColor: "text-purple-500" },
  { label: "Best Selfie", Icon: ScanFace, gradient: "from-pink-400/20 to-rose-300/20", iconColor: "text-pink-500" },
];

function TopList({ title, items, valueLabel, headerColor }: { title: string; items: { rank: number; name: string; [key: string]: any }[]; valueLabel: string; headerColor: string }) {
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
        {items.map((item, i) => {
          const value = item.hits || item.count;
          return (
            <a key={i} href="#" className={`flex items-center px-3 py-2 text-xs hover:bg-primary/5 transition-colors ${i % 2 === 0 ? "bg-white/30" : "bg-white/10"}`}>
              <span className="w-6 font-semibold text-muted-foreground">{item.rank}.</span>
              <span className="flex-1 font-medium hover:text-primary transition-colors">{item.name}</span>
              <span className="text-muted-foreground">{value}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default function TopPhonesSection() {
  return (
    <section className="max-w-screen-xl mx-auto px-4 py-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top by interest */}
        <TopList
          title="Top 10 by Daily Interest"
          items={topByInterest}
          valueLabel="Daily hits"
          headerColor="#4a7c59"
        />

        {/* Top by fans */}
        <TopList
          title="Top 10 by Fans"
          items={topByFans}
          valueLabel="Favorites"
          headerColor="#3a5a8c"
        />

        {/* Popular comparisons + Best of */}
        <div className="space-y-4">
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wide">Popular Comparisons</h3>
              <a href="#" className="text-primary text-xs font-semibold hover:underline">Compare More</a>
            </div>
            <div className="space-y-2">
              {popularComparisons.map((comp, i) => (
                <a key={i} href="#" className="flex items-center gap-2 p-2 rounded-lg border border-white/60 bg-white/40 backdrop-blur-sm hover:border-primary/30 hover:bg-primary/5 transition-all group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-12 rounded bg-white/60 border border-border/50 flex items-center justify-center shrink-0">
                        <Smartphone size={14} className="text-primary" />
                      </div>
                      <span className="text-xs font-medium truncate">{comp.phone1}</span>
                    </div>
                  </div>
                  <div className="bg-foreground text-background text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0">VS</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-12 rounded bg-white/60 border border-border/50 flex items-center justify-center shrink-0">
                        <Smartphone size={14} className="text-primary" />
                      </div>
                      <span className="text-xs font-medium truncate">{comp.phone2}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Best of Mobiles */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="text-sm font-bold mb-3">Best of Mobiles</h3>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {bestOfItems.map((item, i) => (
                <a key={i} href="#" className={`bg-gradient-to-br ${item.gradient} backdrop-blur-sm rounded-lg p-2.5 flex items-center gap-2 border border-white/50 hover:border-primary/30 transition-colors group`}>
                  <item.Icon size={16} className={`${item.iconColor} shrink-0`} />
                  <span className="text-xs font-semibold group-hover:text-primary transition-colors">{item.label}</span>
                </a>
              ))}
            </div>
            <div className="space-y-1">
              {["Under $200", "Under $400", "Under $600", "Under $800"].map((p, i) => (
                <a key={i} href="#" className="flex items-center justify-between text-xs text-muted-foreground hover:text-primary px-1 py-0.5 rounded hover:bg-primary/5 transition-colors">
                  <span>Best Phones {p}</span>
                  <ChevronRight size={10} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
