import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const brands = [
  { name: "Samsung", color: "#1428A0", bg: "#EEF0FA" },
  { name: "Apple", color: "#555555", bg: "#F5F5F5" },
  { name: "Motorola", color: "#002B5C", bg: "#EDF1F8" },
  { name: "Xiaomi", color: "#FF6900", bg: "#FFF3EC" },
  { name: "OnePlus", color: "#F5010C", bg: "#FFF0F0" },
  { name: "Vivo", color: "#415FFF", bg: "#EEF0FF" },
  { name: "OPPO", color: "#1D4289", bg: "#EEF2FA" },
  { name: "Realme", color: "#FFD600", bg: "#FFFCE6" },
  { name: "Google", color: "#4285F4", bg: "#EFF4FF" },
  { name: "Infinix", color: "#ED1C24", bg: "#FFF0F0" },
  { name: "Tecno", color: "#00AEEF", bg: "#E6F8FF" },
  { name: "Nokia", color: "#124191", bg: "#EEF2FA" },
];

export default function BrandsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-4">
      <div className="bg-card rounded-xl border border-border shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Featured Mobile Brands</h2>
          <a href="#" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
            View All <ChevronRight size={14} />
          </a>
        </div>
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide pb-1"
          >
            {brands.map((brand, i) => (
              <a
                key={i}
                href="#"
                className="flex flex-col items-center gap-2 shrink-0 group"
              >
                <div
                  className="w-24 h-16 rounded-lg flex items-center justify-center border border-border group-hover:border-primary/30 transition-colors"
                  style={{ backgroundColor: brand.bg }}
                >
                  <span className="font-bold text-sm tracking-tight text-center px-2" style={{ color: brand.color }}>
                    {brand.name}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">{brand.name}</span>
              </a>
            ))}
          </div>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-7 -translate-y-1/2 bg-card border border-border rounded-full p-1.5 shadow-md hover:border-primary/50 transition-colors hidden md:flex"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
