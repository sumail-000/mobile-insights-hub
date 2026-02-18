import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight, Search, Smartphone, Grid3X3, List, X } from "lucide-react";

const allBrands = [
  { name: "Samsung", devices: 312, color: "#1428A0", logo: "https://cdn.simpleicons.org/samsung/1428A0", featured: true },
  { name: "Apple", devices: 145, color: "#888888", logo: "https://cdn.simpleicons.org/apple/888888", featured: true },
  { name: "Xiaomi", devices: 284, color: "#FF6900", logo: "https://cdn.simpleicons.org/xiaomi/FF6900", featured: true },
  { name: "OnePlus", devices: 93, color: "#F5010C", logo: "https://cdn.simpleicons.org/oneplus/F5010C", featured: true },
  { name: "Google", devices: 47, color: "#4285F4", logo: "https://cdn.simpleicons.org/google/4285F4", featured: true },
  { name: "Motorola", devices: 198, color: "#5C8EE6", logo: "https://cdn.simpleicons.org/motorola/5C8EE6", featured: true },
  { name: "Vivo", devices: 167, color: "#415FFF", logo: "https://cdn.simpleicons.org/vivo/415FFF", featured: false },
  { name: "OPPO", devices: 203, color: "#1D4289", logo: "https://cdn.simpleicons.org/oppo/1D4289", featured: false },
  { name: "Realme", devices: 178, color: "#FFD600", logo: "https://cdn.simpleicons.org/realme/FFD600", featured: false },
  { name: "Huawei", devices: 256, color: "#CF0A2C", logo: "https://cdn.simpleicons.org/huawei/CF0A2C", featured: false },
  { name: "Sony", devices: 88, color: "#aaaaaa", logo: "https://cdn.simpleicons.org/sony/aaaaaa", featured: false },
  { name: "Nokia", devices: 201, color: "#4BA3DA", logo: "https://cdn.simpleicons.org/nokia/4BA3DA", featured: false },
  { name: "Honor", devices: 134, color: "#d0d0d0", logo: "https://cdn.simpleicons.org/honor/d0d0d0", featured: false },
  { name: "Asus", devices: 207, color: "#00BCB4", logo: "https://cdn.simpleicons.org/asus/00BCB4", featured: false },
  { name: "LG", devices: 177, color: "#A50034", logo: "https://cdn.simpleicons.org/lg/A50034", featured: false },
  { name: "Lenovo", devices: 143, color: "#E2231A", logo: "https://cdn.simpleicons.org/lenovo/E2231A", featured: false },
  { name: "BlackBerry", devices: 92, color: "#bbbbbb", logo: "https://cdn.simpleicons.org/blackberry/bbbbbb", featured: false },
  { name: "Nothing", devices: 12, color: "#cccccc", logo: "https://cdn.simpleicons.org/nothing/cccccc", featured: false },
  { name: "Infinix", devices: 89, color: "#ED1C24", logo: null, featured: false },
  { name: "Tecno", devices: 112, color: "#00AEEF", logo: null, featured: false },
  { name: "ZTE", devices: 134, color: "#E22D3F", logo: "https://cdn.simpleicons.org/zte/E22D3F", featured: false },
  { name: "HTC", devices: 64, color: "#69BD45", logo: "https://cdn.simpleicons.org/htc/69BD45", featured: false },
  { name: "Acer", devices: 113, color: "#83B81A", logo: "https://cdn.simpleicons.org/acer/83B81A", featured: false },
  { name: "Amazon", devices: 25, color: "#FF9900", logo: "https://cdn.simpleicons.org/amazon/FF9900", featured: false },
  { name: "Sharp", devices: 67, color: "#aaaaaa", logo: null, featured: false },
  { name: "Micromax", devices: 167, color: "#E61E28", logo: null, featured: false },
  { name: "Alcatel", devices: 414, color: "#009EDD", logo: null, featured: false },
  { name: "Meizu", devices: 89, color: "#1E90FF", logo: null, featured: false },
  { name: "Doogee", devices: 98, color: "#FF6B00", logo: null, featured: false },
  { name: "Cat", devices: 22, color: "#FFAE00", logo: null, featured: false },
  { name: "BLU", devices: 369, color: "#1E90FF", logo: null, featured: false },
  { name: "Oukitel", devices: 74, color: "#FF4500", logo: null, featured: false },
  { name: "Ulefone", devices: 56, color: "#0066CC", logo: null, featured: false },
  { name: "Blackview", devices: 113, color: "#2C5F8A", logo: null, featured: false },
  { name: "Itel", devices: 78, color: "#0056A8", logo: null, featured: false },
];

