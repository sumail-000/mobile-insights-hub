"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { getBrands } from "@/lib/api";

const BRAND_COLORS: Record<string, string> = {
  Samsung: "#1428A0", Apple: "#555555", Xiaomi: "#FF6900", OnePlus: "#F5010C",
  Google: "#4285F4", Motorola: "#5C8EE6", Vivo: "#415FFF", OPPO: "#1D4289",
  Realme: "#FFD600", Sony: "#aaaaaa", Nokia: "#124191", Huawei: "#CF0A2C",
  Honor: "#c0c0c0", Asus: "#00BCB4", LG: "#A50034", Lenovo: "#E2231A",
  Nothing: "#cccccc", ZTE: "#E22D3F", Infinix: "#ED1C24", Tecno: "#00AEEF",
  Amazon: "#FF9900", Alcatel: "#009EDD", Meizu: "#1E90FF",
};
const BRAND_LOGOS: Record<string, string> = {
  Samsung: "https://cdn.simpleicons.org/samsung/1428A0",
  Apple: "https://cdn.simpleicons.org/apple/888888",
  Xiaomi: "https://cdn.simpleicons.org/xiaomi/FF6900",
  OnePlus: "https://cdn.simpleicons.org/oneplus/F5010C",
  Google: "https://cdn.simpleicons.org/google/4285F4",
  Motorola: "https://cdn.simpleicons.org/motorola/5C8EE6",
  Vivo: "https://cdn.simpleicons.org/vivo/415FFF",
  OPPO: "https://cdn.simpleicons.org/oppo/1D4289",
  Huawei: "https://cdn.simpleicons.org/huawei/CF0A2C",
  Sony: "https://cdn.simpleicons.org/sony/aaaaaa",
  Nokia: "https://cdn.simpleicons.org/nokia/4BA3DA",
  Asus: "https://cdn.simpleicons.org/asus/00BCB4",
  LG: "https://cdn.simpleicons.org/lg/A50034",
  Lenovo: "https://cdn.simpleicons.org/lenovo/E2231A",
  Amazon: "https://cdn.simpleicons.org/amazon/FF9900",
};

export default function BrandsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [brands, setBrands] = useState<{ name: string; color: string; devices: number; logo: string | null }[]>([]);

  useEffect(() => {
    getBrands().then(data => {
      const sorted = [...data].sort((a, b) => b.device_count - a.device_count);
      setBrands(sorted.map(b => ({
        name: b.name,
        color: BRAND_COLORS[b.name] || "#ff6e14",
        devices: b.device_count,
        logo: BRAND_LOGOS[b.name] || null,
      })));
    }).catch(() => {});
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
    }
  };

  return (
    <section className="px-4 py-4">
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold">Featured Mobile Brands</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Browse phones by manufacturer</p>
          </div>
          <Link
            href="/brands"
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
                href="/brands"
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
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-9 h-9 object-contain relative z-10 transition-transform duration-300 group-hover/card:scale-110"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-xs font-black text-center px-1 relative z-10" style={{ color: brand.color }}>
                      {brand.name.slice(0, 3).toUpperCase()}
                    </span>
                  )}
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
