import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight, Search, Smartphone, Grid3X3, List } from "lucide-react";

const allBrands = [
  { name: "Samsung", devices: 312, color: "#1428A0", bg: "#EEF0FA", featured: true },
  { name: "Apple", devices: 145, color: "#555555", bg: "#F5F5F5", featured: true },
  { name: "Xiaomi", devices: 284, color: "#FF6900", bg: "#FFF3EC", featured: true },
  { name: "OnePlus", devices: 93, color: "#F5010C", bg: "#FFF0F0", featured: true },
  { name: "Google", devices: 47, color: "#4285F4", bg: "#EFF4FF", featured: true },
  { name: "Motorola", devices: 198, color: "#002B5C", bg: "#EDF1F8", featured: true },
  { name: "Vivo", devices: 167, color: "#415FFF", bg: "#EEF0FF", featured: false },
  { name: "OPPO", devices: 203, color: "#1D4289", bg: "#EEF2FA", featured: false },
  { name: "Realme", devices: 178, color: "#E4A900", bg: "#FFFCE6", featured: false },
  { name: "Infinix", devices: 89, color: "#ED1C24", bg: "#FFF0F0", featured: false },
  { name: "Tecno", devices: 112, color: "#00AEEF", bg: "#E6F8FF", featured: false },
  { name: "Nokia", devices: 201, color: "#124191", bg: "#EEF2FA", featured: false },
  { name: "Huawei", devices: 256, color: "#CF0A2C", bg: "#FFF0F2", featured: false },
  { name: "Honor", devices: 134, color: "#1C1C1C", bg: "#F5F5F5", featured: false },
  { name: "Sony", devices: 88, color: "#003087", bg: "#EEF2FA", featured: false },
  { name: "LG", devices: 177, color: "#A50034", bg: "#FFF0F3", featured: false },
  { name: "Asus", devices: 207, color: "#00BCB4", bg: "#E6FAFA", featured: false },
  { name: "Lenovo", devices: 143, color: "#E2231A", bg: "#FFF0F0", featured: false },
  { name: "HTC", devices: 64, color: "#69BD45", bg: "#F0FAF0", featured: false },
  { name: "Nothing", devices: 12, color: "#1C1C1C", bg: "#F5F5F5", featured: false },
  { name: "Alcatel", devices: 414, color: "#009EDD", bg: "#E6F7FF", featured: false },
  { name: "BlackBerry", devices: 92, color: "#1C1C1C", bg: "#F5F5F5", featured: false },
  { name: "Doogee", devices: 98, color: "#FF6B00", bg: "#FFF3E6", featured: false },
  { name: "Ulefone", devices: 56, color: "#0066CC", bg: "#EEF4FF", featured: false },
  { name: "Blackview", devices: 113, color: "#2C5F8A", bg: "#EEF4FA", featured: false },
  { name: "Cubot", devices: 100, color: "#E8B400", bg: "#FFFBEE", featured: false },
  { name: "Oukitel", devices: 74, color: "#FF4500", bg: "#FFF2EE", featured: false },
  { name: "Meizu", devices: 89, color: "#1E90FF", bg: "#EEF5FF", featured: false },
  { name: "ZTE", devices: 134, color: "#E22D3F", bg: "#FFF0F1", featured: false },
  { name: "Micromax", devices: 167, color: "#E61E28", bg: "#FFF0F0", featured: false },
  { name: "Itel", devices: 78, color: "#0056A8", bg: "#EEF3FA", featured: false },
  { name: "Acer", devices: 113, color: "#83B81A", bg: "#F6FAF0", featured: false },
  { name: "Amazon", devices: 25, color: "#FF9900", bg: "#FFF8EE", featured: false },
  { name: "BLU", devices: 369, color: "#1E90FF", bg: "#EEF5FF", featured: false },
  { name: "Cat", devices: 22, color: "#FFAE00", bg: "#FFF9EE", featured: false },
  { name: "Sharp", devices: 67, color: "#1C1C1C", bg: "#F5F5F5", featured: false },
];

