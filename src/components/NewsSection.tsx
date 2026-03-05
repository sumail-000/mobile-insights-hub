"use client";

import { Clock, ChevronRight, Newspaper, Camera, BatteryFull, Radio, Gamepad2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getNews } from "@/lib/api";
import type { NewsArticle } from "@/lib/api";

const CATEGORY_COLORS: Record<string, string> = {
  news: "bg-blue-600", review: "bg-orange-500",
  "deep-dive": "bg-purple-600", comparison: "bg-red-600",
};
const CATEGORY_LABELS: Record<string, string> = {
  news: "News", review: "Review", "deep-dive": "Deep Dive", comparison: "Compare",
};

const deepDiveItems = [
  { label: "Camera Guide", Icon: Camera, bg: "from-slate-800 to-slate-900", href: "/news?cat=deep-dive" },
  { label: "Battery Tips", Icon: BatteryFull, bg: "from-green-900 to-emerald-800", href: "/news?cat=deep-dive" },
  { label: "5G Explained", Icon: Radio, bg: "from-blue-900 to-indigo-800", href: "/news?cat=news" },
  { label: "Game Zone", Icon: Gamepad2, bg: "from-purple-900 to-violet-800", href: "/news?cat=deep-dive" },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m || 1} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function NewsSection() {
  const [latest, setLatest] = useState<NewsArticle[]>([]);
  const [reviews, setReviews] = useState<NewsArticle[]>([]);

  useEffect(() => {
    getNews({ limit: 5, page: 1 }).then(r => setLatest(r.articles)).catch(() => {});
    getNews({ category: "review", limit: 3 }).then(r => setReviews(r.articles)).catch(() => {});
  }, []);

  const featured = latest[0] ?? null;
  const sideItems = latest.slice(1, 5);

  return (
    <section className="px-4 py-3">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Latest News */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Latest News</h2>
            <Link href="/news" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Featured article */}
            {featured ? (
              <Link href={`/news/${featured.slug}`} className="group">
                <div className="h-44 rounded-xl relative overflow-hidden mb-3 flex items-center justify-center bg-primary/5">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10" />
                  {featured.thumbnail_url
                    ? <img src={featured.thumbnail_url} alt={featured.title} className="h-40 w-auto object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-300" />
                    : <Newspaper size={40} className="text-primary/20" />}
                  <div className="absolute bottom-3 left-3 right-3 z-20">
                    <span className={`text-white text-[10px] font-bold px-2 py-0.5 rounded ${CATEGORY_COLORS[featured.category] || "bg-gray-600"} mb-1 inline-block`}>
                      {CATEGORY_LABELS[featured.category] || featured.category}
                    </span>
                    <div className="flex items-center gap-1 text-white/70 text-xs">
                      <Clock size={10} /><span>{timeAgo(featured.published_at)}</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2">{featured.title}</h3>
              </Link>
            ) : (
              <div className="h-44 rounded-xl bg-primary/5 animate-pulse" />
            )}

            {/* Side news list */}
            <div className="space-y-3">
              {sideItems.length > 0 ? sideItems.map((item, i) => (
                <Link key={i} href={`/news/${item.slug}`} className="flex gap-3 group">
                  <div className="w-20 h-14 rounded-lg shrink-0 flex items-center justify-center border border-white/60 overflow-hidden bg-primary/5">
                    {item.thumbnail_url
                      ? <img src={item.thumbnail_url} alt={item.title} className="h-12 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-200" />
                      : <Newspaper size={20} className="text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`text-white text-[9px] font-bold px-1.5 py-0.5 rounded ${CATEGORY_COLORS[item.category] || "bg-gray-600"}`}>
                        {CATEGORY_LABELS[item.category] || item.category}
                      </span>
                      <span className="text-muted-foreground text-[10px] flex items-center gap-0.5">
                        <Clock size={9} />{timeAgo(item.published_at)}
                      </span>
                    </div>
                    <p className="text-xs font-medium group-hover:text-primary transition-colors line-clamp-2">{item.title}</p>
                  </div>
                </Link>
              )) : Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 rounded-lg bg-primary/5 animate-pulse" />
              ))}
            </div>
          </div>
        </div>

        {/* Latest Reviews */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Latest Reviews</h2>
            <Link href="/news" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {reviews.length > 0 ? reviews.map((review, i) => (
              <Link key={i} href={`/news/${review.slug}`} className="block group">
                <div className="flex gap-3 items-center">
                  <div className="w-14 h-14 rounded-xl shrink-0 flex items-center justify-center overflow-hidden border border-white/60 bg-primary/5">
                    {review.thumbnail_url
                      ? <img src={review.thumbnail_url} alt={review.title} className="h-12 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-200" />
                      : <Newspaper size={18} className="text-primary/30" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold group-hover:text-primary transition-colors line-clamp-2 mb-1">{review.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">By {review.author}</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Clock size={9} />{timeAgo(review.published_at)}</span>
                    </div>
                  </div>
                </div>
                {i < reviews.length - 1 && <div className="border-b border-border/50 mt-3" />}
              </Link>
            )) : Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-primary/5 animate-pulse" />
            ))}
          </div>

          {/* Deep dive section */}
          <div className="mt-5 pt-4 border-t border-border/50">
            <h3 className="text-sm font-bold mb-3">Deep Dive</h3>
            <div className="grid grid-cols-2 gap-2">
              {deepDiveItems.map((d, i) => (
                <Link key={i} href={d.href} className={`bg-gradient-to-br ${d.bg} rounded-lg overflow-hidden h-16 flex items-end p-2 relative group border border-white/10 hover:border-white/20 transition-all`}>
                  <div className="absolute top-2 right-2 glass rounded-lg p-1">
                    <d.Icon size={14} className="text-white/90" />
                  </div>
                  <span className="text-white text-xs font-bold">{d.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
