import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ChevronRight, Search, Smartphone, Grid3X3, List, X,
  Cpu, MemoryStick, Camera, Battery, Monitor, Star,
  ArrowLeft, SlidersHorizontal, ExternalLink, GitCompare,
  Loader2, AlertCircle
} from "lucide-react";
import { getBrands, getDevices, Brand, Device } from "@/lib/api";

// â”€â”€â”€ Brand accent colors â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const BRAND_COLORS: Record<string, string> = {
  Samsung: "#1428A0", Apple: "#888888", Xiaomi: "#FF6900", OnePlus: "#F5010C",
  Google: "#4285F4", Motorola: "#5C8EE6", Vivo: "#415FFF", OPPO: "#1D7FEE",
  Realme: "#FFD600", Huawei: "#CF0A2C", Sony: "#aaaaaa", Nokia: "#4BA3DA",
  Honor: "#c0c0c0", Asus: "#00BCB4", LG: "#A50034", Lenovo: "#E2231A",
  Nothing: "#cccccc", ZTE: "#E22D3F", HTC: "#69BD45", Acer: "#83B81A",
  BlackBerry: "#bbbbbb", Infinix: "#ED1C24", Tecno: "#00AEEF",
  Amazon: "#FF9900", Alcatel: "#009EDD", Sharp: "#aaaaaa", Meizu: "#1E90FF",
};
const BRAND_LOGOS: Record<string, string> = {
  Samsung: "https://cdn.simpleicons.org/samsung/1428A0",
  Apple: "https://cdn.simpleicons.org/apple/888888",
  Xiaomi: "https://cdn.simpleicons.org/xiaomi/FF6900",
  OnePlus: "https://cdn.simpleicons.org/oneplus/F5010C",
  Google: "https://cdn.simpleicons.org/google/4285F4",
  Motorola: "https://cdn.simpleicons.org/motorola/5C8EE6",
  Vivo: "https://cdn.simpleicons.org/vivo/415FFF",
  OPPO: "https://cdn.simpleicons.org/oppo/1D7FEE",
  Huawei: "https://cdn.simpleicons.org/huawei/CF0A2C",
  Sony: "https://cdn.simpleicons.org/sony/aaaaaa",
  Nokia: "https://cdn.simpleicons.org/nokia/4BA3DA",
  Asus: "https://cdn.simpleicons.org/asus/00BCB4",
  LG: "https://cdn.simpleicons.org/lg/A50034",
  Lenovo: "https://cdn.simpleicons.org/lenovo/E2231A",
  Amazon: "https://cdn.simpleicons.org/amazon/FF9900",
};
const FEATURED_BRANDS = ["Samsung", "Apple", "Xiaomi", "OnePlus", "Google", "Motorola"];
function bColor(name: string) { return BRAND_COLORS[name] || "#ff6e14"; }