const samplePhones = {
  Samsung: [
    { name: "Galaxy S26 Ultra", specs: "Snapdragon 8 Elite 2 · 16GB · 256GB", score: 99 },
    { name: "Galaxy Z Fold 7", specs: "Snapdragon 8 Elite 2 · 12GB · 256GB", score: 97 },
    { name: "Galaxy A56 5G", specs: "Exynos 1580 · 8GB · 128GB", score: 82 },
    { name: "Galaxy S25+", specs: "Snapdragon 8 Elite · 12GB · 256GB", score: 95 },
    { name: "Galaxy A36 5G", specs: "Snapdragon 6 Gen 3 · 6GB · 128GB", score: 74 },
  ],
  Apple: [
    { name: "iPhone 17 Pro Max", specs: "A19 Pro · 8GB · 256GB", score: 99 },
    { name: "iPhone 17 Pro", specs: "A19 Pro · 8GB · 128GB", score: 97 },
    { name: "iPhone 17e", specs: "A18 · 6GB · 128GB", score: 88 },
    { name: "iPhone 17", specs: "A19 · 8GB · 128GB", score: 93 },
    { name: "iPhone 16 Plus", specs: "A18 · 8GB · 128GB", score: 90 },
  ],
  Default: [
    { name: "Flagship Pro Ultra", specs: "Snapdragon 8 Gen 3 · 12GB · 256GB", score: 95 },
    { name: "Mid Range X5", specs: "Dimensity 9300 · 8GB · 128GB", score: 87 },
    { name: "5G Lite Edition", specs: "Snapdragon 6 Gen 1 · 6GB · 128GB", score: 72 },
    { name: "Budget Pro Max", specs: "Helio G99 · 6GB · 128GB", score: 68 },
    { name: "Power Series V2", specs: "Snapdragon 7s Gen 2 · 8GB · 256GB", score: 80 },
  ],
};

function ScoreBadge({ score }: { score: number }) {
  const bg = score >= 90 ? "from-green-600 to-green-700" : score >= 75 ? "from-amber-500 to-amber-600" : "from-red-500 to-red-600";
  return (
    <div className={`bg-gradient-to-br ${bg} text-white rounded-lg px-2 py-1.5 text-center shadow-lg shrink-0`}>
      <div className="text-sm font-black leading-none">{score}%</div>
      <div className="text-[8px] font-semibold opacity-90 leading-tight">Spec<br />Score</div>
    </div>
  );
}

