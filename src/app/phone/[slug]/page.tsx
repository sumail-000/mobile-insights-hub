"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ChevronRight, Star, GitCompare, Heart, Share2,
  Monitor, Cpu, MemoryStick, Camera, Battery, Wifi, Smartphone,
  ExternalLink, ArrowLeft, Shield, Globe, Bluetooth, Nfc, Loader2, AlertCircle
} from "lucide-react";
import { getDevice } from "@/lib/api";
import type { Device } from "@/lib/api";
import { wishlist as wishlistAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-white/5 last:border-0">
      <td className="py-3 pr-4 text-xs text-muted-foreground font-medium w-36 align-top">{label}</td>
      <td className="py-3 text-sm text-foreground font-medium leading-relaxed whitespace-pre-line">{value}</td>
    </tr>
  );
}

function SpecSection({ category, color, rows }: { category: string; color: string; rows: { label: string; value: string }[] }) {
  return (
    <div className="glass-card rounded-xl overflow-hidden mb-3">
      <div className="px-5 py-3 flex items-center gap-2" style={{ backgroundColor: color + "18", borderBottom: `2px solid ${color}40` }}>
        <div className="w-1 h-5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-sm font-bold tracking-wider uppercase" style={{ color }}>{category}</span>
      </div>
      <div className="px-5 pb-1">
        <table className="w-full">
          <tbody>{rows.map((row, i) => <SpecRow key={i} label={row.label} value={row.value} />)}</tbody>
        </table>
      </div>
    </div>
  );
}

const CAT_COLORS: Record<string, string> = {
  NETWORK: "#E53E3E", LAUNCH: "#DD6B20", BODY: "#38A169", DISPLAY: "#3182CE",
  PLATFORM: "#805AD5", MEMORY: "#D69E2E", "MAIN CAMERA": "#2B6CB0",
  "SELFIE CAMERA": "#C05621", SOUND: "#2C7A7B", COMMS: "#2D3748",
  FEATURES: "#553C9A", BATTERY: "#276749", MISC: "#744210",
};

function buildSpecSections(phone: Device) {
  if (phone.full_specs_json) {
    try {
      const parsed = typeof phone.full_specs_json === "string" ? JSON.parse(phone.full_specs_json) : phone.full_specs_json;
      if (Array.isArray(parsed)) {
        return parsed.map((section: { category?: string; title?: string; specs?: { label: string; value: string }[] }) => ({
          category: (section.category || section.title || "INFO").toUpperCase(),
          color: CAT_COLORS[(section.category || section.title || "").toUpperCase()] || "#6B7280",
          rows: (section.specs || []).map((s: { label: string; value: string }) => ({
            label: s.label,
            value: Array.isArray(s.value) ? s.value.join(", ") : String(s.value || ""),
          })),
        }));
      }
    } catch { /* fall through */ }
  }
  const sections: { category: string; color: string; rows: { label: string; value: string }[] }[] = [];
  if (phone.network) sections.push({ category: "NETWORK", color: CAT_COLORS.NETWORK, rows: [{ label: "Technology", value: phone.network }] });
  if (phone.announced) sections.push({ category: "LAUNCH", color: CAT_COLORS.LAUNCH, rows: [{ label: "Announced", value: phone.announced }] });
  const bodyRows: { label: string; value: string }[] = [];
  if (phone.dimensions) bodyRows.push({ label: "Dimensions", value: phone.dimensions });
  if (phone.weight) bodyRows.push({ label: "Weight", value: phone.weight });
  if (phone.sim) bodyRows.push({ label: "SIM", value: phone.sim });
  if (bodyRows.length) sections.push({ category: "BODY", color: CAT_COLORS.BODY, rows: bodyRows });
  const displayRows: { label: string; value: string }[] = [];
  if (phone.display_type) displayRows.push({ label: "Type", value: phone.display_type });
  if (phone.display_size) displayRows.push({ label: "Size", value: phone.display_size });
  if (phone.display_res) displayRows.push({ label: "Resolution", value: phone.display_res });
  if (displayRows.length) sections.push({ category: "DISPLAY", color: CAT_COLORS.DISPLAY, rows: displayRows });
  const platformRows: { label: string; value: string }[] = [];
  if (phone.os) platformRows.push({ label: "OS", value: phone.os });
  if (phone.chipset) platformRows.push({ label: "Chipset", value: phone.chipset });
  if (platformRows.length) sections.push({ category: "PLATFORM", color: CAT_COLORS.PLATFORM, rows: platformRows });
  const memRows: { label: string; value: string }[] = [];
  if (phone.storage) memRows.push({ label: "Internal", value: phone.storage });
  if (phone.ram) memRows.push({ label: "RAM", value: phone.ram });
  if (memRows.length) sections.push({ category: "MEMORY", color: CAT_COLORS.MEMORY, rows: memRows });
  if (phone.main_camera) sections.push({ category: "MAIN CAMERA", color: CAT_COLORS["MAIN CAMERA"], rows: [{ label: "Camera", value: phone.main_camera }] });
  if (phone.selfie_camera) sections.push({ category: "SELFIE CAMERA", color: CAT_COLORS["SELFIE CAMERA"], rows: [{ label: "Camera", value: phone.selfie_camera }] });
  const commsRows: { label: string; value: string }[] = [];
  if (phone.wlan) commsRows.push({ label: "WLAN", value: phone.wlan });
  if (phone.bluetooth) commsRows.push({ label: "Bluetooth", value: phone.bluetooth });
  if (phone.nfc) commsRows.push({ label: "NFC", value: phone.nfc });
  if (phone.usb) commsRows.push({ label: "USB", value: phone.usb });
  if (commsRows.length) sections.push({ category: "COMMS", color: CAT_COLORS.COMMS, rows: commsRows });
  const battRows: { label: string; value: string }[] = [];
  if (phone.battery) battRows.push({ label: "Capacity", value: phone.battery });
  if (phone.charging) battRows.push({ label: "Charging", value: phone.charging });
  if (battRows.length) sections.push({ category: "BATTERY", color: CAT_COLORS.BATTERY, rows: battRows });
  const miscRows: { label: string; value: string }[] = [];
  if (phone.colors) miscRows.push({ label: "Colors", value: phone.colors });
  if (miscRows.length) sections.push({ category: "MISC", color: CAT_COLORS.MISC, rows: miscRows });
  return sections;
}