const samplePhones = {
  Samsung: [
    { name: "Galaxy S26 Ultra", specs: "Snapdragon 8 Elite 2 · 16GB RAM · 256GB", score: 99, color: "#1428A0" },
    { name: "Galaxy Z Fold 7", specs: "Snapdragon 8 Elite 2 · 12GB RAM · 256GB", score: 97, color: "#1428A0" },
    { name: "Galaxy A56 5G", specs: "Exynos 1580 · 8GB RAM · 128GB", score: 82, color: "#1428A0" },
    { name: "Galaxy S25+", specs: "Snapdragon 8 Elite · 12GB RAM · 256GB", score: 95, color: "#1428A0" },
    { name: "Galaxy A36 5G", specs: "Snapdragon 6 Gen 3 · 6GB RAM · 128GB", score: 74, color: "#1428A0" },
  ],
  Apple: [
    { name: "iPhone 17 Pro Max", specs: "A19 Pro · 8GB RAM · 256GB", score: 99, color: "#555" },
    { name: "iPhone 17 Pro", specs: "A19 Pro · 8GB RAM · 128GB", score: 97, color: "#555" },
    { name: "iPhone 17e", specs: "A18 · 6GB RAM · 128GB", score: 88, color: "#555" },
    { name: "iPhone 17", specs: "A19 · 8GB RAM · 128GB", score: 93, color: "#555" },
    { name: "iPhone 16 Plus", specs: "A18 · 8GB RAM · 128GB", score: 90, color: "#555" },
  ],
  Default: [
    { name: "Flagship Pro", specs: "Snapdragon 8 Gen 3 · 12GB RAM · 256GB", score: 95, color: "#555" },
    { name: "Ultra Plus", specs: "MediaTek Dimensity 9300 · 8GB RAM · 128GB", score: 87, color: "#555" },
    { name: "5G Lite", specs: "Snapdragon 6 Gen 1 · 6GB RAM · 128GB", score: 72, color: "#555" },
    { name: "Budget Pro", specs: "MediaTek Helio G99 · 6GB RAM · 128GB", score: 68, color: "#555" },
    { name: "Mid Range X", specs: "Snapdragon 7s Gen 2 · 8GB RAM · 256GB", score: 80, color: "#555" },
  ],
};

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 90 ? "bg-green-700" : score >= 75 ? "bg-amber-600" : "bg-red-600";
  return (
    <div className={`${color} text-white text-xs font-bold rounded px-2 py-1 text-center leading-tight`}>
      <div className="text-sm leading-none">{score}%</div>
      <div className="text-[9px] opacity-80">Score</div>
    </div>
  );
}

