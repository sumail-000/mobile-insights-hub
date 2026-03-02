import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ChevronRight, Search, Smartphone, Grid3X3, List, X,
  Cpu, MemoryStick, Camera, Battery, Monitor, Star,
  ArrowLeft, SlidersHorizontal, ExternalLink, GitCompare, Zap
} from "lucide-react";

// ─── Phone images ─────────────────────────────────────────────────────────────
import samsungImg from "@/assets/phones/samsung-s25-ultra.png";
import iphoneImg from "@/assets/phones/iphone-16-pro-max.png";
import oneplusImg from "@/assets/phones/oneplus-13.png";
import motorolaImg from "@/assets/phones/motorola-edge-50.png";
import xiaomiImg from "@/assets/phones/xiaomi-15-ultra.png";
import realmeImg from "@/assets/phones/realme-p4.png";
import googleImg from "@/assets/phones/google-pixel-9-pro.png";
import vivoImg from "@/assets/phones/vivo-x200.png";

// ─── Brand data ───────────────────────────────────────────────────────────────
const allBrands = [
  { name: "Samsung", devices: 312, color: "#1428A0", logo: "https://cdn.simpleicons.org/samsung/1428A0", featured: true, founded: "1969", hq: "Seoul, South Korea", tagline: "Inspiring the World, Creating the Future" },
  { name: "Apple", devices: 145, color: "#888888", logo: "https://cdn.simpleicons.org/apple/888888", featured: true, founded: "1976", hq: "Cupertino, USA", tagline: "Think Different" },
  { name: "Xiaomi", devices: 284, color: "#FF6900", logo: "https://cdn.simpleicons.org/xiaomi/FF6900", featured: true, founded: "2010", hq: "Beijing, China", tagline: "Innovation for Everyone" },
  { name: "OnePlus", devices: 93, color: "#F5010C", logo: "https://cdn.simpleicons.org/oneplus/F5010C", featured: true, founded: "2013", hq: "Shenzhen, China", tagline: "Never Settle" },
  { name: "Google", devices: 47, color: "#4285F4", logo: "https://cdn.simpleicons.org/google/4285F4", featured: true, founded: "1998", hq: "Mountain View, USA", tagline: "AI-First Mobile Experience" },
  { name: "Motorola", devices: 198, color: "#5C8EE6", logo: "https://cdn.simpleicons.org/motorola/5C8EE6", featured: true, founded: "1928", hq: "Chicago, USA", tagline: "Hello Moto" },
  { name: "Vivo", devices: 167, color: "#415FFF", logo: "https://cdn.simpleicons.org/vivo/415FFF", featured: false, founded: "2009", hq: "Dongguan, China", tagline: "More Joy, More Life" },
  { name: "OPPO", devices: 203, color: "#1D7FEE", logo: "https://cdn.simpleicons.org/oppo/1D7FEE", featured: false, founded: "2004", hq: "Guangdong, China", tagline: "Inspiration Ahead" },
  { name: "Realme", devices: 178, color: "#FFD600", logo: "https://cdn.simpleicons.org/realme/FFD600", featured: false, founded: "2018", hq: "Shenzhen, China", tagline: "Dare to Leap" },
  { name: "Huawei", devices: 256, color: "#CF0A2C", logo: "https://cdn.simpleicons.org/huawei/CF0A2C", featured: false, founded: "1987", hq: "Shenzhen, China", tagline: "Built for the Future" },
  { name: "Sony", devices: 88, color: "#aaaaaa", logo: "https://cdn.simpleicons.org/sony/aaaaaa", featured: false, founded: "1946", hq: "Tokyo, Japan", tagline: "Make. Believe" },
  { name: "Nokia", devices: 201, color: "#4BA3DA", logo: "https://cdn.simpleicons.org/nokia/4BA3DA", featured: false, founded: "1865", hq: "Espoo, Finland", tagline: "Connecting People" },
  { name: "Honor", devices: 134, color: "#c0c0c0", logo: "https://cdn.simpleicons.org/honor/c0c0c0", featured: false, founded: "2013", hq: "Shenzhen, China", tagline: "Bring Surprises" },
  { name: "Asus", devices: 207, color: "#00BCB4", logo: "https://cdn.simpleicons.org/asus/00BCB4", featured: false, founded: "1989", hq: "Taipei, Taiwan", tagline: "In Search of Incredible" },
  { name: "LG", devices: 177, color: "#A50034", logo: "https://cdn.simpleicons.org/lg/A50034", featured: false, founded: "1958", hq: "Seoul, South Korea", tagline: "Life's Good" },
  { name: "Lenovo", devices: 143, color: "#E2231A", logo: "https://cdn.simpleicons.org/lenovo/E2231A", featured: false, founded: "1984", hq: "Beijing, China", tagline: "Smarter Technology for All" },
  { name: "Nothing", devices: 12, color: "#cccccc", logo: "https://cdn.simpleicons.org/nothing/cccccc", featured: false, founded: "2020", hq: "London, UK", tagline: "For the Curious" },
  { name: "ZTE", devices: 134, color: "#E22D3F", logo: "https://cdn.simpleicons.org/zte/E22D3F", featured: false, founded: "1985", hq: "Shenzhen, China", tagline: "Leading the 5G Future" },
  { name: "HTC", devices: 64, color: "#69BD45", logo: "https://cdn.simpleicons.org/htc/69BD45", featured: false, founded: "1997", hq: "Taoyuan, Taiwan", tagline: "Here's to Change" },
  { name: "Acer", devices: 113, color: "#83B81A", logo: "https://cdn.simpleicons.org/acer/83B81A", featured: false, founded: "1976", hq: "New Taipei, Taiwan", tagline: "Breaking Barriers" },
  { name: "BlackBerry", devices: 92, color: "#bbbbbb", logo: "https://cdn.simpleicons.org/blackberry/bbbbbb", featured: false, founded: "1984", hq: "Waterloo, Canada", tagline: "Security Reimagined" },
  { name: "Infinix", devices: 89, color: "#ED1C24", logo: null, featured: false, founded: "2013", hq: "Hong Kong", tagline: "Future Proof" },
  { name: "Tecno", devices: 112, color: "#00AEEF", logo: null, featured: false, founded: "2006", hq: "Shenzhen, China", tagline: "Stop at Nothing" },
  { name: "Amazon", devices: 25, color: "#FF9900", logo: "https://cdn.simpleicons.org/amazon/FF9900", featured: false, founded: "1994", hq: "Seattle, USA", tagline: "Work Hard. Have Fun." },
  { name: "Alcatel", devices: 414, color: "#009EDD", logo: null, featured: false, founded: "1996", hq: "Paris, France", tagline: "Simple is Smart" },
  { name: "Micromax", devices: 167, color: "#E61E28", logo: null, featured: false, founded: "2000", hq: "Gurugram, India", tagline: "Nothing Like Anything" },
  { name: "Doogee", devices: 98, color: "#FF6B00", logo: null, featured: false, founded: "2013", hq: "Shenzhen, China", tagline: "Explore More" },
  { name: "Blackview", devices: 113, color: "#2C5F8A", logo: null, featured: false, founded: "2013", hq: "Shenzhen, China", tagline: "Rugged & Reliable" },
  { name: "Cat", devices: 22, color: "#FFAE00", logo: null, featured: false, founded: "2012", hq: "USA", tagline: "Built for the Tough" },
  { name: "BLU", devices: 369, color: "#1E90FF", logo: null, featured: false, founded: "2009", hq: "Miami, USA", tagline: "Life One" },
  { name: "Oukitel", devices: 74, color: "#FF4500", logo: null, featured: false, founded: "2013", hq: "Shenzhen, China", tagline: "Powerful Inside" },
  { name: "Ulefone", devices: 56, color: "#0066CC", logo: null, featured: false, founded: "2012", hq: "Shenzhen, China", tagline: "No Limits" },
  { name: "Itel", devices: 78, color: "#0056A8", logo: null, featured: false, founded: "2007", hq: "Shenzhen, China", tagline: "The Good Life" },
  { name: "Meizu", devices: 89, color: "#1E90FF", logo: null, featured: false, founded: "2003", hq: "Guangdong, China", tagline: "Design Meets Technology" },
  { name: "Sharp", devices: 67, color: "#aaaaaa", logo: null, featured: false, founded: "1912", hq: "Osaka, Japan", tagline: "Be Original" },
];

