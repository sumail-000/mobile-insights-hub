import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ChevronRight, Search, X, Plus, Trophy, Monitor, Cpu,
  MemoryStick, Camera, Battery, Wifi, Smartphone, Shield,
  ChevronDown, CheckCircle2, XCircle, Minus
} from "lucide-react";

import samsungImg from "@/assets/phones/samsung-s25-ultra.png";
import iphoneImg from "@/assets/phones/iphone-16-pro-max.png";
import oneplusImg from "@/assets/phones/oneplus-13.png";
import motorolaImg from "@/assets/phones/motorola-edge-50.png";
import xiaomiImg from "@/assets/phones/xiaomi-15-ultra.png";
import realmeImg from "@/assets/phones/realme-p4.png";
import googleImg from "@/assets/phones/google-pixel-9-pro.png";
import vivoImg from "@/assets/phones/vivo-x200.png";

// ─── Phone Comparison Database ─────────────────────────────────────────────────
interface ComparePhone {
  id: string;
  name: string;
  brand: string;
  brandColor: string;
  image: string;
  bgColor: string;
  price: string;
  score: number;
  // Numeric specs (used for winner detection)
  displaySize: number;       // inches
  refreshRate: number;       // Hz
  resolutionPPI: number;     // ppi
  chipsetNm: number;         // nm (lower = better)
  ramGB: number;             // GB
  storageGB: number;         // GB
  mainCameraMP: number;      // MP
  frontCameraMP: number;     // MP
  batteryMAh: number;        // mAh
  chargingW: number;         // W
  weightG: number;           // g (lower = better)
  // Text specs (no winner)
  displayType: string;
  chipset: string;
  os: string;
  rearCameras: string;
  frontCamera: string;
  videoRes: string;
  wifiVersion: string;
  bluetooth: string;
  nfc: string;
  usb: string;
  ipRating: string;
  dimensions: string;
  colors: string;
  releaseDate: string;
  wirelessCharging: string;
  sensors: string;
  specialFeature: string;
}

