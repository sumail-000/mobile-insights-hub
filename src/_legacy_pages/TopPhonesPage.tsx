import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Trophy, Star, ChevronRight, Camera, Battery,
  Cpu, Monitor, Zap, Crown, Award, Gamepad2,
  ScanFace, DollarSign, Shield, Wifi
} from "lucide-react";
import samsungImg from "@/assets/phones/samsung-s25-ultra.png";
import iphoneImg from "@/assets/phones/iphone-16-pro-max.png";
import oneplusImg from "@/assets/phones/oneplus-13.png";
import xiaomiImg from "@/assets/phones/xiaomi-15-ultra.png";
import googleImg from "@/assets/phones/google-pixel-9-pro.png";
import motorolaImg from "@/assets/phones/motorola-edge-50.png";
import realmeImg from "@/assets/phones/realme-p4.png";
import vivoImg from "@/assets/phones/vivo-x200.png";

interface TopPhone {
  rank: number;
  id: string;
  name: string;
  brand: string;
  brandColor: string;
  bgColor: string;
  price: string;
  score: number;
  userRating: number;
  ratingCount: string;
  expertRating: number;
  image: string;
  award?: string;
  chipset: string;
  ram: string;
  camera: string;
  battery: string;
  display: string;
  highlights: string[];
  verdict: string;
}

