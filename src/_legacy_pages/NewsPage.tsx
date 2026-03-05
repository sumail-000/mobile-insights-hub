import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Clock, ChevronRight, Search, Tag, TrendingUp, Star,
  Newspaper, Camera, BatteryFull, Radio, Gamepad2, Cpu,
  BookOpen, Filter, X, Flame, Award
} from "lucide-react";
import samsungImg from "@/assets/phones/samsung-s25-ultra.png";
import iphoneImg from "@/assets/phones/iphone-16-pro-max.png";
import oneplusImg from "@/assets/phones/oneplus-13.png";
import xiaomiImg from "@/assets/phones/xiaomi-15-ultra.png";
import googleImg from "@/assets/phones/google-pixel-9-pro.png";
import motorolaImg from "@/assets/phones/motorola-edge-50.png";
import realmeImg from "@/assets/phones/realme-p4.png";
import vivoImg from "@/assets/phones/vivo-x200.png";

const categories = ["All", "News", "Reviews", "Rumors", "Launches", "Tips & Guides", "Comparisons"];

const featuredArticle = {
  id: 1,
  title: "Samsung Galaxy S26 Ultra: Everything We Know So Far — Specs, Design, and Release Date",
  excerpt: "Samsung's next flagship is shaping up to be a beast. Leaked renders, benchmark scores, and insider sources paint a picture of the most powerful Galaxy yet, featuring a new 200MP variable-aperture main camera and the Snapdragon 8 Gen 4 chipset.",
  category: "Rumors",
  time: "2 hours ago",
  author: "James Wilson",
  readTime: "8 min read",
  image: samsungImg,
  bgColor: "#f0f4f8",
  accentColor: "#1428A0",
};

const articles = [
  {
    id: 2,
    title: "Apple iPhone 17 Pro Max Review: The Best iPhone Yet, But At What Cost?",
    excerpt: "Apple's ProMotion display finally hits 120Hz on all models, but the real story is the A19 Pro chip and its AI capabilities that leave Android flagships scrambling.",
    category: "Reviews",
    time: "5 hours ago",
    author: "Sarah Chen",
    readTime: "12 min read",
    image: iphoneImg,
    bgColor: "#f5f5f5",
    accentColor: "#555555",
    score: 94,
  },
  {
    id: 3,
    title: "Xiaomi 17 Ultra Leica Edition Announced: 200MP + 90W Charging Beast",
    excerpt: "Xiaomi and Leica push the boundaries again with a triple 50MP Leica system co-engineered optics, plus industry-leading 90W wireless charging in its thinnest flagship ever.",
    category: "Launches",
    time: "1 day ago",
    author: "Raj Patel",
    readTime: "6 min read",
    image: xiaomiImg,
    bgColor: "#f8f3f0",
    accentColor: "#FF6900",
  },
  {
    id: 4,
    title: "OnePlus 13 Review: 100W SuperVOOC Charges to Full in Under 25 Minutes",
    excerpt: "The OnePlus 13 doesn't just bring speed in charging — it delivers a near-stock Android experience with Hasselblad cameras tuned to perfection.",
    category: "Reviews",
    time: "2 days ago",
    author: "Mike Torres",
    readTime: "10 min read",
    image: oneplusImg,
    bgColor: "#fff0f0",
    accentColor: "#F5010C",
    score: 92,
  },
  {
    id: 5,
    title: "Google Pixel 10 Pro Spotted on Geekbench with Tensor G5 — Scores Reveal All",
    excerpt: "The Tensor G5 shows a massive leap in CPU performance over its predecessor, while the NPU scores hint at on-device AI that could rival cloud-based processing.",
    category: "Rumors",
    time: "3 days ago",
    author: "Alex Kim",
    readTime: "5 min read",
    image: googleImg,
    bgColor: "#f0f4ff",
    accentColor: "#4285F4",
  },
  {
    id: 6,
    title: "5 Reasons the Motorola Edge 50 is the Best Budget Phone of 2025",
    excerpt: "At just $369, the Edge 50 packs a 144Hz pOLED display, 68W TurboPower charging, and a clean Android experience that puts it miles ahead of the competition.",
    category: "Tips & Guides",
    time: "4 days ago",
    author: "Lisa Wong",
    readTime: "7 min read",
    image: motorolaImg,
    bgColor: "#f0f4ff",
    accentColor: "#5C8EE6",
  },
  {
    id: 7,
    title: "vivo X200 Pro vs Samsung Galaxy S25 Ultra: Camera King Showdown",
    excerpt: "Two 200MP camera giants go head-to-head. We tested in 14 different lighting conditions to find out which flagship truly wins the camera crown in 2025.",
    category: "Comparisons",
    time: "5 days ago",
    author: "James Wilson",
    readTime: "15 min read",
    image: vivoImg,
    bgColor: "#f0f0ff",
    accentColor: "#415FFF",
  },
  {
    id: 8,
    title: "Realme P4 Review: The $299 Phone That Punches Way Above Its Price",
    excerpt: "With a 6.7\" AMOLED display, Snapdragon 7s Gen 3, and 67W fast charging, the Realme P4 is the most compelling budget smartphone of the year.",
    category: "Reviews",
    time: "6 days ago",
    author: "Priya Mehta",
    readTime: "9 min read",
    image: realmeImg,
    bgColor: "#fff8f0",
    accentColor: "#FFD600",
    score: 87,
  },
  {
    id: 9,
    title: "How to Get the Best Camera Results from Any Android Phone in 2025",
    excerpt: "Pro tips from smartphone photographers: mastering night mode, portrait depth, and video stabilization on your Android device without expensive accessories.",
    category: "Tips & Guides",
    time: "1 week ago",
    author: "Alex Kim",
    readTime: "11 min read",
    image: googleImg,
    bgColor: "#f0f4ff",
    accentColor: "#4285F4",
  },
];

