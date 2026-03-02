import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Wifi, MemoryStick, HardDrive, Zap, Monitor, Brain, ChevronRight, Smartphone, Laptop, Tablet, Tv } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const popularFeatures = [
  { icon: Wifi, label: "5G Phones" },
  { icon: MemoryStick, label: "8GB & Above RAM" },
  { icon: HardDrive, label: "256 GB & Above Memory" },
  { icon: Zap, label: "Slimmest Phones" },
  { icon: Monitor, label: "120Hz Refresh Rate" },
  { icon: Brain, label: "AI Smartphones" },
];

const quickCategories = [
  { label: "Mobiles", Icon: Smartphone },
  { label: "Laptops", Icon: Laptop },
  { label: "Tablets", Icon: Tablet },
  { label: "TVs", Icon: Tv },
];

const priceRanges = ["$200", "$400", "$600", "$800", "$1000+"];

export default function HeroFinder() {
  const [priceRange, setPriceRange] = useState([0, 80]);

  const minPrice = Math.round((priceRange[0] / 100) * 1000);
  const maxPrice = priceRange[1] >= 100 ? "1000+" : Math.round((priceRange[1] / 100) * 1000);

  return (
    <section className="relative overflow-hidden">
      {/* Hero image background */}
      <div className="relative h-52 md:h-72 lg:h-80 overflow-hidden">
        <img src={heroBanner} alt="Latest Smartphones" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center">
          <div className="px-6 md:px-10 w-full">
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-1">PhoneSpecs 2026</p>
            <h1 className="text-white text-2xl md:text-4xl font-bold leading-tight mb-2">
              Find Your Perfect<br />Smartphone
            </h1>
            <p className="text-white/70 text-sm md:text-base max-w-md">
              Compare specs, read reviews, and discover the best phones at every price.
            </p>
          </div>
        </div>
      </div>

      {/* Finder tool */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Phone finder */}
          <div className="md:col-span-2 glass-card rounded-xl p-5">
            <h2 className="text-xl font-bold mb-4">Let's Find a Mobile For You!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price filter */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Price Range</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-semibold text-foreground bg-white/60 backdrop-blur-sm border border-border px-3 py-1.5 rounded w-20 text-center">${minPrice}</span>
                  <span className="text-muted-foreground text-sm">to</span>
                  <span className="text-sm font-semibold text-foreground bg-white/60 backdrop-blur-sm border border-border px-3 py-1.5 rounded w-24 text-center">${maxPrice}</span>
                </div>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={100}
                  step={5}
                  className="mb-4"
                />
                <button className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors shadow-md">
                  Find Mobiles
                </button>
              </div>

              {/* Popular features */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Mobiles by Popular Features</p>
                <div className="space-y-2">
                  {popularFeatures.map((f, i) => (
                    <a key={i} href="#" className="flex items-center gap-2.5 text-sm text-foreground hover:text-primary group">
                      <f.icon size={14} className="text-muted-foreground group-hover:text-primary shrink-0" />
                      <span>{f.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick categories + price */}
          <div className="space-y-4">
            <div className="glass-card rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-3">What are you looking to buy?</h3>
              <div className="grid grid-cols-2 gap-2">
                {quickCategories.map((c, i) => (
                  <a key={i} href="#" className="flex items-center gap-2 bg-white/50 backdrop-blur-sm border border-white/60 rounded-lg px-3 py-2 text-sm font-medium hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all">
                    <c.Icon size={15} className="shrink-0 text-primary" />
                    <span>{c.label}</span>
                    <ChevronRight size={12} className="ml-auto opacity-50" />
                  </a>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-3">Mobiles by Price</h3>
              <div className="grid grid-cols-2 gap-1.5">
                {priceRanges.map((p, i) => (
                  <a key={i} href="#" className="text-xs text-foreground bg-white/50 backdrop-blur-sm border border-white/60 hover:bg-primary/10 hover:text-primary hover:border-primary/30 rounded px-2 py-1.5 text-center transition-all font-medium">
                    Under {p}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
