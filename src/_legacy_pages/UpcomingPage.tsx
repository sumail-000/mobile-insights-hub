import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Clock, ChevronRight, Bell, Calendar, Search, X,
  Cpu, Camera, Battery, Monitor, MemoryStick, Star,
  Smartphone, Zap, Filter, Globe
} from "lucide-react";
import samsungImg from "@/assets/phones/samsung-s25-ultra.png";
import iphoneImg from "@/assets/phones/iphone-16-pro-max.png";
import oneplusImg from "@/assets/phones/oneplus-13.png";
import xiaomiImg from "@/assets/phones/xiaomi-15-ultra.png";
import googleImg from "@/assets/phones/google-pixel-9-pro.png";
import motorolaImg from "@/assets/phones/motorola-edge-50.png";
import vivoImg from "@/assets/phones/vivo-x200.png";

interface UpcomingPhone {
  id: string;
  name: string;
  brand: string;
  brandColor: string;
  bgColor: string;
  expectedPrice: string;
  launchQuarter: string;
  launchDate: string;
  status: "Confirmed" | "Rumored" | "Official";
  image?: string;
  expectedSpecs: {
    chipset: string;
    ram: string;
    camera: string;
    battery: string;
    display: string;
  };
  hype: number;
  followers: string;
  description: string;
}

