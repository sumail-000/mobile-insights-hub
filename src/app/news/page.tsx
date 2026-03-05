"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Clock, ChevronRight, Search, TrendingUp, Star,
  Newspaper, Camera, BatteryFull, Radio, Gamepad2, Cpu,
  BookOpen, X, Flame, Award, Loader2
} from "lucide-react";
import { getNews } from "@/lib/api";
import type { NewsArticle } from "@/lib/api";



const CATEGORIES = ["All", "news", "review", "deep-dive", "comparison"];
const CATEGORY_LABELS: Record<string, string> = {
  All: "All", news: "News", review: "Reviews", "deep-dive": "Deep Dives", comparison: "Comparisons"
};
const CATEGORY_COLORS: Record<string, string> = {
  news: "bg-blue-600", review: "bg-green-600", "deep-dive": "bg-purple-600", comparison: "bg-red-600",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 24) return `${h || 1}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

const trendingTopics = [
  { icon: Camera, label: "Best Camera Phones", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: BatteryFull, label: "Fast Charging Phones", color: "text-green-500", bg: "bg-green-500/10" },
  { icon: Cpu, label: "Snapdragon 8 Elite", color: "text-purple-500", bg: "bg-purple-500/10" },
  { icon: Gamepad2, label: "Best Gaming Phones", color: "text-orange-500", bg: "bg-orange-500/10" },
  { icon: Radio, label: "5G Smartphones", color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { icon: Award, label: "Editor's Choice", color: "text-amber-500", bg: "bg-amber-500/10" },
];

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [featured, setFeatured] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getNews({ limit: 20, page: 1 }),
      getNews({ featured: "1", limit: 1 }),
    ]).then(([main, feat]) => {
      setArticles(main.articles);
      setHasMore(main.page < main.pages);
      setPage(1);
      if (feat.articles[0]) setFeatured(feat.articles[0]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (page === 1) return;
    getNews({ limit: 20, page }).then(r => {
      setArticles(prev => [...prev, ...r.articles]);
      setHasMore(r.page < r.pages);
    });
  }, [page]);

  const filtered = articles.filter(a => {
    const matchCat = activeCategory === "All" || a.category === activeCategory;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || (a.excerpt || "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen page-bg">
      <Navbar />

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-foreground via-foreground/95 to-foreground/85 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 right-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="px-4 py-10 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Newspaper size={14} className="text-primary" />
            <span className="text-primary text-xs font-bold uppercase tracking-widest">News & Reviews</span>
          </div>
          <h1 className="text-white text-3xl md:text-4xl font-black mb-2 tracking-tight">Mobile News Hub</h1>
          <p className="text-white/50 text-sm max-w-lg mb-6">Latest smartphone news, in-depth reviews, leaked specs, and expert buying guides — all in one place.</p>
          <div className="max-w-md relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search news, reviews, phones..."
              className="w-full glass border border-white/15 text-white placeholder-white/30 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="bg-foreground/95 border-b border-white/10 sticky top-0 z-40">
        <div className="px-4 flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`text-xs font-semibold px-4 py-1.5 rounded-full whitespace-nowrap transition-all shrink-0 ${
                activeCategory === cat ? "bg-primary text-white" : "text-white/60 hover:text-white hover:bg-white/10"
              }`}>
              {CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Featured article */}
            {activeCategory === "All" && !search && featured && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Flame size={15} className="text-primary" />
                  <span className="text-sm font-bold uppercase tracking-wide">Featured Story</span>
                </div>
                <Link href={`/news/${featured.slug}`} className="glass-card rounded-2xl overflow-hidden block group hover:-translate-y-0.5 transition-all duration-300 hover:shadow-2xl">
                  <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, #ff6e1460, #ff6e1420, transparent)` }} />
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-64 h-48 md:h-auto flex items-center justify-center shrink-0 relative overflow-hidden bg-primary/5">
                      {featured.thumbnail_url
                        ? <img src={featured.thumbnail_url} alt={featured.title} className="h-full w-auto max-h-44 object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 p-4" />
                        : <Newspaper size={48} className="text-primary/30" />}
                      <span className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[featured.category] || "bg-gray-600"}`}>
                        {CATEGORY_LABELS[featured.category] || featured.category}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col justify-between">
                      <div>
                        <h2 className="text-lg font-black group-hover:text-primary transition-colors mb-2 leading-snug">{featured.title}</h2>
                        <p className="text-sm text-muted-foreground line-clamp-3">{featured.excerpt}</p>
                      </div>
                      <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">{featured.author}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Clock size={10} />{timeAgo(featured.published_at)}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Star size={10} />{featured.views} views</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Article count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{filtered.length}</span> articles
                {activeCategory !== "All" && <span> in <span className="text-primary font-semibold">{CATEGORY_LABELS[activeCategory] || activeCategory}</span></span>}
              </p>
              {search && (
                <button onClick={() => setSearch("")} className="text-xs text-primary flex items-center gap-1 hover:underline">
                  <X size={10} /> Clear search
                </button>
              )}
            </div>

            {/* Article grid */}
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-primary" /></div>
            ) : (
              <div className="space-y-4">
                {filtered.length === 0 ? (
                  <div className="glass-card rounded-2xl p-14 text-center">
                    <Newspaper size={36} className="text-muted-foreground mx-auto mb-4 opacity-40" />
                    <p className="font-bold text-lg mb-1">No articles found</p>
                    <p className="text-sm text-muted-foreground">Try a different category or search term</p>
                  </div>
                ) : filtered.map(article => (
                  <Link key={article.id} href={`/news/${article.slug}`}
                    className="glass-card rounded-2xl overflow-hidden flex flex-col sm:flex-row group hover:-translate-y-0.5 transition-all duration-300 hover:shadow-xl hover:border-primary/25 block">
                    <div className="sm:w-40 h-36 sm:h-auto flex items-center justify-center shrink-0 relative overflow-hidden bg-primary/5">
                      {article.thumbnail_url
                        ? <img src={article.thumbnail_url} alt={article.title} className="h-28 w-auto object-contain drop-shadow-xl group-hover:scale-105 transition-transform p-3" />
                        : <Newspaper size={32} className="text-primary/20" />}
                      <span className={`absolute bottom-2 left-2 text-white text-[9px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[article.category] || "bg-gray-600"}`}>
                        {CATEGORY_LABELS[article.category] || article.category}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="font-bold text-sm leading-snug group-hover:text-primary transition-colors mb-1.5">{article.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{article.excerpt}</p>
                      </div>
                      <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground/80">{article.author}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Clock size={9} />{timeAgo(article.published_at)}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><BookOpen size={9} />{article.views} views</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Load more */}
            {hasMore && !loading && (
              <div className="mt-6 glass-card rounded-2xl p-4 text-center">
                <button onClick={() => setPage(p => p + 1)} className="bg-primary text-primary-foreground px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg">
                  Load More Articles
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0 space-y-4">
            {/* Latest Reviews from DB */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <h3 className="font-bold text-sm">Latest Reviews</h3>
                </div>
                <button onClick={() => setActiveCategory("review")} className="text-primary text-xs font-semibold hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                {articles.filter(a => a.category === "review").slice(0, 5).map((r, i) => (
                  <Link key={i} href={`/news/${r.slug}`} className="flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-white/50 bg-primary/5">
                      {r.thumbnail_url ? <img src={r.thumbnail_url} alt={r.title} className="h-10 w-auto object-contain group-hover:scale-110 transition-transform" /> : <Newspaper size={16} className="text-primary/40" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold group-hover:text-primary transition-colors line-clamp-2">{r.title}</p>
                      <p className="text-[10px] text-muted-foreground">By {r.author}</p>
                    </div>
                  </Link>
                ))}
                {articles.filter(a => a.category === "review").length === 0 && !loading && (
                  <p className="text-xs text-muted-foreground text-center py-2">No reviews yet</p>
                )}
              </div>
            </div>

            {/* Trending topics */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={14} className="text-primary" />
                <h3 className="font-bold text-sm">Trending Topics</h3>
              </div>
              <div className="space-y-2">
                {trendingTopics.map((t, i) => (
                  <Link key={i} href="/phone-finder" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/30 transition-colors group">
                    <div className={`w-7 h-7 rounded-lg ${t.bg} flex items-center justify-center shrink-0`}>
                      <t.icon size={13} className={t.color} />
                    </div>
                    <span className="text-xs font-semibold group-hover:text-primary transition-colors">{t.label}</span>
                    <ChevronRight size={11} className="ml-auto text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="glass-card rounded-2xl p-5" style={{ background: "linear-gradient(135deg, rgba(var(--primary-rgb, 255,110,20),0.12), rgba(var(--primary-rgb,255,110,20),0.04))" }}>
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center mb-3">
                <Newspaper size={18} className="text-primary" />
              </div>
              <h3 className="font-bold text-sm mb-1">Stay Updated</h3>
              <p className="text-xs text-muted-foreground mb-3">Get the latest phone news and reviews delivered to your inbox.</p>
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-white/50 border border-white/50 rounded-lg px-3 py-2 text-xs mb-2 focus:outline-none focus:border-primary/50"
              />
              <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors">
                Subscribe Free
              </button>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}