const allPhones: ComparePhone[] = [
  {
    id: "samsung-galaxy-s25-ultra",
    name: "Samsung Galaxy S25 Ultra",
    brand: "Samsung",
    brandColor: "#1428A0",
    image: samsungImg,
    bgColor: "#f0f4f8",
    price: "$1,199",
    score: 97,
    displaySize: 6.9,
    refreshRate: 120,
    resolutionPPI: 493,
    chipsetNm: 3,
    ramGB: 12,
    storageGB: 256,
    mainCameraMP: 200,
    frontCameraMP: 12,
    batteryMAh: 5000,
    chargingW: 45,
    weightG: 218,
    displayType: "Dynamic AMOLED 2X",
    chipset: "Snapdragon 8 Elite",
    os: "Android 15",
    rearCameras: "200 MP + 50 MP + 50 MP + 10 MP",
    frontCamera: "12 MP, f/2.2",
    videoRes: "8K@30fps, 4K@120fps",
    wifiVersion: "Wi-Fi 7 (802.11be)",
    bluetooth: "5.4",
    nfc: "Yes",
    usb: "USB-C 3.2 Gen 2",
    ipRating: "IP68 (6m/30min)",
    dimensions: "162.8 × 77.6 × 8.2 mm",
    colors: "Titanium Black, Gray, White, Blue",
    releaseDate: "February 2025",
    wirelessCharging: "15W Qi2 + 4.5W reverse",
    sensors: "Fingerprint (ultrasonic), SpO2, barometer, IR",
    specialFeature: "Built-in S Pen stylus",
  },
  {
    id: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    brand: "Apple",
    brandColor: "#555555",
    image: iphoneImg,
    bgColor: "#f5f5f5",
    price: "$1,199",
    score: 96,
    displaySize: 6.9,
    refreshRate: 120,
    resolutionPPI: 460,
    chipsetNm: 3,
    ramGB: 8,
    storageGB: 256,
    mainCameraMP: 48,
    frontCameraMP: 12,
    batteryMAh: 4685,
    chargingW: 27,
    weightG: 227,
    displayType: "Super Retina XDR OLED",
    chipset: "Apple A18 Pro",
    os: "iOS 18",
    rearCameras: "48 MP + 48 MP + 12 MP",
    frontCamera: "12 MP, f/1.9, PDAF",
    videoRes: "4K@120fps ProRes, 4K@60fps",
    wifiVersion: "Wi-Fi 7 (802.11be)",
    bluetooth: "5.3",
    nfc: "Yes (Apple Pay)",
    usb: "USB-C 3.2 Gen 2",
    ipRating: "IP68 (6m/30min)",
    dimensions: "163 × 77.6 × 8.25 mm",
    colors: "Black, White, Natural, Desert Titanium",
    releaseDate: "September 2024",
    wirelessCharging: "25W MagSafe + 15W Qi2",
    sensors: "Face ID 3D, barometer, UWB, satellite SOS",
    specialFeature: "Camera Control button, Apple Intelligence",
  },
  {
    id: "oneplus-13",
    name: "OnePlus 13",
    brand: "OnePlus",
    brandColor: "#F5010C",
    image: oneplusImg,
    bgColor: "#fff0f0",
    price: "$799",
    score: 94,
    displaySize: 6.82,
    refreshRate: 120,
    resolutionPPI: 510,
    chipsetNm: 3,
    ramGB: 12,
    storageGB: 256,
    mainCameraMP: 50,
    frontCameraMP: 32,
    batteryMAh: 6000,
    chargingW: 100,
    weightG: 210,
    displayType: "LTPO AMOLED",
    chipset: "Snapdragon 8 Elite",
    os: "Android 15 (OxygenOS 15)",
    rearCameras: "50 MP + 50 MP + 50 MP (Hasselblad)",
    frontCamera: "32 MP, f/2.4",
    videoRes: "4K@60fps, 1080p@240fps",
    wifiVersion: "Wi-Fi 7 (802.11be)",
    bluetooth: "5.4",
    nfc: "Yes",
    usb: "USB-C 2.0, OTG",
    ipRating: "IP65",
    dimensions: "162.6 × 76.0 × 8.9 mm",
    colors: "Midnight Ocean, Arctic Dawn, Black Eclipse",
    releaseDate: "January 2025",
    wirelessCharging: "50W AIRVOOC + 10W reverse",
    sensors: "Fingerprint (optical), alert slider, IR blaster",
    specialFeature: "Alert Slider + 100W SuperVOOC fastest charging",
  },
  {
    id: "google-pixel-9-pro",
    name: "Google Pixel 9 Pro",
    brand: "Google",
    brandColor: "#4285F4",
    image: googleImg,
    bgColor: "#f0f4ff",
    price: "$999",
    score: 95,
    displaySize: 6.3,
    refreshRate: 120,
    resolutionPPI: 495,
    chipsetNm: 4,
    ramGB: 16,
    storageGB: 128,
    mainCameraMP: 50,
    frontCameraMP: 42,
    batteryMAh: 4700,
    chargingW: 45,
    weightG: 199,
    displayType: "LTPO OLED",
    chipset: "Google Tensor G4",
    os: "Android 14 (7yr updates)",
    rearCameras: "50 MP + 48 MP + 48 MP",
    frontCamera: "42 MP, f/2.2 ultrawide",
    videoRes: "8K@30fps (zoom), 4K@60fps",
    wifiVersion: "Wi-Fi 7 (802.11be)",
    bluetooth: "5.9",
    nfc: "Yes",
    usb: "USB-C 3.2 Gen 2",
    ipRating: "IP68 (6m/30min)",
    dimensions: "152.8 × 72.0 × 8.5 mm",
    colors: "Obsidian, Porcelain, Wintergreen, Rose Quartz",
    releaseDate: "August 2024",
    wirelessCharging: "23W wireless + 12W reverse",
    sensors: "Fingerprint (optical), temp sensor, UWB, SpO2",
    specialFeature: "Gemini AI + Circle to Search + Satellite SOS",
  },
  {
    id: "xiaomi-15-ultra",
    name: "Xiaomi 15 Ultra",
    brand: "Xiaomi",
    brandColor: "#FF6900",
    image: xiaomiImg,
    bgColor: "#f8f3f0",
    price: "$1,099",
    score: 98,
    displaySize: 6.85,
    refreshRate: 120,
    resolutionPPI: 454,
    chipsetNm: 3,
    ramGB: 16,
    storageGB: 512,
    mainCameraMP: 200,
    frontCameraMP: 32,
    batteryMAh: 6500,
    chargingW: 90,
    weightG: 229,
    displayType: "LTPO AMOLED",
    chipset: "Snapdragon 8 Elite",
    os: "Android 15 (HyperOS 2)",
    rearCameras: "200 MP + 50 MP + 50 MP (Leica)",
    frontCamera: "32 MP, f/2.0",
    videoRes: "8K@30fps, 4K@120fps",
    wifiVersion: "Wi-Fi 7 (802.11be)",
    bluetooth: "5.4",
    nfc: "Yes",
    usb: "USB-C 3.2 Gen 2",
    ipRating: "IP68 (6m/30min)",
    dimensions: "161.3 × 75.3 × 9.5 mm",
    colors: "White, Black, Ceramic",
    releaseDate: "February 2025",
    wirelessCharging: "80W HyperCharge + 10W reverse",
    sensors: "Fingerprint (ultrasonic), IR blaster, SpO2",
    specialFeature: "Leica cameras + largest battery in flagship class",
  },
  {
    id: "motorola-edge-50",
    name: "Motorola Edge 50",
    brand: "Motorola",
    brandColor: "#5C8EE6",
    image: motorolaImg,
    bgColor: "#f0f4ff",
    price: "$369",
    score: 89,
    displaySize: 6.7,
    refreshRate: 144,
    resolutionPPI: 402,
    chipsetNm: 4,
    ramGB: 8,
    storageGB: 256,
    mainCameraMP: 50,
    frontCameraMP: 32,
    batteryMAh: 5000,
    chargingW: 68,
    weightG: 175,
    displayType: "pOLED",
    chipset: "Snapdragon 7s Gen 2",
    os: "Android 14",
    rearCameras: "50 MP + 13 MP",
    frontCamera: "32 MP, f/2.4",
    videoRes: "4K@30fps, 1080p@120fps",
    wifiVersion: "Wi-Fi 6e (802.11ax)",
    bluetooth: "5.3",
    nfc: "Yes",
    usb: "USB-C 2.0, OTG",
    ipRating: "IP68",
    dimensions: "161.2 × 73.0 × 7.6 mm",
    colors: "Pale Iris, Jungle Green",
    releaseDate: "May 2024",
    wirelessCharging: "15W TurboPower wireless",
    sensors: "Fingerprint (side), IR blaster",
    specialFeature: "Lightest flagship-class at 175g",
  },
  {
    id: "realme-p4",
    name: "Realme P4",
    brand: "Realme",
    brandColor: "#FFD600",
    image: realmeImg,
    bgColor: "#fff8f0",
    price: "$299",
    score: 87,
    displaySize: 6.7,
    refreshRate: 120,
    resolutionPPI: 395,
    chipsetNm: 4,
    ramGB: 8,
    storageGB: 128,
    mainCameraMP: 50,
    frontCameraMP: 16,
    batteryMAh: 5200,
    chargingW: 67,
    weightG: 190,
    displayType: "AMOLED",
    chipset: "Snapdragon 7s Gen 3",
    os: "Android 14 (realme UI 5.0)",
    rearCameras: "50 MP + 8 MP",
    frontCamera: "16 MP, f/2.5",
    videoRes: "4K@30fps, 1080p@120fps",
    wifiVersion: "Wi-Fi 6 (802.11ax)",
    bluetooth: "5.3",
    nfc: "Yes",
    usb: "USB-C 2.0",
    ipRating: "IP65",
    dimensions: "162.5 × 74.5 × 7.8 mm",
    colors: "Sunny Glow, Sky Blue, Monet Purple",
    releaseDate: "October 2024",
    wirelessCharging: "No",
    sensors: "Fingerprint (side)",
    specialFeature: "Best value AMOLED under $300",
  },
  {
    id: "vivo-x200",
    name: "Vivo X200",
    brand: "Vivo",
    brandColor: "#415FFF",
    image: vivoImg,
    bgColor: "#f0f0ff",
    price: "$699",
    score: 93,
    displaySize: 6.82,
    refreshRate: 120,
    resolutionPPI: 460,
    chipsetNm: 4,
    ramGB: 12,
    storageGB: 256,
    mainCameraMP: 200,
    frontCameraMP: 32,
    batteryMAh: 6500,
    chargingW: 90,
    weightG: 199,
    displayType: "LTPO AMOLED",
    chipset: "MediaTek Dimensity 9400",
    os: "Android 15 (OriginOS 5)",
    rearCameras: "200 MP + 50 MP + 50 MP (Zeiss)",
    frontCamera: "32 MP, f/2.0",
    videoRes: "4K@60fps, 1080p@240fps",
    wifiVersion: "Wi-Fi 7 (802.11be)",
    bluetooth: "5.4",
    nfc: "Yes",
    usb: "USB-C 3.2 Gen 2",
    ipRating: "IP69",
    dimensions: "163.1 × 75.9 × 8.0 mm",
    colors: "Cosmos Black, Titanium Grey, Startrail Blue",
    releaseDate: "November 2024",
    wirelessCharging: "30W wireless + 10W reverse",
    sensors: "Fingerprint (ultrasonic), IR blaster, SpO2",
    specialFeature: "IP69 rating + Zeiss T* coating lenses",
  },
];