export default function BrandsPage() {
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "devices">("name");

  const filtered = allBrands
    .filter(b => b.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === "name" ? a.name.localeCompare(b.name) : b.devices - a.devices);

  const featured = filtered.filter(b => b.featured);
  const others = filtered.filter(b => !b.featured);

  const selectedBrandData = allBrands.find(b => b.name === selectedBrand);
  const phones = selectedBrand
    ? (samplePhones[selectedBrand as keyof typeof samplePhones] || samplePhones.Default.map(p => ({ ...p, color: selectedBrandData?.color || "#555" })))
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-foreground via-foreground/90 to-foreground/80 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-primary/10 rounded-full blur-2xl" />
          </div>
          <div className="max-w-screen-xl mx-auto px-4 py-10 relative z-10">
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-2">All Brands</p>
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">Mobile Phone Brands</h1>
            <p className="text-white/60 text-sm mb-6">Browse all {allBrands.length}+ brands and their complete device lineup</p>
            <div className="max-w-lg relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search brands..."
                className="w-full glass text-white placeholder-white/40 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 py-6">
          {/* View controls */}
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{filtered.length} brands found</span>
              {selectedBrand && (
                <button
                  onClick={() => setSelectedBrand(null)}
                  className="ml-2 flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full font-semibold hover:bg-primary/20 transition-colors"
                >
                  × Clear: {selectedBrand}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as "name" | "devices")}
                className="glass-card text-sm px-3 py-1.5 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground cursor-pointer"
              >
                <option value="name">Sort by Name</option>
                <option value="devices">Sort by Devices</option>
              </select>
              <div className="flex glass-card rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Featured brands */}
          {featured.length > 0 && !selectedBrand && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full inline-block" />
                Featured Brands
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {featured.map((brand, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedBrand(brand.name)}
                    className="glass-card rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 transition-all group"
                  >
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center border border-white/60"
                      style={{ backgroundColor: brand.bg + "dd" }}
                    >
                      <span className="font-black text-xs text-center leading-tight px-1" style={{ color: brand.color }}>
                        {brand.name.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{brand.name}</span>
                    <span className="text-[10px] text-muted-foreground">{brand.devices} devices</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-6">
            {/* Brands list */}
            <div className={`${selectedBrand ? "w-full md:w-1/3" : "w-full"} transition-all`}>
              {!selectedBrand && (
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full inline-block" />
                  All Brands
                </h2>
              )}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {(selectedBrand ? filtered : others).map((brand, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedBrand(brand.name === selectedBrand ? null : brand.name)}
                      className={`glass-card rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all group ${brand.name === selectedBrand ? "border-primary/50 shadow-lg bg-primary/5" : "hover:border-primary/30"}`}
                    >
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center border border-white/60"
                        style={{ backgroundColor: brand.bg + "dd" }}
                      >
                        <span className="font-black text-[10px] text-center leading-tight px-1" style={{ color: brand.color }}>
                          {brand.name.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{brand.name}</span>
                      <span className="text-[10px] text-muted-foreground">{brand.devices} devices</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-xl overflow-hidden">
                  {(selectedBrand ? filtered : others).map((brand, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedBrand(brand.name === selectedBrand ? null : brand.name)}
                      className={`w-full flex items-center gap-4 px-5 py-3.5 border-b border-border/50 last:border-0 hover:bg-primary/5 transition-colors group ${brand.name === selectedBrand ? "bg-primary/8" : ""}`}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/60 shrink-0"
                        style={{ backgroundColor: brand.bg + "dd" }}
                      >
                        <span className="font-black text-[9px] text-center leading-tight px-1" style={{ color: brand.color }}>
                          {brand.name.slice(0, 3).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-semibold group-hover:text-primary transition-colors">{brand.name}</p>
                        <p className="text-xs text-muted-foreground">{brand.devices} devices</p>
                      </div>
                      <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected brand phones */}
            {selectedBrand && (
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <span className="w-1 h-5 bg-primary rounded-full inline-block" />
                    {selectedBrand} Phones
                  </h2>
                  <a href="#" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                    View All <ChevronRight size={14} />
                  </a>
                </div>
                <div className="space-y-3">
                  {phones.map((phone, i) => (
                    <a
                      key={i}
                      href="#"
                      className="glass-card rounded-xl p-4 flex items-center gap-4 hover:shadow-lg hover:border-primary/30 transition-all group block"
                    >
                      {/* Phone silhouette */}
                      <div
                        className="w-12 h-20 rounded-xl border-2 flex flex-col items-center justify-center shrink-0"
                        style={{ borderColor: phone.color + "66", backgroundColor: phone.color + "11" }}
                      >
                        <Smartphone size={20} style={{ color: phone.color + "bb" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">{phone.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{phone.specs}</p>
                        <a href="#" className="text-primary text-xs font-semibold mt-2 inline-block hover:underline">View All Specs →</a>
                      </div>
                      <ScoreBadge score={phone.score} />
                    </a>
                  ))}
                  <a
                    href="#"
                    className="glass-card rounded-xl p-4 flex items-center justify-center gap-2 hover:border-primary/30 hover:bg-primary/5 transition-all text-primary font-semibold text-sm"
                  >
                    View All {selectedBrand} Phones <ChevronRight size={14} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
