"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search } from "lucide-react";
import Link from "next/link";
import BrandsSection from "@/components/BrandsSection";
import HeroFinder from "@/components/HeroFinder";
import PhonesSection from "@/components/PhonesSection";
import NewsSection from "@/components/NewsSection";
import TopPhonesSection from "@/components/TopPhonesSection";
import { getDevices } from "@/lib/api";

const BRAND_COLORS: Record<string, string> = {
  Samsung: "#1428A0", Apple: "#555555", Xiaomi: "#FF6900", OnePlus: "#F5010C",
  Google: "#4285F4", Motorola: "#5C8EE6", Vivo: "#415FFF", OPPO: "#1D4289",
  Realme: "#FFD600", Sony: "#aaaaaa", Nokia: "#124191", Huawei: "#CF0A2C",
};

function toBgColor(brand: string) {
  const c = BRAND_COLORS[brand] || "#ff6e14";
  return c + "18";
}

type PhoneItem = { name: string; slug: string; bgColor: string; accentColor: string; image?: string };

export default function HomePage() {
  const [latestPhones, setLatestPhones] = useState<PhoneItem[]>([]);
  const [popularPhones, setPopularPhones] = useState<PhoneItem[]>([]);

  useEffect(() => {
    getDevices({ sort: "newest", limit: 12 }).then(res => {
      setLatestPhones(res.devices.map(d => ({
        name: d.name,
        slug: d.slug,
        bgColor: toBgColor(d.brand),
        accentColor: BRAND_COLORS[d.brand] || "#ff6e14",
        image: d.thumbnail || undefined,
      })));
    }).catch(() => {});

    getDevices({ sort: "fans", limit: 12 }).then(res => {
      setPopularPhones(res.devices.map(d => ({
        name: d.name,
        slug: d.slug,
        bgColor: toBgColor(d.brand),
        accentColor: BRAND_COLORS[d.brand] || "#ff6e14",
        image: d.thumbnail || undefined,
      })));
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen page-bg">
      <Navbar />
      <main>
        <HeroFinder />
        <BrandsSection />
        <PhonesSection title="Latest Mobiles" phones={latestPhones} viewAllHref="/phone-finder?sort=newest" />
        <PhonesSection title="Most Popular Mobiles" phones={popularPhones} viewAllHref="/phone-finder?sort=fans" />
        <NewsSection />
        <TopPhonesSection />

        {/* Phone Finder banner */}
        <section className="px-4 py-3">
          <div className="glass-card rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <div className="absolute left-1/3 top-0 bottom-0 w-32 rounded-full bg-blue-500/5 blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                <Search size={22} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1">Complete Phone Finder</h2>
                <p className="text-muted-foreground text-sm">Filter by brand, price, specs, and more to find the perfect phone for you.</p>
              </div>
            </div>
            <Link href="/phone-finder" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors whitespace-nowrap shadow-lg shrink-0">
              Launch Phone Finder
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