const upcomingPhones: UpcomingPhone[] = [
  {
    id: "samsung-galaxy-s26-ultra",
    name: "Samsung Galaxy S26 Ultra",
    brand: "Samsung",
    brandColor: "#1428A0",
    bgColor: "#f0f4f8",
    expectedPrice: "$1,299+",
    launchQuarter: "Q1 2026",
    launchDate: "January 2026",
    status: "Rumored",
    image: samsungImg,
    expectedSpecs: {
      chipset: "Snapdragon 8 Gen 4",
      ram: "16 GB",
      camera: "200 MP + 50 MP + 50 MP",
      battery: "5500 mAh | 100W",
      display: "6.9\" AMOLED 120Hz",
    },
    hype: 98,
    followers: "128K",
    description: "Samsung's next-gen Ultra flagship is expected to feature a revolutionary variable-aperture 200MP main camera, built-in S Pen, and the most powerful Snapdragon ever shipped.",
  },
  {
    id: "apple-iphone-17-pro-max",
    name: "Apple iPhone 17 Pro Max",
    brand: "Apple",
    brandColor: "#555555",
    bgColor: "#f5f5f5",
    expectedPrice: "$1,299+",
    launchQuarter: "Q3 2025",
    launchDate: "September 2025",
    status: "Confirmed",
    image: iphoneImg,
    expectedSpecs: {
      chipset: "Apple A19 Pro",
      ram: "12 GB",
      camera: "48 MP + 48 MP + 12 MP",
      battery: "4900 mAh | 30W",
      display: "6.9\" Super Retina XDR 120Hz",
    },
    hype: 99,
    followers: "201K",
    description: "Apple Intelligence takes center stage with the A19 Pro chip delivering unprecedented on-device AI. The titanium chassis gets thinner while battery life takes a massive leap.",
  },
  {
    id: "xiaomi-17-pro-max",
    name: "Xiaomi 17 Pro Max",
    brand: "Xiaomi",
    brandColor: "#FF6900",
    bgColor: "#f8f3f0",
    expectedPrice: "$1,099+",
    launchQuarter: "Q2 2026",
    launchDate: "March 2026",
    status: "Rumored",
    image: xiaomiImg,
    expectedSpecs: {
      chipset: "Snapdragon 8 Elite 2",
      ram: "16 GB",
      camera: "200 MP + 50 MP + 50 MP (Leica)",
      battery: "6500 mAh | 120W HyperCharge",
      display: "6.85\" LTPO AMOLED 144Hz",
    },
    hype: 91,
    followers: "67K",
    description: "Xiaomi's most ambitious device yet pairs Leica co-engineered optics with the world's fastest wireless charging. Leaked benchmarks show a 40% CPU uplift over the 15 Ultra.",
  },
  {
    id: "oneplus-15r",
    name: "OnePlus 15R",
    brand: "OnePlus",
    brandColor: "#F5010C",
    bgColor: "#fff0f0",
    expectedPrice: "$599+",
    launchQuarter: "Q2 2026",
    launchDate: "April 2026",
    status: "Rumored",
    image: oneplusImg,
    expectedSpecs: {
      chipset: "Snapdragon 8s Gen 4",
      ram: "12 GB",
      camera: "50 MP + 50 MP + 16 MP",
      battery: "6000 mAh | 100W SuperVOOC",
      display: "6.78\" AMOLED 120Hz",
    },
    hype: 83,
    followers: "34K",
    description: "The mid-range powerhouse returns with Hasselblad-tuned cameras, 100W fast charging at an accessible price point, and OnePlus's signature smooth OxygenOS experience.",
  },
  {
    id: "google-pixel-10-pro",
    name: "Google Pixel 10 Pro",
    brand: "Google",
    brandColor: "#4285F4",
    bgColor: "#f0f4ff",
    expectedPrice: "$999+",
    launchQuarter: "Q4 2025",
    launchDate: "October 2025",
    status: "Confirmed",
    image: googleImg,
    expectedSpecs: {
      chipset: "Google Tensor G5",
      ram: "16 GB",
      camera: "50 MP + 48 MP + 48 MP",
      battery: "5100 mAh | 45W",
      display: "6.3\" LTPO OLED 120Hz",
    },
    hype: 87,
    followers: "52K",
    description: "Google's Tensor G5 brings massive AI processing gains with 7 years of OS updates guaranteed. The Pixel 10 Pro is expected to debut with real-time translation and Gemini Live on-device.",
  },
  {
    id: "vivo-x300-pro",
    name: "Vivo X300 Pro",
    brand: "Vivo",
    brandColor: "#415FFF",
    bgColor: "#f0f0ff",
    expectedPrice: "$899+",
    launchQuarter: "Q1 2026",
    launchDate: "February 2026",
    status: "Rumored",
    image: vivoImg,
    expectedSpecs: {
      chipset: "MediaTek Dimensity 9500",
      ram: "16 GB",
      camera: "200 MP + 50 MP + 50 MP (Zeiss)",
      battery: "6500 mAh | 120W",
      display: "6.82\" LTPO AMOLED 120Hz",
    },
    hype: 79,
    followers: "28K",
    description: "Zeiss optics meet the Dimensity 9500 in Vivo's next flagship. IP69 rating, the world's fastest ultrasonic fingerprint scanner, and a 6500mAh battery round out an impressive package.",
  },
  {
    id: "motorola-razr-60-ultra",
    name: "Motorola Razr 60 Ultra",
    brand: "Motorola",
    brandColor: "#5C8EE6",
    bgColor: "#f0f4ff",
    expectedPrice: "$999+",
    launchQuarter: "Q2 2026",
    launchDate: "May 2026",
    status: "Rumored",
    image: motorolaImg,
    expectedSpecs: {
      chipset: "Snapdragon 8 Gen 4",
      ram: "12 GB",
      camera: "50 MP + 50 MP",
      battery: "4500 mAh | 68W",
      display: "6.9\" pOLED Foldable 165Hz",
    },
    hype: 76,
    followers: "19K",
    description: "The iconic Razr flip form-factor gets a serious spec upgrade. Snapdragon 8 Gen 4, a massive 4-inch cover display, and the slimmest foldable profile in its class.",
  },
  {
    id: "oneplus-open-2",
    name: "OnePlus Open 2",
    brand: "OnePlus",
    brandColor: "#F5010C",
    bgColor: "#fff0f0",
    expectedPrice: "$1,599+",
    launchQuarter: "Q3 2026",
    launchDate: "August 2026",
    status: "Rumored",
    image: oneplusImg,
    expectedSpecs: {
      chipset: "Snapdragon 8 Elite 2",
      ram: "16 GB",
      camera: "50 MP + 64 MP + 48 MP (Hasselblad)",
      battery: "5000 mAh | 100W SuperVOOC",
      display: "7.8\" Foldable AMOLED 120Hz",
    },
    hype: 88,
    followers: "44K",
    description: "OnePlus's second foldable takes aim at the Galaxy Z Fold with Hasselblad triple cameras, the thinnest book-style foldable chassis, and 100W charging — a first for foldables.",
  },
];

const statusColors: Record<string, string> = {
  Confirmed: "bg-green-600",
  Rumored: "bg-purple-600",
  Official: "bg-primary",
};

const quarters = ["All", "Q1 2026", "Q2 2026", "Q3 2026", "Q4 2025", "Q3 2025"];
const brands = ["All", "Samsung", "Apple", "Xiaomi", "OnePlus", "Google", "Vivo", "Motorola"];

