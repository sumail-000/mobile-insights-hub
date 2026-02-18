import { ChevronRight, Smartphone } from "lucide-react";
import { useRef } from "react";

interface Phone {
  name: string;
  price?: string;
  score?: number;
  scoreColor?: "high" | "mid" | "low";
  bgColor: string;
  accentColor: string;
}

interface PhonesSectionProps {
  title: string;
  phones: Phone[];
}

function ScoreBadge({ score, color }: { score: number; color: "high" | "mid" | "low" }) {
  const colors = {
    high: "bg-green-700",
    mid: "bg-amber-600",
    low: "bg-red-600",
  };
  return (
    <div className={`absolute top-2 left-2 ${colors[color]} text-white text-xs font-bold rounded px-1.5 py-0.5 leading-tight`}>
      <div className="text-sm leading-none">{score}%</div>
      <div className="text-[9px] opacity-80">Spec Score</div>
    </div>
  );
}

function PhoneCard({ phone }: { phone: Phone }) {
  return (
    <a href="#" className="flex flex-col shrink-0 w-44 glass-card rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all group">
      {/* Phone image area */}
      <div className="relative h-44 flex items-center justify-center" style={{ backgroundColor: phone.bgColor }}>
        {phone.score && (
          <ScoreBadge score={phone.score} color={phone.scoreColor || "mid"} />
        )}
        {/* Glassmorphism phone silhouette */}
        <div
          className="w-20 h-36 rounded-2xl border-2 relative flex flex-col backdrop-blur-sm"
          style={{ borderColor: phone.accentColor, backgroundColor: phone.accentColor + "22" }}
        >
          <div className="w-8 h-1.5 rounded-full mx-auto mt-2" style={{ backgroundColor: phone.accentColor + "88" }}></div>
          {/* Screen with glass effect */}
          <div className="flex-1 mx-1.5 my-1.5 rounded-lg flex items-center justify-center" style={{ backgroundColor: phone.accentColor + "33" }}>
            <Smartphone size={18} style={{ color: phone.accentColor + "cc" }} />
          </div>
          <div className="w-6 h-1 rounded-full mx-auto mb-2" style={{ backgroundColor: phone.accentColor + "88" }}></div>
        </div>
      </div>
      {/* Info */}
      <div className="p-3 bg-white/70 backdrop-blur-sm">
        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{phone.name}</p>
        {phone.price && (
          <p className="text-sm font-bold text-foreground mt-1">{phone.price}</p>
        )}
        {!phone.price && (
          <p className="text-xs text-primary mt-1">Coming Soon</p>
        )}
      </div>
    </a>
  );
}

export default function PhonesSection({ title, phones }: PhonesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-3">
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <a href="#" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
            View All <ChevronRight size={14} />
          </a>
        </div>
        <div className="relative">
          <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {phones.map((phone, i) => (
              <PhoneCard key={i} phone={phone} />
            ))}
          </div>
          <button onClick={() => scroll("right")} className="absolute -right-2 top-1/2 -translate-y-1/2 glass-card rounded-full p-1.5 shadow-md hover:border-primary/50 transition-colors hidden md:flex z-10">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
