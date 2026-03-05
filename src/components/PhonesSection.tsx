"use client";

import { ChevronRight } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";

// Real phone images
import _samsungImg from "@/assets/phones/samsung-s25-ultra.png";
import _iphoneImg from "@/assets/phones/iphone-16-pro-max.png";
import _oneplusImg from "@/assets/phones/oneplus-13.png";
import _motorolaImg from "@/assets/phones/motorola-edge-50.png";
import _xiaomiImg from "@/assets/phones/xiaomi-15-ultra.png";
import _realmeImg from "@/assets/phones/realme-p4.png";
import _googleImg from "@/assets/phones/google-pixel-9-pro.png";
import _vivoImg from "@/assets/phones/vivo-x200.png";
export const samsungImg = _samsungImg.src;
export const iphoneImg = _iphoneImg.src;
export const oneplusImg = _oneplusImg.src;
export const motorolaImg = _motorolaImg.src;
export const xiaomiImg = _xiaomiImg.src;
export const realmeImg = _realmeImg.src;
export const googleImg = _googleImg.src;
export const vivoImg = _vivoImg.src;

interface Phone {
  name: string;
  slug?: string;
  price?: string;
  score?: number;
  scoreColor?: "high" | "mid" | "low";
  bgColor: string;
  accentColor: string;
  image?: string;
}

interface PhonesSectionProps {
  title: string;
  phones: Phone[];
  viewAllHref?: string;
}

function ScoreBadge({ score, color }: { score: number; color: "high" | "mid" | "low" }) {
  const colors = {
    high: "bg-green-700",
    mid: "bg-amber-600",
    low: "bg-red-600",
  };
  return (
    <div className={`absolute top-2 left-2 ${colors[color]} text-white text-xs font-bold rounded px-1.5 py-0.5 leading-tight z-10`}>
      <div className="text-sm leading-none">{score}%</div>
      <div className="text-[9px] opacity-80">Spec Score</div>
    </div>
  );
}

function PhoneCard({ phone }: { phone: Phone }) {
  const slug = phone.slug || phone.name.toLowerCase().replace(/\s+/g, "-");
  return (
    <Link href={`/phone/${slug}`} className="flex flex-col shrink-0 w-44 bg-white rounded-xl overflow-hidden hover:shadow-lg border border-border/40 hover:border-primary/30 transition-all group">
      {/* Phone image area */}
      <div className="relative h-44 flex items-center justify-center overflow-hidden" style={{ backgroundColor: phone.bgColor }}>
        {phone.score && (
          <ScoreBadge score={phone.score} color={phone.scoreColor || "mid"} />
        )}
        {phone.image ? (
          <img
            src={phone.image}
            alt={phone.name}
            className="h-36 w-auto object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full gap-2">
            <div className="w-10 h-16 rounded-lg border-2 opacity-30" style={{ borderColor: phone.accentColor }} />
            <span
              className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border"
              style={{ borderColor: phone.accentColor + "50", color: phone.accentColor, backgroundColor: phone.accentColor + "12" }}
            >
              Coming Soon
            </span>
          </div>
        )}
        {/* Subtle gradient at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
      </div>
      {/* Info */}
      <div className="p-3 bg-white">
        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">{phone.name}</p>
        {phone.price ? (
          <p className="text-sm font-bold text-foreground mt-1">{phone.price}</p>
        ) : (
          <p className="text-xs font-bold mt-1" style={{ color: phone.accentColor }}>Coming Soon</p>
        )}
      </div>
    </Link>
  );
}

export default function PhonesSection({ title, phones, viewAllHref = "/phone-finder" }: PhonesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  return (
    <section className="px-4 py-3">
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <Link href={viewAllHref} className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
            View All <ChevronRight size={14} />
          </Link>
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

