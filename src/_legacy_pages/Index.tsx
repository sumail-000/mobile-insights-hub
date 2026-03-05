import Navbar from "@/components/Navbar";
import HeroFinder from "@/components/HeroFinder";
import BrandsSection from "@/components/BrandsSection";
import PhonesSection, { samsungImg, iphoneImg, oneplusImg, motorolaImg, xiaomiImg, realmeImg, googleImg, vivoImg } from "@/components/PhonesSection";
import NewsSection from "@/components/NewsSection";
import TopPhonesSection from "@/components/TopPhonesSection";
import Footer from "@/components/Footer";
import { Search } from "lucide-react";

const upcomingPhones = [
  { name: "Samsung Galaxy S26 Ultra", score: 99, scoreColor: "high" as const, bgColor: "#f0f4f8", accentColor: "#1428A0" },
  { name: "Xiaomi 17 Pro Max", bgColor: "#f8f3f0", accentColor: "#FF6900" },
  { name: "OnePlus 15R", bgColor: "#f8f0f0", accentColor: "#F5010C" },
  { name: "Acera Prime", bgColor: "#f0f0f8", accentColor: "#5a5a8a" },
  { name: "Vivo V70", bgColor: "#f8f0f0", accentColor: "#415FFF" },
  { name: "iQOO 15R", bgColor: "#f0f0f0", accentColor: "#3a3a3a" },
];

const latestPhones = [
  { name: "Samsung Galaxy S25 Ultra", price: "$1199", score: 97, scoreColor: "high" as const, bgColor: "#f0f4f8", accentColor: "#1428A0", image: samsungImg },
  { name: "iPhone 16 Pro Max", price: "$1199", score: 96, scoreColor: "high" as const, bgColor: "#f5f5f5", accentColor: "#555", image: iphoneImg },
  { name: "OnePlus 13", price: "$799", score: 94, scoreColor: "high" as const, bgColor: "#fff0f0", accentColor: "#F5010C", image: oneplusImg },
  { name: "Motorola Edge 50", price: "$369", score: 89, scoreColor: "mid" as const, bgColor: "#f0f4ff", accentColor: "#5C8EE6", image: motorolaImg },
  { name: "Xiaomi 15 Ultra", price: "$1099", score: 98, scoreColor: "high" as const, bgColor: "#f8f3f0", accentColor: "#FF6900", image: xiaomiImg },
  { name: "Realme P4", price: "$299", score: 87, scoreColor: "mid" as const, bgColor: "#fff8f0", accentColor: "#FFD600", image: realmeImg },
  { name: "Google Pixel 9 Pro", price: "$999", score: 95, scoreColor: "high" as const, bgColor: "#f0f4ff", accentColor: "#4285F4", image: googleImg },
  { name: "Vivo X200", price: "$699", score: 93, scoreColor: "high" as const, bgColor: "#f0f0ff", accentColor: "#415FFF", image: vivoImg },
];

const Index = () => {
  return (
    <div className="min-h-screen page-bg">
      <Navbar />
      <main>
        <HeroFinder />
        <BrandsSection />
        <PhonesSection title="Upcoming Mobiles" phones={upcomingPhones} viewAllHref="/upcoming" />
        <PhonesSection title="Latest and Popular Mobiles" phones={latestPhones} viewAllHref="/phone-finder" />
        <NewsSection />
        <TopPhonesSection />

        {/* Phone Finder quick access banner */}
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
            <a href="/phone-finder" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors whitespace-nowrap shadow-lg shrink-0">
              Launch Phone Finder
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