const TABS = ["INFO", "SPECS", "REVIEWS"];

export default function PhoneDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const router = useRouter();
  const { user } = useAuth();
  const [phone, setPhone] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("INFO");
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError("");
    getDevice(slug)
      .then(data => { setPhone(data); setLoading(false); })
      .catch(() => { setError("Phone not found. It may not be in our database yet."); setLoading(false); });
  }, [slug]);

  const handleWishlist = async () => {
    if (!user) { router.push("/login"); return; }
    if (!phone) return;
    try {
      if (inWishlist) { await wishlistAPI.remove(phone.slug); } else { await wishlistAPI.add(phone.slug); }
      setInWishlist(!inWishlist);
    } catch { /* silent */ }
  };

  if (loading) return (
    <div className="min-h-screen page-bg">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={48} className="animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading phone details...</p>
      </div>
      <Footer />
    </div>
  );

  if (error || !phone) return (
    <div className="min-h-screen page-bg">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <div className="glass-card rounded-2xl p-10 text-center max-w-md">
          <AlertCircle size={48} className="text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Phone Not Found</h2>
          <p className="text-muted-foreground text-sm mb-6">{error || "This phone doesn't exist in our database."}</p>
          <Link href="/phone-finder" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors">Browse All Phones</Link>
        </div>
      </div>
      <Footer />
    </div>
  );

  const specSections = buildSpecSections(phone);
  const brandColor = "#ff6e14";

  return (
    <div className="min-h-screen page-bg">
      <Navbar />
      <div className="px-4 pt-4 pb-1">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/phone-finder" className="hover:text-primary transition-colors">Mobiles</Link>
          <ChevronRight size={12} />
          <Link href="/brands" className="hover:text-primary transition-colors">{phone.brand}</Link>
          <ChevronRight size={12} />
          <span className="text-foreground font-medium truncate">{phone.name}</span>
        </nav>
      </div>

      <section className="px-4 py-4">
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${brandColor}, ${brandColor}44)` }} />
          <div className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-shrink-0 flex flex-col items-center gap-4">
                <div className="relative w-full lg:w-72 h-80 lg:h-96 rounded-2xl flex items-center justify-center overflow-hidden bg-white/5 border border-white/10">
                  <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse at 50% 100%, ${brandColor}60, transparent 70%)` }} />
                  <img src={phone.thumbnail} alt={phone.name} className="relative z-10 h-64 lg:h-80 w-auto object-contain drop-shadow-2xl" onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/200x300?text=No+Image"; }} />
                  {phone.rating && (
                    <div className="absolute top-3 left-3 z-20 bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-xl px-3 py-2 text-center shadow-lg">
                      <div className="text-2xl font-black leading-none">{parseFloat(phone.rating).toFixed(1)}</div>
                      <div className="text-[10px] font-bold opacity-90 mt-0.5 tracking-wide">RATING</div>
                    </div>
                  )}
                  <button onClick={handleWishlist} aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"} className="absolute top-3 right-3 z-20 glass rounded-full p-2 backdrop-blur-sm border border-white/20 hover:border-red-400/50 transition-all">
                    <Heart size={16} className={inWishlist ? "fill-red-500 text-red-500" : "text-foreground"} />
                  </button>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/30">{phone.brand}</span>
                  {phone.announced && <span className="text-xs text-muted-foreground py-1">{phone.announced}</span>}
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-foreground mb-3 leading-tight">{phone.name}</h1>
                {phone.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(i => <Star key={i} size={14} className={i <= Math.round(parseFloat(phone.rating || "0") / 2) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"} />)}
                    </div>
                    <span className="text-sm font-bold">{parseFloat(phone.rating).toFixed(1)}/10</span>
                    {phone.fans && <span className="text-xs text-muted-foreground">· {phone.fans} fans</span>}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-5">
                  {[
                    { icon: Monitor,     label: "Display",  value: phone.display_size },
                    { icon: Cpu,         label: "Chipset",  value: phone.chipset },
                    { icon: MemoryStick, label: "RAM",      value: phone.ram },
                    { icon: Camera,      label: "Camera",   value: phone.main_camera?.split(",")[0] },
                    { icon: Battery,     label: "Battery",  value: phone.battery },
                    { icon: Shield,      label: "OS",       value: phone.os?.split(",")[0] },
                  ].filter(s => s.value).map((spec, i) => (
                    <div key={i} className="flex items-center gap-3 glass-card rounded-xl px-3.5 py-2.5 border border-border/60">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary/10">
                        <spec.icon size={16} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide leading-none mb-0.5">{spec.label}</p>
                        <p className="text-xs font-bold text-foreground leading-tight line-clamp-1">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <a href={`https://www.amazon.com/s?k=${encodeURIComponent(phone.brand + " " + phone.name)}`} target="_blank" rel="noopener noreferrer" className="w-full py-3 rounded-xl font-bold text-sm text-white mb-2 hover:opacity-90 transition-all flex items-center justify-center gap-2 bg-primary">
                    <ExternalLink size={16} /> Find Price
                  </a>
                  <Link href="/compare" className="glass-card flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm hover:border-primary/50 transition-all">
                    <GitCompare size={16} className="text-primary" /> Compare
                  </Link>
                  <button onClick={() => { if (navigator.share) { navigator.share({ title: phone.name, url: window.location.href }).catch(() => {}); } else { navigator.clipboard.writeText(window.location.href); } }} className="glass-card flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm hover:border-primary/50 transition-all">
                    <Share2 size={16} className="text-muted-foreground" /> Share
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {phone.os && <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full font-medium">{phone.os.split(",")[0].split(" ").slice(0, 2).join(" ")}</span>}
                  {phone.network?.includes("5G") && <span className="text-xs bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2.5 py-1 rounded-full font-medium">5G</span>}
                  {phone.nfc?.toLowerCase().includes("yes") && <span className="text-xs bg-purple-500/10 text-purple-500 border border-purple-500/20 px-2.5 py-1 rounded-full font-medium">NFC</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-28 z-40 mb-4 px-4">
        <div className="glass-card rounded-xl overflow-hidden shadow-md border-b border-border/50">
          <div className="flex">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3.5 text-sm font-bold tracking-wide transition-all relative ${activeTab === tab ? "text-white" : "text-muted-foreground hover:text-foreground"}`}>
                {activeTab === tab && <span className="absolute inset-0 bg-primary" />}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            {activeTab === "INFO" && (
              <>
                <div className="glass-card rounded-2xl p-5">
                  <h2 className="text-base font-bold mb-4 flex items-center gap-2"><Smartphone size={16} className="text-primary" /> Key Highlights</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: "Display",   value: phone.display_size,          sub: phone.display_type?.split(",")[0],          icon: Monitor,     color: "#3182CE" },
                      { label: "Processor", value: phone.chipset?.split(" ").slice(0,3).join(" "), sub: undefined,               icon: Cpu,         color: "#805AD5" },
                      { label: "RAM",       value: phone.ram,                   sub: "Memory",                                   icon: MemoryStick, color: "#D69E2E" },
                      { label: "Camera",    value: phone.main_camera?.split(",")[0], sub: "Main Camera",                         icon: Camera,      color: "#2B6CB0" },
                      { label: "Battery",   value: phone.battery,               sub: phone.charging,                             icon: Battery,     color: "#276749" },
                      { label: "OS",        value: phone.os?.split(",")[0],     sub: undefined,                                  icon: Shield,      color: "#C05621" },
                    ].filter(h => h.value).map((h, i) => (
                      <div key={i} className="rounded-xl p-3.5 border border-border/50 hover:border-primary/30 transition-colors bg-white/5 backdrop-blur-sm">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5" style={{ backgroundColor: h.color + "18" }}>
                          <h.icon size={18} style={{ color: h.color }} />
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">{h.label}</p>
                        <p className="text-sm font-black text-foreground line-clamp-1">{h.value}</p>
                        {h.sub && <p className="text-[10px] text-muted-foreground line-clamp-1">{h.sub}</p>}
                      </div>
                    ))}
                  </div>
                </div>
                {(phone.wlan || phone.bluetooth || phone.nfc || phone.usb) && (
                  <div className="glass-card rounded-2xl p-5">
                    <h2 className="text-base font-bold mb-4 flex items-center gap-2"><Wifi size={16} className="text-primary" /> Network & Connectivity</h2>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { icon: Globe,     label: "Network",   value: phone.network },
                        { icon: Wifi,      label: "Wi-Fi",     value: phone.wlan },
                        { icon: Bluetooth, label: "Bluetooth", value: phone.bluetooth },
                        { icon: Nfc,       label: "NFC",       value: phone.nfc },
                      ].filter(c => c.value).map((item, i) => (
                        <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border/50 bg-white/5">
                          <item.icon size={16} className="text-primary shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[10px] text-muted-foreground font-medium">{item.label}</p>
                            <p className="text-xs font-bold text-foreground line-clamp-1">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {(phone.main_camera || phone.selfie_camera) && (
                  <div className="glass-card rounded-2xl p-5">
                    <h2 className="text-base font-bold mb-4 flex items-center gap-2"><Camera size={16} className="text-primary" /> Camera System</h2>
                    <div className="space-y-3">
                      {phone.main_camera && <div><p className="text-xs font-bold text-muted-foreground uppercase mb-1.5">Rear Camera</p><p className="text-sm text-foreground">{phone.main_camera}</p></div>}
                      {phone.selfie_camera && <div className="border-t border-white/10 pt-3"><p className="text-xs font-bold text-muted-foreground uppercase mb-1.5">Front Camera</p><p className="text-sm text-foreground">{phone.selfie_camera}</p></div>}
                    </div>
                  </div>
                )}
              </>
            )}
            {activeTab === "SPECS" && (
              <div>
                <div className="glass-card rounded-2xl p-5 mb-4">
                  <h2 className="text-base font-bold mb-1">Full Specifications</h2>
                  <p className="text-xs text-muted-foreground">Complete technical specifications for {phone.name}</p>
                </div>
                {specSections.length > 0 ? specSections.map((section, i) => <SpecSection key={i} {...section} />) : (
                  <div className="glass-card rounded-2xl p-10 text-center"><p className="text-muted-foreground text-sm">Detailed specifications not available yet.</p></div>
                )}
              </div>
            )}
            {activeTab === "REVIEWS" && (
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">User Reviews</h2>
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors">Write Review</button>
                </div>
                <div className="text-center py-12">
                  <Star size={48} className="text-muted-foreground mx-auto mb-3 opacity-40" />
                  <p className="text-muted-foreground text-sm">No reviews yet. Be the first to review {phone.name}!</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="glass-card rounded-2xl overflow-hidden sticky top-32">
              <div className="h-1 bg-gradient-to-r from-primary to-transparent" />
              <div className="p-5">
                <p className="text-xs text-muted-foreground mb-4">Find the best price online</p>
                <a href={`https://www.amazon.com/s?k=${encodeURIComponent(phone.brand + " " + phone.name)}`} target="_blank" rel="noopener noreferrer" className="w-full py-3 rounded-xl font-bold text-sm text-white mb-2 hover:opacity-90 transition-all flex items-center justify-center gap-2 bg-primary">
                  <ExternalLink size={16} /> Search Amazon
                </a>
                <a href={`https://www.gsmarena.com/${phone.slug?.replace(/-/g, "_")}.php`} target="_blank" rel="noopener noreferrer" className="w-full glass-card py-3 rounded-xl font-bold text-sm hover:border-primary/50 transition-all flex items-center justify-center gap-2">
                  <Globe size={16} className="text-primary" /> View on GSMArena
                </a>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <Link href="/phone-finder" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft size={14} /> Back to Phone Finder
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
