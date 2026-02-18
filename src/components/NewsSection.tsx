import { Clock, ChevronRight } from "lucide-react";

const featuredNews = {
  time: "9 Minutes Ago",
  title: "Xiaomi 17 Ultra Leica Edition to launch globally with a new name, reveals certification",
  image: null,
  category: "Launch",
};

const sideNews = [
  {
    time: "42 Minutes Ago",
    title: "OPPO Find X9s might not be the compact flagship fans were hoping for",
    category: "Rumor",
    color: "#EEF0FA",
  },
  {
    time: "1 Hour Ago",
    title: "Infinix Note Edge launched with 3D curved display and 6,500mAh battery",
    category: "Launch",
    color: "#FFF0F0",
  },
  {
    time: "1 Hour Ago",
    title: "Google I/O 2026 dates officially revealed through Gemini-powered puzzles and mini games",
    category: "News",
    color: "#EFF4FF",
  },
  {
    time: "2 Hours Ago",
    title: "Samsung Galaxy S26 Ultra's low-light camera performance showcased in new AI video",
    category: "Review",
    color: "#FFF3EC",
  },
];

const latestReviews = [
  { title: "Samsung Galaxy S26 Ultra Review: The Ultimate Flagship", score: 95, author: "James W." },
  { title: "OnePlus 15R Review: Flagship Killer Returns", score: 88, author: "Priya M." },
  { title: "Xiaomi 17 Pro Max Review: Camera Beast Unleashed", score: 91, author: "Alex K." },
];

export default function NewsSection() {
  return (
    <section className="max-w-screen-xl mx-auto px-4 py-3">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Latest News */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Latest News</h2>
            <a href="#" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Featured article */}
            <a href="#" className="group">
              <div className="h-44 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden mb-3 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="text-6xl">📱</div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-1 text-white/70 text-xs mb-1">
                    <Clock size={10} />
                    <span>{featuredNews.time}</span>
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2">
                {featuredNews.title}
              </h3>
            </a>

            {/* Side news list */}
            <div className="space-y-3">
              {sideNews.map((item, i) => (
                <a key={i} href="#" className="flex gap-3 group">
                  <div className="w-20 h-14 rounded-lg shrink-0 flex items-center justify-center text-2xl" style={{ backgroundColor: item.color }}>
                    📰
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 text-muted-foreground text-xs mb-0.5">
                      <Clock size={9} />
                      <span>{item.time}</span>
                    </div>
                    <p className="text-xs font-medium group-hover:text-primary transition-colors line-clamp-2">{item.title}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Latest Reviews */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Latest Reviews</h2>
            <a href="#" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </a>
          </div>
          <div className="space-y-4">
            {latestReviews.map((review, i) => (
              <a key={i} href="#" className="block group">
                <div className="flex gap-3 items-start">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                    <span className="text-xl">📱</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold group-hover:text-primary transition-colors line-clamp-2 mb-1">{review.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="bg-green-700 text-white text-xs font-bold px-1.5 py-0.5 rounded">{review.score}</span>
                      <span className="text-xs text-muted-foreground">By {review.author}</span>
                    </div>
                  </div>
                </div>
                {i < latestReviews.length - 1 && <div className="border-b border-border mt-3"></div>}
              </a>
            ))}
          </div>

          {/* Deep dive section */}
          <div className="mt-5 pt-4 border-t border-border">
            <h3 className="text-sm font-bold mb-3">Deep Dive</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Camera Guide", emoji: "📸", bg: "#1a1a1a" },
                { label: "Battery Tips", emoji: "🔋", bg: "#1a3a1a" },
                { label: "5G Explained", emoji: "📡", bg: "#1a1a3a" },
                { label: "Game Zone", emoji: "🎮", bg: "#2a1a1a" },
              ].map((d, i) => (
                <a key={i} href="#" className="rounded-lg overflow-hidden h-16 flex items-end p-2 relative group" style={{ backgroundColor: d.bg }}>
                  <span className="absolute top-2 right-2 text-xl">{d.emoji}</span>
                  <span className="text-white text-xs font-bold">{d.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