const latestReviews = [
  { name: "Samsung Galaxy S25 Ultra", score: 97, scoreColor: "bg-green-700", image: samsungImg, bgColor: "#f0f4f8", reviewer: "James W.", slug: "samsung-galaxy-s25-ultra" },
  { name: "iPhone 16 Pro Max", score: 94, scoreColor: "bg-green-700", image: iphoneImg, bgColor: "#f5f5f5", reviewer: "Sarah C.", slug: "iphone-16-pro-max" },
  { name: "OnePlus 13", score: 92, scoreColor: "bg-green-700", image: oneplusImg, bgColor: "#fff0f0", reviewer: "Mike T.", slug: "oneplus-13" },
  { name: "Xiaomi 15 Ultra", score: 96, scoreColor: "bg-green-700", image: xiaomiImg, bgColor: "#f8f3f0", reviewer: "Raj P.", slug: "xiaomi-15-ultra" },
  { name: "Realme P4", score: 87, scoreColor: "bg-amber-600", image: realmeImg, bgColor: "#fff8f0", reviewer: "Priya M.", slug: "realme-p4" },
];

const trendingTopics = [
  { icon: Camera, label: "Best Camera Phones", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: BatteryFull, label: "Fast Charging Phones", color: "text-green-500", bg: "bg-green-500/10" },
  { icon: Cpu, label: "Snapdragon 8 Elite", color: "text-purple-500", bg: "bg-purple-500/10" },
  { icon: Gamepad2, label: "Best Gaming Phones", color: "text-orange-500", bg: "bg-orange-500/10" },
  { icon: Radio, label: "5G Smartphones", color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { icon: Award, label: "Editor's Choice", color: "text-amber-500", bg: "bg-amber-500/10" },
];

const categoryColors: Record<string, string> = {
  News: "bg-blue-600",
  Reviews: "bg-green-600",
  Rumors: "bg-purple-600",
  Launches: "bg-orange-500",
  "Tips & Guides": "bg-teal-600",
  Comparisons: "bg-red-600",
};

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = articles.filter(a => {
    const matchCat = activeCategory === "All" || a.category === activeCategory;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
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
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-semibold px-4 py-1.5 rounded-full whitespace-nowrap transition-all shrink-0 ${
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Featured article */}
            {activeCategory === "All" && !search && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Flame size={15} className="text-primary" />
                  <span className="text-sm font-bold uppercase tracking-wide">Featured Story</span>
                </div>
                <Link to="/news/featured" className="glass-card rounded-2xl overflow-hidden block group hover:-translate-y-0.5 transition-all duration-300 hover:shadow-2xl">
                  <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${featuredArticle.accentColor}60, ${featuredArticle.accentColor}20, transparent)` }} />
                  <div className="flex flex-col md:flex-row">
                    <div
                      className="md:w-64 h-48 md:h-auto flex items-center justify-center shrink-0 relative overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${featuredArticle.accentColor}15, ${featuredArticle.accentColor}05)` }}
                    >
                      <img src={featuredArticle.image} alt={featuredArticle.title} className="h-full w-auto max-h-44 object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 p-4" />
                      <span className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full ${categoryColors[featuredArticle.category] || "bg-gray-600"}`}>
                        {featuredArticle.category}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col justify-between">
                      <div>
                        <h2 className="text-lg font-black group-hover:text-primary transition-colors mb-2 leading-snug">{featuredArticle.title}</h2>
                        <p className="text-sm text-muted-foreground line-clamp-3">{featuredArticle.excerpt}</p>
                      </div>
                      <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">{featuredArticle.author}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Clock size={10} />{featuredArticle.time}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><BookOpen size={10} />{featuredArticle.readTime}</span>
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
                {activeCategory !== "All" && <span> in <span className="text-primary font-semibold">{activeCategory}</span></span>}
              </p>
              {search && (
                <button onClick={() => setSearch("")} className="text-xs text-primary flex items-center gap-1 hover:underline">
                  <X size={10} /> Clear search
                </button>
              )}
            </div>

            {/* Article grid */}
            <div className="space-y-4">
              {filtered.length === 0 ? (
                <div className="glass-card rounded-2xl p-14 text-center">
                  <Newspaper size={36} className="text-muted-foreground mx-auto mb-4 opacity-40" />
                  <p className="font-bold text-lg mb-1">No articles found</p>
                  <p className="text-sm text-muted-foreground">Try a different category or search term</p>
                </div>
              ) : filtered.map(article => (
                <Link
                  key={article.id}
                  to={`/news/${article.id}`}
                  className="glass-card rounded-2xl overflow-hidden flex flex-col sm:flex-row group hover:-translate-y-0.5 transition-all duration-300 hover:shadow-xl hover:border-primary/25 block"
                >
                  <div
                    className="sm:w-40 h-36 sm:h-auto flex items-center justify-center shrink-0 relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${article.accentColor}12, ${article.accentColor}04)` }}
                  >
                    <img src={article.image} alt={article.title} className="h-28 w-auto object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-400 p-3" />
                    {article.score && (
                      <div className="absolute top-2 left-2 bg-green-700 text-white text-xs font-black px-1.5 py-0.5 rounded">
                        {article.score}
                      </div>
                    )}
                    <span className={`absolute bottom-2 left-2 text-white text-[9px] font-bold px-2 py-0.5 rounded-full ${categoryColors[article.category] || "bg-gray-600"}`}>
                      {article.category}
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
                      <span className="flex items-center gap-1"><Clock size={9} />{article.time}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><BookOpen size={9} />{article.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load more */}
            {filtered.length > 0 && (
              <div className="mt-6 glass-card rounded-2xl p-4 text-center">
                <button className="bg-primary text-primary-foreground px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg">
                  Load More Articles
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0 space-y-4">
            {/* Latest Reviews */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <h3 className="font-bold text-sm">Latest Reviews</h3>
                </div>
                <Link to="/news?cat=Reviews" className="text-primary text-xs font-semibold hover:underline">View All</Link>
              </div>
              <div className="space-y-3">
                {latestReviews.map((r, i) => (
                  <Link key={i} to={`/phone/${r.slug}`} className="flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-white/50" style={{ backgroundColor: r.bgColor }}>
                      <img src={r.image} alt={r.name} className="h-10 w-auto object-contain group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold group-hover:text-primary transition-colors line-clamp-1">{r.name}</p>
                      <p className="text-[10px] text-muted-foreground">By {r.reviewer}</p>
                    </div>
                    <div className={`${r.scoreColor} text-white text-xs font-black px-1.5 py-0.5 rounded shrink-0`}>{r.score}</div>
                  </Link>
                ))}
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
                  <Link key={i} to="/phone-finder" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/30 transition-colors group">
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
