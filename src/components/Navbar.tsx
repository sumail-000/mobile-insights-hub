import { useState } from "react";
import { Search, Menu, X, ChevronDown, Smartphone, Cpu } from "lucide-react";

const navItems = [
  { label: "Mobiles & Tablets", hasDropdown: true },
  { label: "Top 10", hasDropdown: true },
  { label: "Compare", hasDropdown: true },
  { label: "Upcoming Mobiles", hasDropdown: false },
  { label: "News & Reviews", hasDropdown: true },
  { label: "Brands", hasDropdown: true },
];

const latestMobiles = ["Samsung Galaxy S26 Ultra", "Apple iPhone 17e", "Xiaomi 17 Pro Max", "OnePlus 15R"];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header>
      {/* Top ticker bar */}
      <div className="nav-bg border-b border-white/10 px-4 py-1.5 text-xs hidden md:flex items-center gap-6 overflow-hidden">
        <span className="text-white/50 whitespace-nowrap">LATEST MOBILES:</span>
        {latestMobiles.map((m, i) => (
          <a key={i} href="#" className="text-primary hover:underline whitespace-nowrap">{m}</a>
        ))}
      </div>

      {/* Main nav */}
      <div className="nav-bg shadow-lg">
        <div className="max-w-screen-xl mx-auto px-4 flex items-center gap-4 h-14">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-primary rounded px-2 py-1 flex items-center gap-1">
              <Smartphone size={16} className="text-white" />
              <Cpu size={14} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">PhoneSpecs</span>
          </a>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-xl relative mx-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products or brands"
              className="w-full bg-white/10 text-white placeholder-white/50 rounded px-4 py-2 pr-10 text-sm border border-white/20 focus:outline-none focus:border-primary focus:bg-white/15"
            />
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50" />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <a href="#" className="text-white/80 hover:text-white text-sm hidden md:block">Login/Signup</a>
            <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Nav links */}
        <div className="hidden md:block border-t border-white/10">
          <div className="max-w-screen-xl mx-auto px-4 flex items-center gap-1">
            {navItems.map((item, i) => (
              <a
                key={i}
                href="#"
                className="flex items-center gap-1 px-3 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors whitespace-nowrap"
              >
                {item.label}
                {item.hasDropdown && <ChevronDown size={12} className="opacity-60" />}
              </a>
            ))}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 px-4 py-3 space-y-1">
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search for products or brands"
                className="w-full bg-white/10 text-white placeholder-white/50 rounded px-4 py-2 pr-10 text-sm border border-white/20 focus:outline-none"
              />
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50" />
            </div>
            {navItems.map((item, i) => (
              <a key={i} href="#" className="block px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded">
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