const top10Overall: TopPhone[] = [
  {
    rank: 1, id: "xiaomi-15-ultra", name: "Xiaomi 15 Ultra", brand: "Xiaomi", brandColor: "#FF6900", bgColor: "#f8f3f0",
    price: "$1,099", score: 98, userRating: 4.8, ratingCount: "14.2K", expertRating: 9.6,
    image: xiaomiImg, award: "Editor's Choice 2025",
    chipset: "Snapdragon 8 Elite", ram: "16 GB", camera: "200 MP Leica Triple", battery: "6500 mAh | 90W", display: "6.85\" LTPO AMOLED 120Hz",
    highlights: ["Best camera system on any phone", "90W wireless + 10W reverse wireless", "Leica co-engineered optics", "8K video recording"],
    verdict: "The Xiaomi 15 Ultra is simply the best all-around smartphone money can buy right now. Its Leica camera system is in a league of its own."
  },
  {
    rank: 2, id: "samsung-galaxy-s25-ultra", name: "Samsung Galaxy S25 Ultra", brand: "Samsung", brandColor: "#1428A0", bgColor: "#f0f4f8",
    price: "$1,299", score: 97, userRating: 4.7, ratingCount: "31.5K", expertRating: 9.4,
    image: samsungImg, award: "Best Android 2025",
    chipset: "Snapdragon 8 Elite", ram: "12 GB", camera: "200 MP Quad Camera", battery: "5000 mAh | 45W", display: "6.9\" AMOLED 120Hz",
    highlights: ["Built-in S Pen for productivity", "200MP periscope zoom camera", "Galaxy AI Suite", "Titanium frame"],
    verdict: "Samsung's most complete phone ever. The S25 Ultra is the gold standard for Android productivity with its S Pen and AI features."
  },
  {
    rank: 3, id: "iphone-16-pro-max", name: "iPhone 16 Pro Max", brand: "Apple", brandColor: "#555555", bgColor: "#f5f5f5",
    price: "$1,199", score: 96, userRating: 4.8, ratingCount: "28.9K", expertRating: 9.3,
    image: iphoneImg, award: "Best iOS Phone",
    chipset: "Apple A18 Pro", ram: "8 GB", camera: "48 MP Triple Camera", battery: "4685 mAh | 27W", display: "6.9\" Super Retina XDR 120Hz",
    highlights: ["A18 Pro — fastest mobile chip", "4K@120fps ProRes video", "Apple Intelligence AI features", "7 years of OS updates"],
    verdict: "The iPhone 16 Pro Max remains the definitive iOS experience. No Android phone matches Apple's software longevity and ecosystem."
  },
  {
    rank: 4, id: "google-pixel-9-pro", name: "Google Pixel 9 Pro", brand: "Google", brandColor: "#4285F4", bgColor: "#f0f4ff",
    price: "$999", score: 95, userRating: 4.6, ratingCount: "9.4K", expertRating: 9.1,
    image: googleImg, award: "Best AI Phone",
    chipset: "Google Tensor G4", ram: "16 GB", camera: "50 MP + 48 MP + 48 MP", battery: "4700 mAh | 45W", display: "6.3\" LTPO OLED 120Hz",
    highlights: ["Gemini AI built-in", "Circle to Search", "8K@30fps video", "7 years guaranteed updates"],
    verdict: "Google's AI features are unmatched. The Pixel 9 Pro is the best choice for anyone who wants cutting-edge AI photography and assistant features."
  },
  {
    rank: 5, id: "oneplus-13", name: "OnePlus 13", brand: "OnePlus", brandColor: "#F5010C", bgColor: "#fff0f0",
    price: "$799", score: 94, userRating: 4.6, ratingCount: "7.8K", expertRating: 9.0,
    image: oneplusImg, award: "Best Value Flagship",
    chipset: "Snapdragon 8 Elite", ram: "12 GB", camera: "50 MP Hasselblad Triple", battery: "6000 mAh | 100W", display: "6.82\" LTPO AMOLED 120Hz",
    highlights: ["100W wired + 50W wireless charging", "Hasselblad color science", "6000mAh battery", "Alert Slider"],
    verdict: "The OnePlus 13 is the best value flagship on the market. You get flagship specs at $400 less than the competition."
  },
  {
    rank: 6, id: "vivo-x200", name: "Vivo X200 Pro", brand: "Vivo", brandColor: "#415FFF", bgColor: "#f0f0ff",
    price: "$849", score: 94, userRating: 4.6, ratingCount: "4.2K", expertRating: 8.9,
    image: vivoImg, award: "Best Zeiss Camera",
    chipset: "MediaTek Dimensity 9400", ram: "16 GB", camera: "200 MP Zeiss Triple", battery: "6000 mAh | 90W", display: "6.82\" LTPO AMOLED 120Hz",
    highlights: ["IP69 water resistance", "Zeiss T* coated lenses", "120W FlashCharge", "Ultrasonic fingerprint"],
    verdict: "Vivo's partnership with Zeiss produces stunning images. The X200 Pro is the dark horse flagship that deserves far more attention."
  },
  {
    rank: 7, id: "samsung-galaxy-s25-ultra", name: "Motorola Edge 50 Pro", brand: "Motorola", brandColor: "#5C8EE6", bgColor: "#f0f4ff",
    price: "$549", score: 91, userRating: 4.4, ratingCount: "3.1K", expertRating: 8.6,
    image: motorolaImg, award: "Best Mid-Range 2025",
    chipset: "Snapdragon 7 Gen 4", ram: "12 GB", camera: "50 MP + 13 MP", battery: "5000 mAh | 68W", display: "6.7\" pOLED 144Hz",
    highlights: ["144Hz pOLED display", "68W TurboPower charging", "Near-stock Android", "IP68 rated"],
    verdict: "The best mid-range phone of 2025. The Edge 50 Pro delivers flagship-class display and charging at a fraction of the price."
  },
  {
    rank: 8, id: "realme-p4", name: "Realme P4", brand: "Realme", brandColor: "#FFD600", bgColor: "#fff8f0",
    price: "$299", score: 87, userRating: 4.3, ratingCount: "11.6K", expertRating: 8.2,
    image: realmeImg, award: "Best Under $300",
    chipset: "Snapdragon 7s Gen 3", ram: "8 GB", camera: "50 MP + 8 MP", battery: "5200 mAh | 67W", display: "6.7\" AMOLED 120Hz",
    highlights: ["AMOLED under $300", "67W fast charging", "5200mAh large battery", "Lightweight 190g"],
    verdict: "At $299, the Realme P4 is a steal. AMOLED display, fast charging, and capable cameras at a price that destroys the competition."
  },
  {
    rank: 9, id: "google-pixel-9-pro", name: "Google Pixel 9a", brand: "Google", brandColor: "#4285F4", bgColor: "#f0f4ff",
    price: "$499", score: 87, userRating: 4.4, ratingCount: "6.3K", expertRating: 8.4,
    image: googleImg, award: "Best Mid-Range AI",
    chipset: "Google Tensor G4", ram: "8 GB", camera: "48 MP + 13 MP", battery: "5100 mAh | 18W", display: "6.1\" OLED 120Hz",
    highlights: ["Tensor G4 AI processing", "Guaranteed 7-year updates", "Pure Android experience", "IP67 rated"],
    verdict: "The Pixel 9a brings Google's best AI features to a $499 price point. It's the most future-proof mid-range phone available."
  },
  {
    rank: 10, id: "oneplus-13", name: "OnePlus Nord 5", brand: "OnePlus", brandColor: "#F5010C", bgColor: "#fff0f0",
    price: "$399", score: 85, userRating: 4.3, ratingCount: "5.1K", expertRating: 8.1,
    image: oneplusImg, award: "Best Budget 5G",
    chipset: "Snapdragon 7 Gen 3", ram: "8 GB", camera: "50 MP + 8 MP", battery: "5500 mAh | 80W", display: "6.74\" AMOLED 120Hz",
    highlights: ["80W SuperVOOC charging", "Clean OxygenOS", "5500mAh all-day battery", "5G ready"],
    verdict: "The Nord 5 is the best budget OnePlus has ever made. 80W charging and 5G connectivity at just $399 makes this a no-brainer."
  },
];

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

            <div className="space-y-3">
              {top10Overall.map(phone => (
                <div
                  key={phone.id + phone.rank}
                  className={`glass-card rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 group ${phone.rank === 1 ? "ring-2 ring-amber-400/40" : ""}`}
                >
                  {phone.rank <= 3 && (
                    <div className="h-0.5 w-full" style={{ background: phone.rank === 1 ? "linear-gradient(90deg, #f59e0b, #d97706, transparent)" : phone.rank === 2 ? "linear-gradient(90deg, #94a3b8, #64748b, transparent)" : "linear-gradient(90deg, #b45309, #92400e, transparent)" }} />
                  )}
                  <div className="p-4 sm:p-5 flex gap-4">
                    {/* Rank */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <RankBadge rank={phone.rank} />
                    </div>

                    {/* Image */}
                    <div
                      className="w-20 sm:w-24 h-28 sm:h-32 rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${phone.brandColor}15, ${phone.brandColor}05)`, border: `1px solid ${phone.brandColor}20` }}
                    >
                      <img src={phone.image} alt={phone.name} className="h-full w-auto object-contain p-2 drop-shadow-xl group-hover:scale-105 transition-transform duration-500" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1.5 flex-wrap">
                        <div>
                          {phone.award && (
                            <div className="flex items-center gap-1 mb-1">
                              <Award size={10} className="text-amber-500" />
                              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">{phone.award}</span>
                            </div>
                          )}
                          <h3 className="font-black text-base group-hover:text-primary transition-colors">{phone.name}</h3>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-black text-lg" style={{ color: phone.brandColor }}>{phone.price}</p>
                          <div className="flex items-center gap-1 justify-end">
                            <Star size={10} className="text-amber-500 fill-amber-500" />
                            <span className="text-xs font-bold">{phone.userRating}</span>
                            <span className="text-xs text-muted-foreground">({phone.ratingCount})</span>
                          </div>
                        </div>
                      </div>

                      {/* Score bar */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-amber-500"
                            style={{ width: `${phone.score}%` }}
                          />
                        </div>
                        <span className="text-xs font-black text-primary shrink-0">{phone.score}% Score</span>
                      </div>

                      {/* Highlights */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {phone.highlights.slice(0, 3).map((h, i) => (
                          <span key={i} className="text-[10px] glass border border-white/20 px-2 py-0.5 rounded-full text-muted-foreground">{h}</span>
                        ))}
                      </div>

                      {/* Verdict snippet */}
                      <p className="text-[11px] text-muted-foreground line-clamp-1 italic">"{phone.verdict}"</p>

                      {/* Action row */}
                      <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-white/10">
                        <Link to={`/phone/${phone.id}`} className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
                          Full Review <ChevronRight size={11} />
                        </Link>
                        <Link to="/compare" className="glass border border-white/15 hover:border-primary/30 text-xs font-semibold px-2.5 py-1 rounded-lg text-muted-foreground hover:text-primary transition-all">
                          Compare
                        </Link>
                        <a href={`https://www.amazon.com/s?k=${encodeURIComponent(phone.name)}`} target="_blank" rel="noopener noreferrer" className="glass border border-white/15 hover:border-primary/30 text-xs font-semibold px-2.5 py-1 rounded-lg text-muted-foreground hover:text-primary transition-all ml-auto">
                          Buy Now
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                {top10Overall.filter(p => p.award).slice(0, 6).map((p, i) => (
                  <Link key={i} to={`/phone/${p.id}`} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden" style={{ background: `${p.brandColor}15` }}>
                      <img src={p.image} alt={p.name} className="h-8 w-auto object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-amber-600">{p.award}</p>
                      <p className="text-xs font-semibold group-hover:text-primary transition-colors line-clamp-1">{p.name}</p>
                    </div>
                  </Link>
                ))}
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
              <Link to="/phone-finder" className="block w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors">
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