// ─── Comparison Spec Rows ─────────────────────────────────────────────────────
interface SpecRow {
  category: string;
  categoryIcon: React.ElementType;
  categoryColor: string;
  specs: {
    label: string;
    key: keyof ComparePhone;
    type: "higher" | "lower" | "text" | "bool";
    unit?: string;
  }[];
}

const specRows: SpecRow[] = [
  {
    category: "Display",
    categoryIcon: Monitor,
    categoryColor: "#3182CE",
    specs: [
      { label: "Display Type", key: "displayType", type: "text" },
      { label: "Screen Size", key: "displaySize", type: "higher", unit: '"' },
      { label: "Refresh Rate", key: "refreshRate", type: "higher", unit: "Hz" },
      { label: "Pixel Density", key: "resolutionPPI", type: "higher", unit: " ppi" },
    ],
  },
  {
    category: "Performance",
    categoryIcon: Cpu,
    categoryColor: "#805AD5",
    specs: [
      { label: "Chipset", key: "chipset", type: "text" },
      { label: "Process Node", key: "chipsetNm", type: "lower", unit: "nm" },
      { label: "RAM", key: "ramGB", type: "higher", unit: " GB" },
      { label: "Storage", key: "storageGB", type: "higher", unit: " GB" },
      { label: "OS", key: "os", type: "text" },
    ],
  },
  {
    category: "Camera",
    categoryIcon: Camera,
    categoryColor: "#2B6CB0",
    specs: [
      { label: "Rear Cameras", key: "rearCameras", type: "text" },
      { label: "Main Camera", key: "mainCameraMP", type: "higher", unit: " MP" },
      { label: "Front Camera", key: "frontCameraMP", type: "higher", unit: " MP" },
      { label: "Front Cam Info", key: "frontCamera", type: "text" },
      { label: "Video Recording", key: "videoRes", type: "text" },
    ],
  },
  {
    category: "Battery",
    categoryIcon: Battery,
    categoryColor: "#276749",
    specs: [
      { label: "Battery Capacity", key: "batteryMAh", type: "higher", unit: " mAh" },
      { label: "Wired Charging", key: "chargingW", type: "higher", unit: "W" },
      { label: "Wireless Charging", key: "wirelessCharging", type: "text" },
    ],
  },
  {
    category: "Design",
    categoryIcon: Smartphone,
    categoryColor: "#C05621",
    specs: [
      { label: "Dimensions", key: "dimensions", type: "text" },
      { label: "Weight", key: "weightG", type: "lower", unit: " g" },
      { label: "Water Resistance", key: "ipRating", type: "text" },
      { label: "Available Colors", key: "colors", type: "text" },
    ],
  },
  {
    category: "Connectivity",
    categoryIcon: Wifi,
    categoryColor: "#2D3748",
    specs: [
      { label: "Wi-Fi", key: "wifiVersion", type: "text" },
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
      { label: "Release Date", key: "releaseDate", type: "text" },
      { label: "Special Feature", key: "specialFeature", type: "text" },
    ],
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function getWinner(phones: ComparePhone[], key: keyof ComparePhone, type: "higher" | "lower"): number[] {
  const values = phones.map(p => Number(p[key]));
  const best = type === "higher" ? Math.max(...values) : Math.min(...values);
  // Only highlight if there's a clear winner (not all equal)
  if (values.every(v => v === best)) return [];
  return values.reduce<number[]>((acc, v, i) => (v === best ? [...acc, i] : acc), []);
}

function getScoreColor(score: number) {
  if (score >= 93) return "from-green-600 to-emerald-700";
  if (score >= 85) return "from-amber-500 to-orange-600";
  return "from-red-500 to-rose-600";
}

// ─── Phone Picker Modal ────────────────────────────────────────────────────────
function PhonePicker({
  slot,
  selected,
  onSelect,
  onClose,
}: {
  slot: number;
  selected: string[];
  onSelect: (phone: ComparePhone) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = allPhones.filter(
    p =>
      !selected.includes(p.id) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
      <div
        className="relative glass-card rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/40">
          <h3 className="font-bold text-lg">Choose Phone {slot}</h3>
          <button onClick={onClose} className="glass rounded-full p-1.5 hover:border-primary/50 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border/30">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search phones..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white/60 border border-border/50 rounded-xl focus:outline-none focus:border-primary/60 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Phone list */}
        <div className="overflow-y-auto flex-1 p-3 space-y-2">
          {filtered.map(phone => (
            <button
              key={phone.id}
              onClick={() => { onSelect(phone); onClose(); }}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
            >
              <div
                className="w-14 h-16 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                style={{ backgroundColor: phone.bgColor }}
              >
                <img src={phone.image} alt={phone.name} className="h-14 w-auto object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight">{phone.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{phone.brand} · {phone.price}</p>
                <p className="text-xs text-muted-foreground">{phone.rearCameras.split("+")[0].trim()} · {phone.batteryMAh} mAh</p>
              </div>
              <div className={`text-xs font-black px-2 py-1.5 rounded-lg text-white shrink-0 bg-gradient-to-br ${getScoreColor(phone.score)}`}>
                {phone.score}%
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">No phones found</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ComparePage() {
  const [selectedPhones, setSelectedPhones] = useState<(ComparePhone | null)[]>([
    allPhones[0], // Samsung S25 Ultra
    allPhones[1], // iPhone 16 Pro Max
    null,         // empty slot
  ]);
  const [pickerSlot, setPickerSlot] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>(
    specRows.map(s => s.category)
  );

  const activePhones = selectedPhones.filter(Boolean) as ComparePhone[];

  const removePhone = (index: number) => {
    setSelectedPhones(prev => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  const setPhone = (slot: number, phone: ComparePhone) => {
    setSelectedPhones(prev => {
      const next = [...prev];
      next[slot] = phone;
      return next;
    });
  };

  const toggleSection = (cat: string) =>
    setExpandedSections(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );

  const colCount = Math.max(activePhones.length, 2);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 pt-4 pb-2">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
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
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {[0, 1, 2].map(slot => {
            const phone = selectedPhones[slot];
            return (
              <div key={slot}>
                {phone ? (
                  /* Filled slot */
                  <div className="glass-card rounded-2xl overflow-hidden">
                    <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${phone.brandColor}, transparent)` }} />
                    <div className="p-4 flex flex-col items-center text-center relative">
                      {/* Remove button */}
                      <button
                        onClick={() => removePhone(slot)}
                        className="absolute top-3 right-3 glass rounded-full p-1 hover:border-red-400/50 transition-colors"
                      >
                        <X size={12} className="text-muted-foreground hover:text-red-500 transition-colors" />
                      </button>

                      {/* Phone image */}
                      <div
                        className="w-full h-36 rounded-xl flex items-center justify-center mb-3 relative overflow-hidden"
                        style={{ backgroundColor: phone.bgColor }}
                      >
                        <div
                          className="absolute inset-0 opacity-20"
                          style={{ background: `radial-gradient(ellipse at 50% 80%, ${phone.brandColor}, transparent 70%)` }}
                        />
                        <img src={phone.image} alt={phone.name} className="h-28 w-auto object-contain drop-shadow-xl relative z-10" />
                        {/* Score badge */}
                        <div className={`absolute top-2 left-2 bg-gradient-to-br ${getScoreColor(phone.score)} text-white rounded-lg px-2 py-1 z-20`}>
                          <div className="text-sm font-black leading-none">{phone.score}%</div>
                          <div className="text-[8px] opacity-90">Score</div>
                        </div>
                      </div>

                      <p className="text-sm font-bold text-foreground leading-tight line-clamp-2 mb-1">{phone.name}</p>
                      <p className="text-lg font-black text-primary">{phone.price}</p>

                      <button
                        onClick={() => setPickerSlot(slot)}
                        className="mt-3 w-full text-xs font-semibold py-2 rounded-xl border border-border/50 hover:border-primary/50 hover:text-primary transition-all text-muted-foreground"
                      >
                        Change Phone
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Empty slot */
                  <button
                    onClick={() => setPickerSlot(slot)}
                    className="w-full h-full min-h-[220px] glass-card rounded-2xl border-dashed border-2 border-border/50 hover:border-primary/50 hover:bg-primary/3 transition-all flex flex-col items-center justify-center gap-3 group"
                  >
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

        {/* ─── Quick Stats Bar ────────────────────────────────────────────────── */}
        {activePhones.length >= 2 && (
          <div className="glass-card rounded-2xl p-4 mb-4">
            <h3 className="text-sm font-bold mb-3 text-muted-foreground uppercase tracking-wide">Quick Overview</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Best Spec Score", getValue: (ps: ComparePhone[]) => {
                  const best = ps.reduce((a, b) => a.score > b.score ? a : b);
                  return { name: best.name.split(" ").slice(-2).join(" "), value: `${best.score}%`, color: best.brandColor };
                }},
                { label: "Largest Battery", getValue: (ps: ComparePhone[]) => {
                  const best = ps.reduce((a, b) => a.batteryMAh > b.batteryMAh ? a : b);
                  return { name: best.name.split(" ").slice(-2).join(" "), value: `${best.batteryMAh} mAh`, color: best.brandColor };
                }},
                { label: "Fastest Charging", getValue: (ps: ComparePhone[]) => {
                  const best = ps.reduce((a, b) => a.chargingW > b.chargingW ? a : b);
                  return { name: best.name.split(" ").slice(-2).join(" "), value: `${best.chargingW}W`, color: best.brandColor };
                }},
                { label: "Best Value", getValue: (ps: ComparePhone[]) => {
                  const best = ps.reduce((a, b) => (a.score / parseFloat(a.price.replace(/[$,]/g, ""))) > (b.score / parseFloat(b.price.replace(/[$,]/g, ""))) ? a : b);
                  return { name: best.name.split(" ").slice(-2).join(" "), value: best.price, color: best.brandColor };
                }},
              ].map((stat, i) => {
                const result = stat.getValue(activePhones);
                return (
                  <div key={i} className="rounded-xl p-3 border border-border/40 bg-white/40 backdrop-blur-sm">
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mb-1">{stat.label}</p>
                    <p className="text-sm font-black" style={{ color: result.color }}>{result.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{result.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Spec Comparison Table ──────────────────────────────────────────── */}
        {activePhones.length >= 2 ? (
          <div className="space-y-3">
            {specRows.map(section => {
              const isExpanded = expandedSections.includes(section.category);
              return (
                <div key={section.category} className="glass-card rounded-2xl overflow-hidden">
                  {/* Section header */}
                  <button
                    onClick={() => toggleSection(section.category)}
                    className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/20 transition-colors"
                    style={{ borderBottom: isExpanded ? `2px solid ${section.categoryColor}30` : "none" }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: section.categoryColor + "18" }}
                      >
                        <section.categoryIcon size={16} style={{ color: section.categoryColor }} />
                      </div>
                      <span className="font-bold text-sm">{section.category}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Spec rows */}
                  {isExpanded && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <tbody>
                          {section.specs.map((spec, specIdx) => {
                            const winners = spec.type !== "text"
                              ? getWinner(activePhones, spec.key, spec.type as "higher" | "lower")
                              : [];
                            return (
                              <tr
                                key={spec.label}
                                className={`border-t border-border/20 ${specIdx % 2 === 0 ? "bg-white/20" : "bg-white/5"}`}
                              >
                                {/* Spec label */}
                                <td className="py-3.5 px-5 text-xs font-semibold text-muted-foreground w-32 shrink-0 align-middle">
                                  {spec.label}
                                </td>

                                {/* Phone values */}
                                {activePhones.map((phone, phoneIdx) => {
                                  const isWinner = winners.includes(phoneIdx);
                                  const rawValue = phone[spec.key];
                                  const displayValue = spec.unit
                                    ? `${rawValue}${spec.unit}`
                                    : String(rawValue);

                                  return (
                                    <td
                                      key={phone.id}
                                      className={`py-3.5 px-4 text-sm align-middle transition-colors ${
                                        isWinner
                                          ? "bg-emerald-50/60"
                                          : ""
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        {isWinner && (
                                          <Trophy
                                            size={12}
                                            className="text-emerald-600 shrink-0"
                                          />
                                        )}
                                        <span
                                          className={`leading-snug ${
                                            isWinner
                                              ? "font-bold text-emerald-700"
                                              : "text-foreground font-medium"
                                          }`}
                                        >
                                          {displayValue}
                                        </span>
                                      </div>
                                    </td>
                                  );
                                })}

                                {/* Empty columns if < 3 phones */}
                                {activePhones.length < 3 && (
                                  <td className="py-3.5 px-4 opacity-0 select-none">—</td>
                                )}
                              </tr>
                            );
                          })}
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
          selected={selectedPhones.filter(Boolean).map(p => p!.id)}
          onSelect={phone => setPhone(pickerSlot, phone)}
          onClose={() => setPickerSlot(null)}
        />
      )}

      <Footer />
    </div>
  );
}