// ─── Phone data per brand ─────────────────────────────────────────────────────
const brandPhones: Record<string, Array<{
  name: string; price: string; chip: string; ram: string; camera: string; battery: string; display: string;
  score: number; image: string; isNew?: boolean; rating: number; ratingCount: string;
}>> = {
  Samsung: [
    { name: "Galaxy S26 Ultra", price: "$1,299", chip: "Snapdragon 8 Elite 2", ram: "16 GB", camera: "200 MP", battery: "5500 mAh | 65W", display: "6.9\" 120Hz AMOLED", score: 99, image: samsungImg, isNew: true, rating: 4.8, ratingCount: "2.3K" },
    { name: "Galaxy S26+", price: "$999", chip: "Snapdragon 8 Elite 2", ram: "12 GB", camera: "50 MP", battery: "4900 mAh | 45W", display: "6.7\" 120Hz AMOLED", score: 96, image: samsungImg, isNew: true, rating: 4.7, ratingCount: "1.1K" },
    { name: "Galaxy Z Fold 7", price: "$1,799", chip: "Snapdragon 8 Elite 2", ram: "12 GB", camera: "200 MP", battery: "4400 mAh | 25W", display: "7.6\" Foldable", score: 97, image: samsungImg, rating: 4.6, ratingCount: "890" },
    { name: "Galaxy A56 5G", price: "$499", chip: "Exynos 1580", ram: "8 GB", camera: "50 MP", battery: "5000 mAh | 45W", display: "6.7\" 120Hz AMOLED", score: 82, image: samsungImg, rating: 4.4, ratingCount: "3.2K" },
    { name: "Galaxy S25 FE", price: "$649", chip: "Snapdragon 8 Gen 3", ram: "8 GB", camera: "50 MP", battery: "4900 mAh | 45W", display: "6.7\" 120Hz AMOLED", score: 88, image: samsungImg, rating: 4.5, ratingCount: "741" },
  ],
  Apple: [
    { name: "iPhone 17 Pro Max", price: "$1,199", chip: "Apple A19 Pro", ram: "8 GB", camera: "48 MP", battery: "4685 mAh | 27W", display: "6.9\" ProMotion OLED", score: 99, image: iphoneImg, isNew: true, rating: 4.9, ratingCount: "8.2K" },
    { name: "iPhone 17 Pro", price: "$999", chip: "Apple A19 Pro", ram: "8 GB", camera: "48 MP", battery: "3290 mAh | 27W", display: "6.3\" ProMotion OLED", score: 97, image: iphoneImg, isNew: true, rating: 4.8, ratingCount: "5.4K" },
    { name: "iPhone 17", price: "$799", chip: "Apple A19", ram: "8 GB", camera: "48 MP", battery: "3279 mAh | 25W", display: "6.1\" 60Hz OLED", score: 93, image: iphoneImg, rating: 4.7, ratingCount: "4.1K" },
    { name: "iPhone 17e", price: "$599", chip: "Apple A18", ram: "6 GB", camera: "12 MP", battery: "2942 mAh | 20W", display: "4.7\" 60Hz LCD", score: 84, image: iphoneImg, rating: 4.5, ratingCount: "1.8K" },
    { name: "iPhone 16 Plus", price: "$699", chip: "Apple A18", ram: "8 GB", camera: "48 MP", battery: "4685 mAh | 27W", display: "6.7\" 60Hz OLED", score: 90, image: iphoneImg, rating: 4.6, ratingCount: "2.9K" },
  ],
  OnePlus: [
    { name: "OnePlus 13", price: "$699", chip: "Snapdragon 8 Gen 3", ram: "12 GB", camera: "50 MP", battery: "6000 mAh | 100W", display: "6.82\" 120Hz AMOLED", score: 95, image: oneplusImg, isNew: true, rating: 4.6, ratingCount: "1.8K" },
    { name: "OnePlus 13R", price: "$499", chip: "Snapdragon 8 Gen 2", ram: "8 GB", camera: "50 MP", battery: "5500 mAh | 80W", display: "6.78\" 120Hz AMOLED", score: 89, image: oneplusImg, rating: 4.4, ratingCount: "920" },
    { name: "OnePlus Nord 5", price: "$399", chip: "Snapdragon 8s Gen 3", ram: "8 GB", camera: "50 MP", battery: "6800 mAh | 80W", display: "6.83\" 120Hz AMOLED", score: 87, image: oneplusImg, rating: 4.3, ratingCount: "2.1K" },
    { name: "OnePlus Open 2", price: "$1,599", chip: "Snapdragon 8 Elite", ram: "16 GB", camera: "50 MP", battery: "5600 mAh | 65W", display: "7.8\" Foldable", score: 96, image: oneplusImg, isNew: true, rating: 4.7, ratingCount: "340" },
  ],
  Motorola: [
    { name: "Edge 50 Pro", price: "$549", chip: "Snapdragon 7 Gen 4", ram: "12 GB", camera: "50 MP", battery: "5000 mAh | 68W", display: "6.7\" 144Hz pOLED", score: 91, image: motorolaImg, rating: 4.4, ratingCount: "923" },
    { name: "Razr 50 Ultra", price: "$999", chip: "Snapdragon 8s Gen 3", ram: "12 GB", camera: "50 MP", battery: "4000 mAh | 65W", display: "6.9\" 165Hz pOLED", score: 92, image: motorolaImg, isNew: true, rating: 4.5, ratingCount: "610" },
    { name: "Moto G85 5G", price: "$299", chip: "Snapdragon 6s Gen 3", ram: "8 GB", camera: "50 MP", battery: "5000 mAh | 33W", display: "6.67\" 120Hz AMOLED", score: 79, image: motorolaImg, rating: 4.2, ratingCount: "1.4K" },
    { name: "Edge 50 Ultra", price: "$799", chip: "Snapdragon 8 Gen 3", ram: "12 GB", camera: "50 MP", battery: "4500 mAh | 125W", display: "6.67\" 165Hz OLED", score: 94, image: motorolaImg, rating: 4.5, ratingCount: "780" },
  ],
  Xiaomi: [
    { name: "Xiaomi 17 Ultra", price: "$1,099", chip: "Snapdragon 8 Elite 2", ram: "16 GB", camera: "200 MP", battery: "6500 mAh | 90W", display: "6.85\" 120Hz AMOLED", score: 98, image: xiaomiImg, isNew: true, rating: 4.7, ratingCount: "441" },
    { name: "Xiaomi 17", price: "$799", chip: "Snapdragon 8 Elite", ram: "12 GB", camera: "50 MP", battery: "5500 mAh | 90W", display: "6.7\" 120Hz AMOLED", score: 94, image: xiaomiImg, isNew: true, rating: 4.6, ratingCount: "830" },
    { name: "Redmi Note 15 Pro", price: "$299", chip: "Snapdragon 7s Gen 3", ram: "8 GB", camera: "200 MP", battery: "5110 mAh | 45W", display: "6.77\" 120Hz AMOLED", score: 83, image: xiaomiImg, rating: 4.4, ratingCount: "5.6K" },
    { name: "POCO F7 Pro", price: "$499", chip: "Snapdragon 8 Gen 3", ram: "12 GB", camera: "50 MP", battery: "5000 mAh | 120W", display: "6.67\" 144Hz AMOLED", score: 91, image: xiaomiImg, rating: 4.5, ratingCount: "2.1K" },
  ],
  Realme: [
    { name: "Realme 13 Pro+", price: "$399", chip: "Snapdragon 7s Gen 2", ram: "8 GB", camera: "50 MP", battery: "5000 mAh | 67W", display: "6.7\" 120Hz AMOLED", score: 85, image: realmeImg, rating: 4.3, ratingCount: "3.1K" },
    { name: "Realme GT 7 Pro", price: "$599", chip: "Snapdragon 8 Elite", ram: "12 GB", camera: "50 MP", battery: "6500 mAh | 120W", display: "6.78\" 144Hz AMOLED", score: 93, image: realmeImg, isNew: true, rating: 4.5, ratingCount: "890" },
    { name: "Realme P4 Power", price: "$249", chip: "Snapdragon 7s Gen 2", ram: "6 GB", camera: "50 MP", battery: "7000 mAh | 30W", display: "6.72\" 120Hz AMOLED", score: 77, image: realmeImg, rating: 4.2, ratingCount: "4.4K" },
  ],
  Google: [
    { name: "Pixel 10 Pro", price: "$999", chip: "Google Tensor G5", ram: "12 GB", camera: "50 MP", battery: "5060 mAh | 45W", display: "6.3\" 120Hz OLED", score: 96, image: googleImg, isNew: true, rating: 4.5, ratingCount: "1.6K" },
    { name: "Pixel 10", price: "$699", chip: "Google Tensor G5", ram: "8 GB", camera: "50 MP", battery: "4700 mAh | 27W", display: "6.1\" 120Hz OLED", score: 91, image: googleImg, isNew: true, rating: 4.4, ratingCount: "980" },
    { name: "Pixel 9a", price: "$499", chip: "Google Tensor G4", ram: "8 GB", camera: "48 MP", battery: "5100 mAh | 18W", display: "6.1\" 120Hz OLED", score: 87, image: googleImg, rating: 4.3, ratingCount: "1.2K" },
    { name: "Pixel 10 Pro XL", price: "$1,099", chip: "Google Tensor G5", ram: "16 GB", camera: "50 MP", battery: "5060 mAh | 45W", display: "6.8\" 120Hz OLED", score: 97, image: googleImg, isNew: true, rating: 4.6, ratingCount: "740" },
  ],
  Vivo: [
    { name: "Vivo X200 Pro", price: "$849", chip: "Dimensity 9400", ram: "12 GB", camera: "200 MP", battery: "6000 mAh | 90W", display: "6.82\" 120Hz AMOLED", score: 94, image: vivoImg, isNew: true, rating: 4.6, ratingCount: "711" },
    { name: "Vivo V50", price: "$449", chip: "Snapdragon 7 Gen 3", ram: "8 GB", camera: "50 MP", battery: "6000 mAh | 90W", display: "6.77\" 120Hz AMOLED", score: 85, image: vivoImg, rating: 4.3, ratingCount: "1.5K" },
    { name: "iQOO 13", price: "$699", chip: "Snapdragon 8 Elite", ram: "16 GB", camera: "50 MP", battery: "6150 mAh | 120W", display: "6.82\" 144Hz AMOLED", score: 95, image: vivoImg, isNew: true, rating: 4.7, ratingCount: "930" },
  ],
};

