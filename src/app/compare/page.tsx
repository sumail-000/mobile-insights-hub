"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ChevronRight, Search, X, Plus, Trophy, Monitor, Cpu,
  MemoryStick, Camera, Battery, Wifi, Smartphone,
  ChevronDown, Loader2
} from "lucide-react";
import { searchDevices, compareDevices } from "@/lib/api";
import type { Device } from "@/lib/api";



const BRAND_COLORS: Record<string, string> = {
  Samsung: "#1428A0", Apple: "#555555", Xiaomi: "#FF6900", OnePlus: "#F5010C",
  Google: "#4285F4", Motorola: "#5C8EE6", Vivo: "#415FFF", OPPO: "#1D4289",
};

type ComparePhone = Device & { _loaded?: boolean };

// ─── Comparison Spec Rows ─────────────────────────────────────────────────────
interface SpecRow {
  category: string;
  categoryIcon: React.ElementType;
  categoryColor: string;
  specs: { label: string; key: string; type: "higher" | "lower" | "text"; unit?: string }[];
}

const specRows: SpecRow[] = [
  {
    category: "Display",
    categoryIcon: Monitor,
    categoryColor: "#3182CE",
    specs: [
      { label: "Display Type", key: "display_type", type: "text" },
      { label: "Screen Size", key: "display_size", type: "text" },
      { label: "Resolution", key: "display_res", type: "text" },
    ],
  },
  {
    category: "Performance",
    categoryIcon: Cpu,
    categoryColor: "#805AD5",
    specs: [
      { label: "Chipset", key: "chipset", type: "text" },
      { label: "RAM", key: "ram", type: "text" },
      { label: "OS", key: "os", type: "text" },
    ],
  },
  {
    category: "Camera",
    categoryIcon: Camera,
    categoryColor: "#2B6CB0",
    specs: [
      { label: "Main Camera", key: "main_camera", type: "text" },
      { label: "Selfie Camera", key: "selfie_camera", type: "text" },
    ],
  },
  {
    category: "Battery",
    categoryIcon: Battery,
    categoryColor: "#276749",
    specs: [
      { label: "Battery", key: "battery", type: "text" },
      { label: "Charging", key: "charging", type: "text" },
    ],
  },
  {
    category: "Design",
    categoryIcon: Smartphone,
    categoryColor: "#C05621",
    specs: [
      { label: "Dimensions", key: "dimensions", type: "text" },
      { label: "Weight", key: "weight", type: "text" },
      { label: "Colors", key: "colors", type: "text" },
    ],
  },
  {
    category: "Connectivity",
    categoryIcon: Wifi,
    categoryColor: "#2D3748",
    specs: [
      { label: "Wi-Fi / Network", key: "wlan", type: "text" },
      { label: "Bluetooth", key: "bluetooth", type: "text" },
      { label: "NFC", key: "nfc", type: "text" },
      { label: "USB", key: "usb", type: "text" },
      { label: "Sensors", key: "sensors", type: "text" },
    ],
  },
  {
    category: "Special",
    categoryIcon: Trophy,
    categoryColor: "#D69E2E",
    specs: [
      { label: "Announced", key: "announced", type: "text" },
      { label: "Status", key: "status", type: "text" },
    ],
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function getVal(phone: ComparePhone, key: string): string {
  return String((phone as unknown as Record<string, unknown>)[key] ?? "-") || "-";
}

function getBrandColor(brand: string) {
  return BRAND_COLORS[brand] || "#ff6e14";
}

// ─── Phone Picker Modal ────────────────────────────────────────────────────────
function PhonePicker({
  slot, selected, onSelect, onClose,
}: {
  slot: number; selected: string[]; onSelect: (phone: ComparePhone) => void; onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Device[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!search.trim()) { setResults([]); return; }
    setSearching(true);
    const t = setTimeout(() => {
      searchDevices(search).then(r => { setResults(r.results || []); setSearching(false); }).catch(() => setSearching(false));
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = results.filter(p => !selected.includes(p.slug));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
      <div className="relative glass-card rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border/40">
          <h3 className="font-bold text-lg">Choose Phone {slot}</h3>
          <button onClick={onClose} className="glass rounded-full p-1.5 hover:border-primary/50 transition-colors"><X size={16} /></button>
        </div>
        <div className="p-4 border-b border-border/30">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Search phones from DB..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white/60 border border-border/50 rounded-xl focus:outline-none focus:border-primary/60 backdrop-blur-sm" />
          </div>
        </div>
        <div className="overflow-y-auto flex-1 p-3 space-y-2">
          {searching && <div className="flex justify-center py-6"><Loader2 size={20} className="animate-spin text-primary" /></div>}
          {!searching && filtered.map(phone => {
            const bc = getBrandColor(phone.brand);
            return (
              <button key={phone.slug} onClick={() => { onSelect(phone as ComparePhone); onClose(); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:border-primary/50 hover:bg-primary/5 transition-all text-left group">
                <div className="w-14 h-16 rounded-xl flex items-center justify-center shrink-0 overflow-hidden" style={{ background: `${bc}15` }}>
                  {phone.thumbnail ? <img src={phone.thumbnail} alt={phone.name} className="h-14 w-auto object-contain" /> : <Smartphone size={20} className="text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold group-hover:text-primary transition-colors leading-tight">{phone.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{phone.brand}</p>
                  <p className="text-xs text-muted-foreground">{phone.chipset}</p>
                </div>
              </button>
            );
          })}
          {!searching && search && filtered.length === 0 && <div className="text-center py-8 text-muted-foreground text-sm">No phones found</div>}
          {!search && <div className="text-center py-8 text-muted-foreground text-sm">Type to search phones from the database</div>}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ComparePage() {
  const [selectedPhones, setSelectedPhones] = useState<(ComparePhone | null)[]>([null, null, null]);
  const [pickerSlot, setPickerSlot] = useState<number | null>(null);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(specRows.map(s => s.category));

  const activePhones = selectedPhones.filter(Boolean) as ComparePhone[];

  const removePhone = (index: number) => setSelectedPhones(prev => { const n = [...prev]; n[index] = null; return n; });

  const setPhone = useCallback((slot: number, phone: ComparePhone) => {
    setSelectedPhones(prev => {
      const next = [...prev];
      next[slot] = phone;
      const filled = next.filter(Boolean) as ComparePhone[];
      if (filled.length === 2) {
        setLoadingCompare(true);
        compareDevices(filled[0].slug, filled[1].slug)
          .then(res => {
            setSelectedPhones(cur => {
              const updated = [...cur];
              const i0 = updated.findIndex(p => p?.slug === filled[0].slug);
              const i1 = updated.findIndex(p => p?.slug === filled[1].slug);
              if (i0 >= 0) updated[i0] = { ...res.device1, _loaded: true } as ComparePhone;
              if (i1 >= 0) updated[i1] = { ...res.device2, _loaded: true } as ComparePhone;
              return updated;
            });
          })
          .catch(() => {})
          .finally(() => setLoadingCompare(false));
      }
      return next;
    });
  }, []);

  const toggleSection = (cat: string) =>
    setExpandedSections(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );

  const colCount = Math.max(activePhones.length, 2);

  return (
    <div className="min-h-screen page-bg">
      <Navbar />

      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-2">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-foreground font-medium">Compare Phones</span>
        </nav>

        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-2xl font-black text-foreground">Phone Comparison</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Compare up to 3 phones side-by-side</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 glass-card rounded-full px-3 py-1.5">
              <div className="w-3 h-3 rounded-sm bg-emerald-500" />
              <span>Best in category</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Phone Selector Cards ────────────────────────────────────────────── */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {[0, 1, 2].map(slot => {
            const phone = selectedPhones[slot];
            const bc = phone ? getBrandColor(phone.brand) : "#ff6e14";
            return (
              <div key={slot}>
                {phone ? (
                  <div className="glass-card rounded-2xl overflow-hidden">
                    <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${bc}, transparent)` }} />
                    <div className="p-4 flex flex-col items-center text-center relative">
                      <button onClick={() => removePhone(slot)} className="absolute top-3 right-3 glass rounded-full p-1 hover:border-red-400/50 transition-colors">
                        <X size={12} className="text-muted-foreground hover:text-red-500 transition-colors" />
                      </button>
                      <div className="w-full h-36 rounded-xl flex items-center justify-center mb-3 relative overflow-hidden" style={{ background: `${bc}15` }}>
                        <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse at 50% 80%, ${bc}, transparent 70%)` }} />
                        {phone.thumbnail
                          ? <img src={phone.thumbnail} alt={phone.name} className="h-28 w-auto object-contain drop-shadow-xl relative z-10" />
                          : <Smartphone size={36} className="text-muted-foreground opacity-40 relative z-10" />}
                        {phone.fans && (
                          <div className="absolute top-2 left-2 bg-primary text-white rounded-lg px-2 py-1 z-20">
                            <div className="text-[10px] font-black">{phone.fans} fans</div>
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-bold leading-tight line-clamp-2 mb-1">{phone.name}</p>
                      <p className="text-xs text-muted-foreground">{phone.brand}</p>
                      <button onClick={() => setPickerSlot(slot)} className="mt-3 w-full text-xs font-semibold py-2 rounded-xl border border-border/50 hover:border-primary/50 hover:text-primary transition-all text-muted-foreground">
                        Change Phone
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setPickerSlot(slot)} className="w-full h-full min-h-[220px] glass-card rounded-2xl border-dashed border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3 group">
                    <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-border/60 group-hover:border-primary/50 flex items-center justify-center transition-colors">
                      <Plus size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">Add Phone {slot + 1}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {loadingCompare && (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
            <Loader2 size={16} className="animate-spin text-primary" /> Loading full specs from database...
          </div>
        )}

        {/* ─── Spec Comparison Table ──────────────────────────────────────────── */}
        {activePhones.length >= 2 ? (
          <div className="space-y-3">
            {specRows.map(section => {
              const isExpanded = expandedSections.includes(section.category);
              return (
                <div key={section.category} className="glass-card rounded-2xl overflow-hidden">
                  <button onClick={() => toggleSection(section.category)}
                    className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/20 transition-colors"
                    style={{ borderBottom: isExpanded ? `2px solid ${section.categoryColor}30` : "none" }}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: section.categoryColor + "18" }}>
                        <section.categoryIcon size={16} style={{ color: section.categoryColor }} />
                      </div>
                      <span className="font-bold text-sm">{section.category}</span>
                    </div>
                    <ChevronDown size={16} className={`text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                  {isExpanded && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <tbody>
                          {section.specs.map((spec, specIdx) => (
                            <tr key={spec.label} className={`border-t border-border/20 ${specIdx % 2 === 0 ? "bg-white/20" : "bg-white/5"}`}>
                              <td className="py-3.5 px-5 text-xs font-semibold text-muted-foreground w-32 shrink-0 align-middle">{spec.label}</td>
                              {activePhones.map(phone => (
                                <td key={phone.slug} className="py-3.5 px-4 text-sm align-middle">
                                  <span className="leading-snug text-foreground font-medium">{getVal(phone, spec.key)}</span>
                                </td>
                              ))}
                              {activePhones.length < 3 && <td className="py-3.5 px-4 opacity-0 select-none">—</td>}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Not enough phones selected */
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Smartphone size={28} className="text-primary opacity-60" />
            </div>
            <h3 className="text-lg font-bold mb-2">Select at least 2 phones</h3>
            <p className="text-sm text-muted-foreground">Choose phones above to start comparing specs side-by-side</p>
          </div>
        )}
      </div>

      {/* ─── Picker Modal ───────────────────────────────────────────────────── */}
      {pickerSlot !== null && (
        <PhonePicker
          slot={pickerSlot + 1}
          selected={selectedPhones.filter(Boolean).map(p => p!.slug)}
          onSelect={phone => setPhone(pickerSlot, phone)}
          onClose={() => setPickerSlot(null)}
        />
      )}

      <Footer />
    </div>
  );
}