export default function UpcomingPage() {
  const [activeQuarter, setActiveQuarter] = useState("All");
  const [activeBrand, setActiveBrand] = useState("All");
  const [search, setSearch] = useState("");
  const [notified, setNotified] = useState<string[]>([]);

  const filtered = upcomingPhones.filter(p => {
    const matchQ = activeQuarter === "All" || p.launchQuarter === activeQuarter;
    const matchB = activeBrand === "All" || p.brand === activeBrand;
    const matchS = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    return matchQ && matchB && matchS;
  });

  const toggleNotify = (id: string) => {
    setNotified(prev => prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]);
  };

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
              <span className="text-white text-xs font-semibold">{upcomingPhones.length} Upcoming Phones</span>
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
            <button
              key={q}
              onClick={() => setActiveQuarter(q)}
              className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-all shrink-0 font-medium border ${
                activeQuarter === q ? "bg-primary text-white border-primary" : "border-white/20 text-white/70 hover:border-primary/50 hover:text-white"
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Brand filter + search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <Filter size={13} className="text-muted-foreground shrink-0" />
            {brands.map(b => (
              <button
                key={b}
                onClick={() => setActiveBrand(b)}
                className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-medium border transition-all shrink-0 ${
                  activeBrand === b ? "border-primary bg-primary/10 text-primary" : "border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
          <div className="relative shrink-0 sm:ml-auto">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search phones..."
              className="glass-card pl-9 pr-4 py-2 text-xs rounded-xl border-0 focus:outline-none focus:ring-1 focus:ring-primary/40 w-52"
            />
            {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X size={12} /></button>}
          </div>
        </div>

        {/* Results */}
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
          ) : filtered.map(phone => (
            <div
              key={phone.id}
              className="glass-card rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${phone.brandColor}50, ${phone.brandColor}20, transparent)` }} />
              <div className="p-4 sm:p-5 flex gap-4 sm:gap-6">
                {/* Image */}
                <div
                  className="w-28 sm:w-36 h-40 sm:h-48 rounded-2xl flex items-center justify-center shrink-0 relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${phone.brandColor}15, ${phone.brandColor}05)`, border: `1px solid ${phone.brandColor}25` }}
                >
                  {phone.image ? (
                    <img src={phone.image} alt={phone.name} className="h-full w-auto object-contain p-3 drop-shadow-xl group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-20 rounded-xl border-2 opacity-25" style={{ borderColor: phone.brandColor }} />
                      <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: phone.brandColor }}>Coming Soon</span>
                    </div>
                  )}
                  {/* Hype badge */}
                  <div className="absolute top-2 right-2 bg-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    {phone.hype}% Hype
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${statusColors[phone.status]}`}>
                          {phone.status}
                        </span>
                        <span className="glass text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/20 flex items-center gap-1">
                          <Calendar size={9} /> {phone.launchDate}
                        </span>
                      </div>
                      <h3 className="text-lg font-black group-hover:text-primary transition-colors">{phone.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{phone.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">Expected Price</p>
                      <p className="font-black text-xl" style={{ color: phone.brandColor }}>{phone.expectedPrice}</p>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-3 mt-3">
                    {[
                      { icon: Cpu, label: phone.expectedSpecs.chipset },
                      { icon: MemoryStick, label: phone.expectedSpecs.ram + " RAM" },
                      { icon: Camera, label: phone.expectedSpecs.camera + " Camera" },
                      { icon: Battery, label: phone.expectedSpecs.battery },
                      { icon: Monitor, label: phone.expectedSpecs.display },
                    ].map((spec, j) => (
                      <div key={j} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="w-5 h-5 glass rounded-md flex items-center justify-center shrink-0">
                          <spec.icon size={10} className="text-primary/70" />
                        </div>
                        <span className="line-clamp-1 text-[11px]">{spec.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer row */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-white/10 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star size={11} className="text-amber-500 fill-amber-500" />
                        <span className="font-semibold">{phone.followers}</span>
                        <span>following</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Globe size={11} />
                        <span>{phone.launchQuarter}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleNotify(phone.id)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                          notified.includes(phone.id)
                            ? "bg-primary/15 border-primary/40 text-primary"
                            : "glass border-white/20 hover:border-primary/40 text-muted-foreground hover:text-primary"
                        }`}
                      >
                        <Bell size={11} className={notified.includes(phone.id) ? "fill-primary" : ""} />
                        {notified.includes(phone.id) ? "Notified" : "Notify Me"}
                      </button>
                      <Link
                        to={`/phone/${phone.id}`}
                        className="flex items-center gap-1 text-primary text-xs font-bold hover:underline"
                      >
                        Full Specs <ChevronRight size={11} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
