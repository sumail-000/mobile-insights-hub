"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { searchDevices } from "@/lib/api";
import type { Device } from "@/lib/api";

const navItems = [
  { label: "Mobiles & Tablets", hasDropdown: true, href: "/phone-finder" },
  { label: "Top 10", hasDropdown: false, href: "/top-10" },
  { label: "Compare", hasDropdown: false, href: "/compare" },
  { label: "Upcoming Mobiles", hasDropdown: false, href: "/upcoming" },
  { label: "News & Reviews", hasDropdown: false, href: "/news" },
  { label: "Phone Finder", hasDropdown: false, href: "/phone-finder" },
  { label: "Brands", hasDropdown: false, href: "/brands" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Device[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuth();
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (q.length < 2) { setSearchResults([]); setSearchOpen(false); return; }
    searchTimer.current = setTimeout(async () => {
      try {
        const res = await searchDevices(q);
        setSearchResults(res.results.slice(0, 6));
        setSearchOpen(true);
      } catch { setSearchResults([]); }
    }, 300);
  };

  const handleSearchSelect = (slug: string) => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchOpen(false);
    router.push(`/phone/${slug}`);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full" style={{ backgroundColor: "hsl(220, 25%, 8%)" }}>
      {/* Main nav row */}
      <div className="flex items-center gap-4 px-4 h-14 border-b border-white/10">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <span className="font-bold text-xl tracking-tight"><span className="text-white">Mobile</span><span className="text-primary">PhoneCompare</span></span>
        </Link>

        {/* Search bar */}
        <div className="hidden md:flex flex-1 relative mx-4" ref={searchRef}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
            placeholder="Search phones or brands..."
            className="w-full bg-white/10 text-white placeholder-white/40 rounded-lg px-4 py-2 pr-10 text-sm border border-white/15 focus:outline-none focus:border-primary/70 focus:bg-white/15 transition-colors"
          />
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40" />
          {/* Search dropdown */}
          {searchOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-border/30 overflow-hidden z-50">
              {searchResults.map((r) => (
                <button
                  key={r.slug}
                  onClick={() => handleSearchSelect(r.slug)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 transition-colors text-left"
                >
                  <img src={r.thumbnail} alt={r.name} className="w-8 h-8 object-contain rounded shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.brand} · {r.display_size || ''}</p>
                  </div>
                </button>
              ))}
              <Link
                href={`/phone-finder?search=${encodeURIComponent(searchQuery)}`}
                onClick={() => setSearchOpen(false)}
                className="flex items-center justify-center gap-1 py-2.5 text-xs text-primary font-semibold border-t border-border/20 hover:bg-primary/5"
              >
                <Search size={11} /> View all results
              </Link>
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2 shrink-0">
          {isLoggedIn && user ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-white/90 max-w-[100px] truncate">{user.name}</span>
                <ChevronDown size={12} className="text-white/50" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-2xl border border-border/20 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-border/20">
                    <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden md:block text-sm font-medium text-white/70 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="hidden md:block text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-colors px-4 py-1.5 rounded-lg shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Nav links row */}
      <div className="hidden md:flex items-center gap-0 px-2 border-b border-white/10">
        {navItems.map((item, i) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={i}
              href={item.href}
              className={`flex items-center gap-1 px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap border-b-2 -mb-px ${
                isActive
                  ? "text-primary border-primary"
                  : "text-white/70 hover:text-white border-transparent hover:border-white/20"
              }`}
            >
              {item.label}
              {item.hasDropdown && <ChevronDown size={12} className="opacity-50 mt-px" />}
            </Link>
          );
        })}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 px-4 py-3 space-y-1">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search phones or brands..."
              className="w-full bg-white/10 text-white placeholder-white/40 rounded-lg px-4 py-2 pr-10 text-sm border border-white/15 focus:outline-none"
            />
            <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40" />
          </div>
          {navItems.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {item.label}
              {item.hasDropdown && <ChevronDown size={14} className="opacity-50" />}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/10 flex gap-2">
            {isLoggedIn && user ? (
              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-white/10 rounded-lg border border-white/15"
              >
                <LogOut size={14} /> Sign out
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-3 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg border border-white/15">Login</Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-3 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