const defaultPhones = (brandName: string, color: string) => [
  { name: `${brandName} Flagship Pro`, price: "$699", chip: "Snapdragon 8 Gen 3", ram: "12 GB", camera: "50 MP", battery: "5000 mAh | 67W", display: "6.7\" 120Hz AMOLED", score: 90, image: samsungImg, isNew: true, rating: 4.4, ratingCount: "1.2K" },
  { name: `${brandName} Ultra X`, price: "$999", chip: "Dimensity 9300", ram: "16 GB", camera: "200 MP", battery: "6000 mAh | 120W", display: "6.9\" 144Hz AMOLED", score: 95, image: samsungImg, rating: 4.6, ratingCount: "780" },
  { name: `${brandName} Mid 5G`, price: "$399", chip: "Snapdragon 7s Gen 2", ram: "8 GB", camera: "64 MP", battery: "5500 mAh | 33W", display: "6.72\" 90Hz AMOLED", score: 80, image: samsungImg, rating: 4.2, ratingCount: "3.4K" },
  { name: `${brandName} Budget Pro`, price: "$249", chip: "Helio G99 Ultra", ram: "6 GB", camera: "48 MP", battery: "6000 mAh | 18W", display: "6.5\" 60Hz IPS", score: 68, image: samsungImg, rating: 4.0, ratingCount: "5.1K" },
];