function BrandLogo({ brand, size = "md" }: { brand: typeof allBrands[0]; size?: "sm" | "md" | "lg" }) {
  const dims = size === "lg" ? "w-16 h-16" : size === "md" ? "w-12 h-12" : "w-9 h-9";
  const imgDims = size === "lg" ? "w-10 h-10" : size === "md" ? "w-7 h-7" : "w-5 h-5";

  return (
    <div
      className={`${dims} rounded-xl flex items-center justify-center relative overflow-hidden shrink-0`}
      style={{
        background: `linear-gradient(135deg, ${brand.color}20 0%, ${brand.color}08 100%)`,
        border: `1px solid ${brand.color}35`,
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{ background: `radial-gradient(circle at 30% 30%, ${brand.color}30, transparent 70%)` }}
      />
      {brand.logo ? (
        <img
          src={brand.logo}
          alt={brand.name}
          className={`${imgDims} object-contain relative z-10`}
          onError={(e) => {
            e.currentTarget.style.display = "none";
            const parent = e.currentTarget.parentElement;
            if (parent && !parent.querySelector("span")) {
              const span = document.createElement("span");
              span.style.color = brand.color;
              span.style.fontWeight = "900";
              span.style.fontSize = "11px";
              span.style.position = "relative";
              span.style.zIndex = "10";
              span.textContent = brand.name.slice(0, 3).toUpperCase();
              parent.appendChild(span);
            }
          }}
        />
      ) : (
        <span
          className="font-black text-[11px] relative z-10"
          style={{ color: brand.color }}
        >
          {brand.name.slice(0, 3).toUpperCase()}
        </span>
      )}
    </div>
  );
}

export default function BrandsPage() {
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "devices">("devices");

  const filtered = allBrands
    .filter(b => b.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === "name" ? a.name.localeCompare(b.name) : b.devices - a.devices);

  const featured = filtered.filter(b => b.featured);
  const others = filtered.filter(b => !b.featured);

  const selectedBrandData = allBrands.find(b => b.name === selectedBrand);
  const phones = selectedBrand
    ? (samplePhones[selectedBrand as keyof typeof samplePhones] || samplePhones.Default)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-foreground via-foreground/95 to-foreground/85 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 right-1/4 w-60 h-60 bg-primary/10 rounded-full blur-2xl" />
          </div>
          <div className="max-w-screen-xl mx-auto px-4 py-10 relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary text-xs font-bold uppercase tracking-widest">Directory</span>
              <div className="h-px w-12 bg-primary/40" />
            </div>
            <h1 className="text-white text-3xl md:text-4xl font-black mb-2">Mobile Brands</h1>
            <p className="text-white/50 text-sm mb-6">Browse {allBrands.length}+ brands and explore their complete device lineup</p>
            <div className="max-w-md relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search brand name..."
                className="w-full glass border border-white/15 text-white placeholder-white/30 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/30 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 py-6">
          {/* Controls */}
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{filtered.length}</span> brands
              </span>
              {selectedBrand && (
                <button
                  onClick={() => setSelectedBrand(null)}
                  className="flex items-center gap-1.5 bg-primary/10 border border-primary/25 text-primary text-xs px-3 py-1.5 rounded-full font-semibold hover:bg-primary/20 transition-colors"
                >
                  <X size={10} /> {selectedBrand}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as "name" | "devices")}
                className="glass-card text-xs px-3 py-1.5 rounded-lg border-0 focus:outline-none text-foreground cursor-pointer"
              >
                <option value="devices">Most Devices</option>
                <option value="name">A–Z</option>
              </select>
              <div className="flex glass-card rounded-lg overflow-hidden border border-white/10">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Grid3X3 size={14} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <List size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Featured Brands */}
          {featured.length > 0 && !selectedBrand && !search && (
            <div className="mb-8">
              <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full inline-block" />
                Featured Brands
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {featured.map((brand, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedBrand(brand.name)}
                    className="glass-card rounded-2xl p-4 flex flex-col items-center gap-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                    style={{ border: selectedBrand === brand.name ? `1px solid ${brand.color}60` : undefined }}
                  >
                    {/* Glow BG */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `radial-gradient(circle at 50% 30%, ${brand.color}15, transparent 70%)` }}
                    />
                    <BrandLogo brand={brand} size="md" />
                    <div className="relative z-10 text-center">
                      <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{brand.name}</p>
                      <p className="text-[10px] text-muted-foreground">{brand.devices} devices</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-6">
            {/* Brand grid/list */}
            <div className={`${selectedBrand ? "hidden md:block w-1/3 shrink-0" : "w-full"} transition-all`}>
              {!selectedBrand && (
                <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full inline-block" />
                  All Brands
                </h2>
              )}

              {viewMode === "grid" ? (
                <div className={`grid gap-3 ${selectedBrand ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"}`}>
                  {(selectedBrand ? filtered : others).map((brand, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedBrand(brand.name === selectedBrand ? null : brand.name)}
                      className="glass-card rounded-xl p-3.5 flex flex-col items-center gap-2.5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group relative overflow-hidden"
                      style={{
                        border: brand.name === selectedBrand ? `1px solid ${brand.color}50` : undefined,
                        background: brand.name === selectedBrand ? `${brand.color}0a` : undefined,
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: `radial-gradient(circle at 50% 30%, ${brand.color}12, transparent 70%)` }}
                      />
                      <BrandLogo brand={brand} size="sm" />
                      <div className="relative z-10 text-center">
                        <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{brand.name}</p>
                        <p className="text-[10px] text-muted-foreground">{brand.devices} devices</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-xl overflow-hidden">
                  {(selectedBrand ? filtered : others).map((brand, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedBrand(brand.name === selectedBrand ? null : brand.name)}
                      className="w-full flex items-center gap-3 px-4 py-3 border-b border-white/8 last:border-0 hover:bg-primary/5 transition-colors group"
                      style={{ background: brand.name === selectedBrand ? `${brand.color}0a` : undefined }}
                    >
                      <BrandLogo brand={brand} size="sm" />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-semibold group-hover:text-primary transition-colors">{brand.name}</p>
                        <p className="text-xs text-muted-foreground">{brand.devices} devices</p>
                      </div>
                      <ChevronRight size={13} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected brand phone list */}
            {selectedBrand && selectedBrandData && (
              <div className="flex-1 min-w-0">
                {/* Brand header card */}
                <div
                  className="glass-card rounded-2xl p-5 mb-4 flex items-center gap-4 relative overflow-hidden"
                  style={{ border: `1px solid ${selectedBrandData.color}30` }}
                >
                  <div
                    className="absolute inset-0 opacity-60"
                    style={{ background: `radial-gradient(ellipse at 0% 50%, ${selectedBrandData.color}18, transparent 60%)` }}
                  />
                  <BrandLogo brand={selectedBrandData} size="lg" />
                  <div className="relative z-10">
                    <h2 className="text-xl font-black">{selectedBrandData.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedBrandData.devices} devices in database</p>
                  </div>
                  <button
                    onClick={() => setSelectedBrand(null)}
                    className="ml-auto relative z-10 glass rounded-lg p-1.5 hover:border-primary/30 transition-colors md:hidden"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <span className="w-1 h-4 bg-primary rounded-full" />
                    Latest {selectedBrand} Phones
                  </h3>
                  <a href="#" className="text-primary text-xs font-semibold hover:underline flex items-center gap-1">
                    View All <ChevronRight size={12} />
                  </a>
                </div>

                <div className="space-y-3">
                  {phones.map((phone, i) => (
                    <a
                      key={i}
                      href="#"
                      className="glass-card rounded-xl p-4 flex items-center gap-4 hover:shadow-lg hover:border-primary/25 hover:-translate-y-0.5 transition-all duration-200 group block"
                    >
                      {/* Phone silhouette */}
                      <div
                        className="w-10 h-16 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${selectedBrandData.color}20, ${selectedBrandData.color}08)`,
                          border: `1px solid ${selectedBrandData.color}30`,
                        }}
                      >
                        <Smartphone size={18} style={{ color: selectedBrandData.color + "cc" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{phone.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{phone.specs}</p>
                        <span className="text-primary text-xs font-semibold mt-1.5 inline-flex items-center gap-1 hover:underline">
                          View Specs <ChevronRight size={10} />
                        </span>
                      </div>
                      <ScoreBadge score={phone.score} />
                    </a>
                  ))}

                  <a
                    href="#"
                    className="glass-card rounded-xl p-3.5 flex items-center justify-center gap-2 hover:border-primary/30 hover:bg-primary/5 transition-all text-primary font-bold text-sm"
                  >
                    All {selectedBrand} Phones <ChevronRight size={14} />
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