// â”€â”€â”€ BrandLogo â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function BrandLogo({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" | "xl" }) {
  const color = bColor(name);
  const logo = BRAND_LOGOS[name];
  const dims = { sm: "w-10 h-10", md: "w-14 h-14", lg: "w-20 h-20", xl: "w-28 h-28" }[size];
  const imgDims = { sm: "w-6 h-6", md: "w-8 h-8", lg: "w-11 h-11", xl: "w-16 h-16" }[size];
  const fontSize = size === "xl" ? "18px" : size === "lg" ? "13px" : "11px";
  return (
    <div className={`${dims} rounded-2xl flex items-center justify-center relative overflow-hidden shrink-0`}
      style={{ background: `linear-gradient(135deg, ${color}22, ${color}08)`, border: `1.5px solid ${color}35` }}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 30% 30%, ${color}28, transparent 65%)` }} />
      {logo
        ? <img src={logo} alt={name} className={`${imgDims} object-contain relative z-10`} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        : <span className="font-black relative z-10" style={{ color, fontSize }}>{name.slice(0, 3).toUpperCase()}</span>
      }
    </div>
  );
}

// â”€â”€â”€ Brand phones panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function BrandPhones({ brandName, onBack }: { brandName: string; onBack: () => void }) {
  const [phones, setPhones] = useState<Device[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const color = bColor(brandName);

  useEffect(() => {
    setLoading(true);
    getDevices({ brand: brandName, limit: 20, sort: "rating" })
      .then(r => { setPhones(r.devices); setTotal(r.total); })
      .catch(() => setPhones([]))
      .finally(() => setLoading(false));
  }, [brandName]);

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl mb-6"
        style={{ background: `linear-gradient(135deg, ${color}25, ${color}10 50%, transparent)`, border: `1px solid ${color}30` }}>
        <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: color }} />
        <div className="relative z-10 p-6 sm:p-8">
          <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6 group">
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" /> All Brands
          </button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <BrandLogo name={brandName} size="xl" />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{brandName}</h1>
                <span className="glass border px-3 py-1 rounded-full text-xs font-bold" style={{ borderColor: color + "40", color }}>{total} Devices</span>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <Link to={`/phone-finder?brand=${encodeURIComponent(brandName)}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 shadow-lg"
                  style={{ background: color }}>
                  Browse All {brandName} <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={13} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Showing <span className="font-bold text-foreground">{phones.length}</span> of {total} phones</span>
        </div>
      </div>

      {loading ? (
        <div className="glass-card rounded-2xl p-14 text-center">
          <Loader2 size={36} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading {brandName} phones...</p>
        </div>
      ) : phones.length === 0 ? (
        <div className="glass-card rounded-2xl p-14 text-center">
          <AlertCircle size={36} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">No phones found for {brandName} in the database yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {phones.map((phone) => (
            <Link key={phone.slug} to={`/phone/${phone.slug}`}
              className="glass-card rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 hover:border-primary/25 transition-all duration-300 group block">
              <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${color}60, ${color}20, transparent)` }} />
              <div className="relative h-48 flex items-center justify-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}12, ${color}04)` }}>
                {phone.rating && (
                  <div className="absolute top-2 left-2 z-10 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-lg px-2 py-1 text-center shadow-lg">
                    <div className="text-xs font-black leading-none">{parseFloat(phone.rating).toFixed(1)}</div>
                    <div className="text-[8px] font-semibold opacity-90">Rating</div>
                  </div>
                )}
                <img src={phone.thumbnail} alt={phone.name}
                  className="h-full w-auto max-w-[65%] object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-xl"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/120x160?text=No+Image"; }} />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2.5">
                  <div className="min-w-0">
                    <h3 className="font-black text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">{phone.name}</h3>
                    {phone.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star size={10} className="text-amber-500 fill-amber-500" />
                        <span className="text-xs font-semibold">{parseFloat(phone.rating).toFixed(1)}</span>
                        {phone.fans && <span className="text-xs text-muted-foreground">· {phone.fans} fans</span>}
                      </div>
                    )}
                  </div>
                  {phone.announced && <span className="text-[10px] text-muted-foreground ml-2 shrink-0">{phone.announced.split(',')[0]}</span>}
                </div>
                <div className="grid grid-cols-2 gap-1.5 mb-3">
                  {[
                    { icon: Cpu,         label: phone.chipset },
                    { icon: MemoryStick, label: phone.ram },
                    { icon: Camera,      label: phone.main_camera?.split(',')[0] },
                    { icon: Battery,     label: phone.battery },
                    { icon: Monitor,     label: phone.display_size },
                  ].filter(s => s.label).slice(0, 4).map((s, j) => (
                    <div key={j} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <div className="w-4 h-4 glass rounded-md flex items-center justify-center shrink-0"><s.icon size={9} className="text-primary/70" /></div>
                      <span className="line-clamp-1">{s.label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-2.5 border-t border-white/8">
                  <span className="flex-1 text-center text-primary text-xs font-bold flex items-center justify-center gap-1">View Specs <ChevronRight size={11} /></span>
                  <Link to="/compare" onClick={e => e.stopPropagation()} className="glass border border-white/10 text-xs font-semibold px-2.5 py-1 rounded-lg hover:border-primary/30 transition-all text-muted-foreground hover:text-primary flex items-center gap-1">
                    <GitCompare size={10} /> Compare
                  </Link>
                  <a href={`https://www.amazon.com/s?k=${encodeURIComponent(brandName + " " + phone.name)}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="glass border border-white/10 text-xs font-semibold px-2.5 py-1 rounded-lg hover:border-primary/30 transition-all text-muted-foreground hover:text-primary flex items-center gap-1">
                    <ExternalLink size={10} /> Buy
                  </a>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {total > 20 && (
        <div className="mt-6 glass-card rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="font-bold">See all {brandName} phones</p>
            <p className="text-xs text-muted-foreground">{total} devices in our database</p>
          </div>
          <Link to={`/phone-finder?brand=${encodeURIComponent(brandName)}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 shadow-lg"
            style={{ background: color }}>
            Browse All <ChevronRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function BrandsPage() {
  const [searchParams] = useSearchParams();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(searchParams.get("brand"));
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "devices">("devices");

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try { const data = await getBrands(); setBrands(data); }
    catch { setBrands([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchBrands(); }, [fetchBrands]);

  const filtered = brands
    .filter(b => b.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === "name" ? a.name.localeCompare(b.name) : b.device_count - a.device_count);

  const featured = filtered.filter(b => FEATURED_BRANDS.includes(b.name));
  const others = filtered.filter(b => !FEATURED_BRANDS.includes(b.name));

  return (
    <div className="min-h-screen page-bg">
      <Navbar />
      <main>
        <div className="relative bg-gradient-to-br from-foreground via-foreground/95 to-foreground/85 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 right-1/4 w-60 h-60 bg-primary/10 rounded-full blur-2xl" />
          </div>
          <div className="px-4 py-10 relative z-10">
            {selectedBrand ? (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <button onClick={() => setSelectedBrand(null)} className="text-white/50 hover:text-white text-xs font-medium transition-colors flex items-center gap-1">
                    <ArrowLeft size={12} /> Brands
                  </button>
                  <span className="text-white/30">/</span>
                  <span className="text-primary text-xs font-bold">{selectedBrand}</span>
                </div>
                <h1 className="text-white text-3xl md:text-4xl font-black">{selectedBrand} Phones</h1>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-primary text-xs font-bold uppercase tracking-widest">Directory</span>
                  <div className="h-px w-12 bg-primary/40" />
                </div>
                <h1 className="text-white text-3xl md:text-4xl font-black mb-2">Mobile Brands</h1>
                <p className="text-white/50 text-sm mb-6">Browse {loading ? "..." : brands.length}+ brands and explore their complete device lineup</p>
                <div className="max-w-md relative">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search brand name..."
                    className="w-full glass border border-white/15 text-white placeholder-white/30 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/30 transition-all" />
                  {search && (
                    <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 py-6">
          {selectedBrand ? (
            <BrandPhones brandName={selectedBrand} onBack={() => setSelectedBrand(null)} />
          ) : loading ? (
            <div className="glass-card rounded-2xl p-14 text-center">
              <Loader2 size={36} className="animate-spin text-primary mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Loading brands from database...</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <span className="text-sm text-muted-foreground"><span className="font-bold text-foreground">{filtered.length}</span> brands</span>
                <div className="flex items-center gap-2">
                  <select value={sortBy} onChange={e => setSortBy(e.target.value as "name" | "devices")}
                    className="glass-card text-xs px-3 py-1.5 rounded-lg border-0 focus:outline-none text-foreground cursor-pointer bg-transparent">
                    <option value="devices">Most Devices</option>
                    <option value="name">Aâ€“Z</option>
                  </select>
                  <div className="flex glass-card rounded-lg overflow-hidden border border-white/10">
                    <button onClick={() => setViewMode("grid")} className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}><Grid3X3 size={14} /></button>
                    <button onClick={() => setViewMode("list")} className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}><List size={14} /></button>
                  </div>
                </div>
              </div>

              {featured.length > 0 && !search && (
                <div className="mb-8">
                  <h2 className="text-base font-bold mb-4 flex items-center gap-2"><span className="w-1 h-5 bg-primary rounded-full" />Featured Brands</h2>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {featured.map((brand) => (
                      <button key={brand.name} onClick={() => setSelectedBrand(brand.name)}
                        className="glass-card rounded-2xl p-4 flex flex-col items-center gap-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                          style={{ background: `radial-gradient(circle at 50% 30%, ${bColor(brand.name)}18, transparent 70%)` }} />
                        <BrandLogo name={brand.name} size="md" />
                        <div className="relative z-10 text-center">
                          <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{brand.name}</p>
                          <p className="text-[10px] text-muted-foreground">{brand.device_count} devices</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full" />
                  {search ? `Results for "${search}"` : "All Brands"}
                </h2>
                {filtered.length === 0 ? (
                  <div className="glass-card rounded-2xl p-14 text-center">
                    <Smartphone size={36} className="text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">No brands match "{search}"</p>
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {(search ? filtered : others).map((brand) => (
                      <button key={brand.name} onClick={() => setSelectedBrand(brand.name)}
                        className="glass-card rounded-xl p-3.5 flex flex-col items-center gap-2.5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group relative overflow-hidden">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ background: `radial-gradient(circle at 50% 30%, ${bColor(brand.name)}12, transparent 70%)` }} />
                        <BrandLogo name={brand.name} size="sm" />
                        <div className="relative z-10 text-center">
                          <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{brand.name}</p>
                          <p className="text-[10px] text-muted-foreground">{brand.device_count} devices</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="glass-card rounded-xl overflow-hidden">
                    {(search ? filtered : others).map((brand) => (
                      <button key={brand.name} onClick={() => setSelectedBrand(brand.name)}
                        className="w-full flex items-center gap-4 px-4 py-3.5 border-b border-white/8 last:border-0 hover:bg-primary/5 transition-colors group">
                        <BrandLogo name={brand.name} size="sm" />
                        <div className="flex-1 text-left">
                          <p className="text-sm font-semibold group-hover:text-primary transition-colors">{brand.name}</p>
                          <p className="text-xs text-muted-foreground">{brand.device_count} devices</p>
                        </div>
                        <ChevronRight size={13} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