// ─── Score Badge ──────────────────────────────────────────────────────────────
function ScoreBadge({ score }: { score: number }) {
  const bg = score >= 90 ? "from-green-600 to-green-700" : score >= 75 ? "from-amber-500 to-amber-600" : "from-red-500 to-red-600";
  return (
    <div className={`bg-gradient-to-br ${bg} text-white rounded-lg px-2 py-1.5 text-center shadow-lg shrink-0 absolute top-2 left-2`}>
      <div className="text-sm font-black leading-none">{score}%</div>
      <div className="text-[8px] font-semibold opacity-90 leading-tight">Spec<br />Score</div>
    </div>
  );
}

// ─── Brand Logo ───────────────────────────────────────────────────────────────
function BrandLogo({ brand, size = "md" }: { brand: typeof allBrands[0]; size?: "sm" | "md" | "lg" | "xl" }) {
  const dims = { sm: "w-10 h-10", md: "w-14 h-14", lg: "w-20 h-20", xl: "w-28 h-28" }[size];
  const imgDims = { sm: "w-6 h-6", md: "w-8 h-8", lg: "w-11 h-11", xl: "w-16 h-16" }[size];

  return (
    <div
      className={`${dims} rounded-2xl flex items-center justify-center relative overflow-hidden shrink-0`}
      style={{
        background: `linear-gradient(135deg, ${brand.color}22 0%, ${brand.color}08 100%)`,
        border: `1.5px solid ${brand.color}35`,
      }}
    >
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 30% 30%, ${brand.color}28, transparent 65%)` }} />
      {brand.logo ? (
        <img
          src={brand.logo}
          alt={brand.name}
          className={`${imgDims} object-contain relative z-10`}
          onError={(e) => {
            e.currentTarget.style.display = "none";
            const parent = e.currentTarget.parentElement;
            if (parent && !parent.querySelector("span.fallback")) {
              const span = document.createElement("span");
              span.className = "fallback font-black text-center relative z-10";
              span.style.color = brand.color;
              span.style.fontSize = size === "xl" ? "18px" : size === "lg" ? "13px" : "10px";
              span.textContent = brand.name.slice(0, 3).toUpperCase();
              parent.appendChild(span);
            }
          }}
        />
      ) : (
        <span className="font-black relative z-10" style={{ color: brand.color, fontSize: size === "xl" ? "18px" : "11px" }}>
          {brand.name.slice(0, 3).toUpperCase()}
        </span>
      )}
    </div>
  );
}

// ─── Individual Brand Page ─────────────────────────────────────────────────────
function BrandDetailPage({ brand, onBack }: { brand: typeof allBrands[0]; onBack: () => void }) {
  const phones = (brandPhones[brand.name] || defaultPhones(brand.name, brand.color));
  const [filter, setFilter] = useState("All");
  const tabs = ["All", "Flagship", "Mid-Range", "Budget"];

  const filtered = phones.filter(p => {
    if (filter === "Flagship") return p.price.replace(/[^0-9]/g, "") > "700";
    if (filter === "Mid-Range") return p.price.replace(/[^0-9]/g, "") >= "300" && p.price.replace(/[^0-9]/g, "") <= "700";
    if (filter === "Budget") return p.price.replace(/[^0-9]/g, "") < "300";
    return true;
  });

  return (
    <div>
      {/* Brand Hero Banner */}
      <div
        className="relative overflow-hidden rounded-2xl mb-6"
        style={{ background: `linear-gradient(135deg, ${brand.color}25 0%, ${brand.color}10 50%, transparent 100%)`, border: `1px solid ${brand.color}30` }}
      >
        {/* Background glow orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full blur-3xl opacity-30" style={{ background: brand.color }} />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20" style={{ background: brand.color }} />
          <div className="absolute inset-0 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 p-6 sm:p-8">
          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6 group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            All Brands
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <BrandLogo brand={brand} size="xl" />

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{brand.name}</h1>
                <span className="glass border px-3 py-1 rounded-full text-xs font-bold" style={{ borderColor: brand.color + "40", color: brand.color }}>
                  {brand.devices} Devices
                </span>
              </div>
              <p className="text-muted-foreground text-sm italic mb-4">"{brand.tagline}"</p>

              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Founded", value: brand.founded },
                  { label: "HQ", value: brand.hq },
                  { label: "Total Devices", value: `${brand.devices}+` },
                ].map(stat => (
                  <div key={stat.label} className="glass rounded-xl px-4 py-2.5" style={{ borderColor: brand.color + "25" }}>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</p>
                    <p className="text-sm font-bold mt-0.5">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter tabs + count */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="flex items-center gap-2 glass-card rounded-xl p-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                filter === tab
                  ? "text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={filter === tab ? { background: brand.color } : {}}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={13} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{filtered.length}</span> phones
          </span>
        </div>
      </div>

      {/* Phone grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((phone, i) => (
          <a
            key={i}
            href="#"
            className="glass-card rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 hover:border-primary/25 transition-all duration-300 group block"
          >
            {/* Top accent */}
            <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${brand.color}60, ${brand.color}20, transparent)` }} />

            {/* Phone image area */}
            <div
              className="relative h-48 flex items-center justify-center overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${brand.color}12, ${brand.color}04)` }}
            >
              <ScoreBadge score={phone.score} />
              {phone.isNew && (
                <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                  style={{ background: `${brand.color}25`, color: brand.color, border: `1px solid ${brand.color}40` }}>
                  New
                </span>
              )}
              <img
                src={phone.image}
                alt={phone.name}
                className="h-full w-auto max-w-[65%] object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-xl"
              />
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2.5">
                <div>
                  <h3 className="font-black text-sm leading-tight group-hover:text-primary transition-colors">{phone.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={10} className="text-amber-500 fill-amber-500" />
                    <span className="text-xs font-semibold">{phone.rating}</span>
                    <span className="text-xs text-muted-foreground">({phone.ratingCount})</span>
                  </div>
                </div>
                <span className="font-black text-base" style={{ color: brand.color }}>{phone.price}</span>
              </div>

              {/* Spec pills */}
              <div className="grid grid-cols-2 gap-1.5 mb-3">
                {[
                  { icon: Cpu, label: phone.chip },
                  { icon: MemoryStick, label: phone.ram + " RAM" },
                  { icon: Camera, label: phone.camera + " Camera" },
                  { icon: Battery, label: phone.battery },
                  { icon: Monitor, label: phone.display },
                ].map((s, j) => (
                  <div key={j} className={`flex items-center gap-1.5 text-[11px] text-muted-foreground ${j === 4 ? "col-span-2" : ""}`}>
                    <div className="w-4 h-4 glass rounded-md flex items-center justify-center shrink-0">
                      <s.icon size={9} className="text-primary/70" />
                    </div>
                    <span className="line-clamp-1">{s.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2.5 border-t border-white/8">
                <a href="#" className="flex-1 text-center text-primary text-xs font-bold hover:underline flex items-center justify-center gap-1">
                  View Specs <ChevronRight size={11} />
                </a>
                <button className="glass border border-white/10 text-xs font-semibold px-2.5 py-1 rounded-lg hover:border-primary/30 transition-all text-muted-foreground hover:text-primary flex items-center gap-1">
                  <GitCompare size={10} /> Compare
                </button>
                <a href="#" className="glass border border-white/10 text-xs font-semibold px-2.5 py-1 rounded-lg hover:border-primary/30 transition-all text-muted-foreground hover:text-primary flex items-center gap-1">
                  <ExternalLink size={10} /> Buy
                </a>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* View All CTA */}
      <div className="mt-6 glass-card rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="font-bold">See all {brand.name} phones</p>
          <p className="text-xs text-muted-foreground">{brand.devices} devices in our database</p>
        </div>
        <a href="#" className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 shadow-lg"
          style={{ background: brand.color }}>
          Browse All <ChevronRight size={14} />
        </a>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
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
                <p className="text-white/50 text-sm mt-1">Complete lineup · {allBrands.find(b => b.name === selectedBrand)?.devices} devices</p>
              </div>
            ) : (
              <div>
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
                    className="w-full glass border border-white/15 text-white placeholder-white/30 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/30 transition-all"
                  />
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
          {/* Brand detail view */}
          {selectedBrand && selectedBrandData ? (
            <BrandDetailPage brand={selectedBrandData} onBack={() => setSelectedBrand(null)} />
          ) : (
            <>
              {/* Controls */}
              <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <span className="text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">{filtered.length}</span> brands
                </span>
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
                    <button onClick={() => setViewMode("grid")} className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}>
                      <Grid3X3 size={14} />
                    </button>
                    <button onClick={() => setViewMode("list")} className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}>
                      <List size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Featured brands */}
              {featured.length > 0 && !search && (
                <div className="mb-8">
                  <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-primary rounded-full" />
                    Featured Brands
                  </h2>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {featured.map((brand, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedBrand(brand.name)}
                        className="glass-card rounded-2xl p-4 flex flex-col items-center gap-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                      >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                          style={{ background: `radial-gradient(circle at 50% 30%, ${brand.color}18, transparent 70%)` }} />
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

              {/* All brands */}
              <div>
                <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full" />
                  {search ? `Results for "${search}"` : "All Brands"}
                </h2>

                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {(search ? filtered : others).map((brand, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedBrand(brand.name)}
                        className="glass-card rounded-xl p-3.5 flex flex-col items-center gap-2.5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group relative overflow-hidden"
                      >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ background: `radial-gradient(circle at 50% 30%, ${brand.color}12, transparent 70%)` }} />
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
                    {(search ? filtered : others).map((brand, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedBrand(brand.name)}
                        className="w-full flex items-center gap-4 px-4 py-3.5 border-b border-white/8 last:border-0 hover:bg-primary/5 transition-colors group"
                      >
                        <BrandLogo brand={brand} size="sm" />
                        <div className="flex-1 text-left">
                          <p className="text-sm font-semibold group-hover:text-primary transition-colors">{brand.name}</p>
                          <p className="text-xs text-muted-foreground">{brand.founded} · {brand.hq}</p>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">{brand.devices} devices</span>
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
