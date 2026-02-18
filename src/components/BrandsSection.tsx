import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";

const brands = [
  {
    name: "Samsung",
    color: "#1428A0",
    devices: 312,
    logo: "https://cdn.simpleicons.org/samsung/1428A0",
  },
  {
    name: "Apple",
    color: "#555555",
    devices: 145,
    logo: "https://cdn.simpleicons.org/apple/888888",
  },
  {
    name: "Xiaomi",
    color: "#FF6900",
    devices: 284,
    logo: "https://cdn.simpleicons.org/xiaomi/FF6900",
  },
  {
    name: "OnePlus",
    color: "#F5010C",
    devices: 93,
    logo: "https://cdn.simpleicons.org/oneplus/F5010C",
  },
  {
    name: "Google",
    color: "#4285F4",
    devices: 47,
    logo: "https://cdn.simpleicons.org/google/4285F4",
  },
  {
    name: "Motorola",
    color: "#5C8EE6",
    devices: 198,
    logo: "https://cdn.simpleicons.org/motorola/5C8EE6",
  },
  {
    name: "Vivo",
    color: "#415FFF",
    devices: 167,
    logo: "https://cdn.simpleicons.org/vivo/415FFF",
  },
  {
    name: "OPPO",
    color: "#1D4289",
    devices: 203,
    logo: "https://cdn.simpleicons.org/oppo/1D4289",
  },
  {
    name: "Realme",
    color: "#FFD600",
    devices: 178,
    logo: "https://cdn.simpleicons.org/realme/FFD600",
  },
  {
    name: "Sony",
    color: "#aaaaaa",
    devices: 88,
    logo: "https://cdn.simpleicons.org/sony/aaaaaa",
  },
  {
    name: "Nokia",
    color: "#124191",
    devices: 201,
    logo: "https://cdn.simpleicons.org/nokia/4BA3DA",
  },
  {
    name: "Huawei",
    color: "#CF0A2C",
    devices: 256,
    logo: "https://cdn.simpleicons.org/huawei/CF0A2C",
  },
];

export default function BrandsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-4">
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold">Featured Mobile Brands</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Browse phones by manufacturer</p>
          </div>
          <Link
            to="/brands"
            className="text-primary text-sm font-semibold hover:underline flex items-center gap-1 shrink-0"
          >
            View All <ChevronRight size={14} />
          </Link>
        </div>

        <div className="relative group">
          {/* Scroll buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 glass-card rounded-full p-1.5 shadow-lg hover:border-primary/50 transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 glass-card rounded-full p-1.5 shadow-lg hover:border-primary/50 transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
          >
            <ChevronRight size={14} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide pb-1"
          >
            {brands.map((brand, i) => (
              <Link
                key={i}
                to="/brands"
                className="flex flex-col items-center gap-2.5 shrink-0 group/card"
              >
                {/* Glass card with logo */}
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center transition-all duration-300 group-hover/card:-translate-y-1 group-hover/card:shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${brand.color}18 0%, ${brand.color}08 100%)`,
                    border: `1px solid ${brand.color}30`,
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {/* Glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 rounded-2xl"
                    style={{ background: `radial-gradient(circle at center, ${brand.color}25, transparent 70%)` }}
                  />
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-9 h-9 object-contain relative z-10 transition-transform duration-300 group-hover/card:scale-110"
                    onError={(e) => {
                      // Fallback to text if logo fails
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        const span = document.createElement("span");
                        span.className = "text-xs font-black text-center px-1 relative z-10";
                        span.style.color = brand.color;
                        span.textContent = brand.name.slice(0, 3).toUpperCase();
                        parent.appendChild(span);
                      }
                    }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-foreground group-hover/card:text-primary transition-colors leading-tight">
                    {brand.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{brand.devices} phones</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
