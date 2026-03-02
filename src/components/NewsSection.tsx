import { Clock, ChevronRight, Newspaper, Camera, BatteryFull, Radio, Gamepad2 } from "lucide-react";
import samsungImg from "@/assets/phones/samsung-s25-ultra.png";
import xiaomiImg from "@/assets/phones/xiaomi-15-ultra.png";
import oneplusImg from "@/assets/phones/oneplus-13.png";
import googleImg from "@/assets/phones/google-pixel-9-pro.png";

const featuredNews = {
  time: "9 Minutes Ago",
  title: "Xiaomi 17 Ultra Leica Edition to launch globally with a new name, reveals certification",
  category: "Launch",
  image: xiaomiImg,
  bgColor: "#f8f3f0",
  accentColor: "#FF6900",
};

const sideNews = [
  { time: "42 Minutes Ago", title: "OPPO Find X9s might not be the compact flagship fans were hoping for", category: "Rumor", image: null, bgColor: "#EEF0FA" },
  { time: "1 Hour Ago", title: "Infinix Note Edge launched with 3D curved display and 6,500mAh battery", category: "Launch", image: null, bgColor: "#FFF0F0" },
  { time: "1 Hour Ago", title: "Google Pixel 10 Pro spotted on Geekbench with new Tensor G5 chip", category: "News", image: googleImg, bgColor: "#EFF4FF" },
  { time: "2 Hours Ago", title: "Samsung Galaxy S26 Ultra's low-light camera performance showcased in new AI video", category: "Review", image: samsungImg, bgColor: "#EEF0FA" },
];

const latestReviews = [
  { title: "Samsung Galaxy S25 Ultra Review: The Ultimate Flagship", score: 97, author: "James W.", image: samsungImg, bgColor: "#f0f4f8" },
  { title: "OnePlus 13 Review: Flagship Killer Returns", score: 94, author: "Priya M.", image: oneplusImg, bgColor: "#fff0f0" },
  { title: "Xiaomi 15 Ultra Review: Camera Beast Unleashed", score: 98, author: "Alex K.", image: xiaomiImg, bgColor: "#f8f3f0" },
];

const deepDiveItems = [
  { label: "Camera Guide", Icon: Camera, bg: "from-slate-800 to-slate-900" },
  { label: "Battery Tips", Icon: BatteryFull, bg: "from-green-900 to-emerald-800" },
  { label: "5G Explained", Icon: Radio, bg: "from-blue-900 to-indigo-800" },
  { label: "Game Zone", Icon: Gamepad2, bg: "from-purple-900 to-violet-800" },
];

const categoryColors: Record<string, string> = {
  Launch: "bg-green-600",
  Rumor: "bg-purple-600",
  News: "bg-blue-600",
  Review: "bg-orange-500",
};

export default function NewsSection() {
  return (
    <section className="px-4 py-3">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Latest News */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Latest News</h2>
            <a href="#" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Featured article */}
            <a href="#" className="group">
              <div
                className="h-44 rounded-xl relative overflow-hidden mb-3 flex items-center justify-center"
                style={{ backgroundColor: featuredNews.bgColor }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10"></div>
                <img
                  src={featuredNews.image}
                  alt={featuredNews.title}
                  className="h-40 w-auto object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-3 left-3 right-3 z-20">
                  <span className={`text-white text-[10px] font-bold px-2 py-0.5 rounded ${categoryColors[featuredNews.category] || "bg-gray-600"} mb-1 inline-block`}>
                    {featuredNews.category}
                  </span>
                  <div className="flex items-center gap-1 text-white/70 text-xs">
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
                  <div
                    className="w-20 h-14 rounded-lg shrink-0 flex items-center justify-center border border-white/60 overflow-hidden"
                    style={{ backgroundColor: item.bgColor }}
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="h-12 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-200" />
                    ) : (
                      <Newspaper size={20} className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {item.category && (
                        <span className={`text-white text-[9px] font-bold px-1.5 py-0.5 rounded ${categoryColors[item.category] || "bg-gray-600"}`}>
                          {item.category}
                        </span>
                      )}
                      <span className="text-muted-foreground text-[10px] flex items-center gap-0.5">
                        <Clock size={9} />{item.time}
                      </span>
                    </div>
                    <p className="text-xs font-medium group-hover:text-primary transition-colors line-clamp-2">{item.title}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Latest Reviews */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Latest Reviews</h2>
            <a href="#" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </a>
          </div>
          <div className="space-y-4">
            {latestReviews.map((review, i) => (
              <a key={i} href="#" className="block group">
                <div className="flex gap-3 items-center">
                  <div
                    className="w-14 h-14 rounded-xl shrink-0 flex items-center justify-center overflow-hidden border border-white/60"
                    style={{ backgroundColor: review.bgColor }}
                  >
                    <img
                      src={review.image}
                      alt={review.title}
                      className="h-12 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold group-hover:text-primary transition-colors line-clamp-2 mb-1">{review.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="bg-green-700 text-white text-xs font-bold px-1.5 py-0.5 rounded">{review.score}</span>
                      <span className="text-xs text-muted-foreground">By {review.author}</span>
                    </div>
                  </div>
                </div>
                {i < latestReviews.length - 1 && <div className="border-b border-border/50 mt-3"></div>}
              </a>
            ))}
          </div>

          {/* Deep dive section */}
          <div className="mt-5 pt-4 border-t border-border/50">
            <h3 className="text-sm font-bold mb-3">Deep Dive</h3>
            <div className="grid grid-cols-2 gap-2">
              {deepDiveItems.map((d, i) => (
                <a key={i} href="#" className={`bg-gradient-to-br ${d.bg} rounded-lg overflow-hidden h-16 flex items-end p-2 relative group border border-white/10 hover:border-white/20 transition-all`}>
                  <div className="absolute top-2 right-2 glass rounded-lg p-1">
                    <d.Icon size={14} className="text-white/90" />
                  </div>
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
