import Navbar from "@/components/Navbar";
import HeroFinder from "@/components/HeroFinder";
import BrandsSection from "@/components/BrandsSection";
import PhonesSection from "@/components/PhonesSection";
import NewsSection from "@/components/NewsSection";
import TopPhonesSection from "@/components/TopPhonesSection";
import Footer from "@/components/Footer";
import { Search } from "lucide-react";


const upcomingPhones = [
  { name: "Acera Prime", bgColor: "#f0f0f8", accentColor: "#5a5a8a" },
  { name: "Vivo V70", bgColor: "#f8f0f0", accentColor: "#8a3a3a" },
  { name: "iQOO 15R", bgColor: "#f0f0f0", accentColor: "#3a3a3a" },
  { name: "Samsung Galaxy S26 Ultra", score: 99, scoreColor: "high" as const, bgColor: "#f0f4f8", accentColor: "#1428A0" },
  { name: "Xiaomi 17 Pro Max", bgColor: "#f8f3f0", accentColor: "#FF6900" },
  { name: "OnePlus 15R", bgColor: "#f8f0f0", accentColor: "#F5010C" },
];

const latestPhones = [
  { name: "Realme P4 Power", price: "$299", score: 87, scoreColor: "mid" as const, bgColor: "#fff8f0", accentColor: "#FFD600" },
  { name: "Motorola Signature", price: "$699", score: 97, scoreColor: "high" as const, bgColor: "#f0f4f8", accentColor: "#002B5C" },
  { name: "Oppo Reno15", price: "$549", score: 90, scoreColor: "high" as const, bgColor: "#f0f8ff", accentColor: "#1D4289" },
  { name: "Motorola Edge 70", price: "$369", score: 89, scoreColor: "mid" as const, bgColor: "#f5f5f5", accentColor: "#555" },
  { name: "OnePlus 15R", price: "$579", score: 95, scoreColor: "high" as const, bgColor: "#fff0f0", accentColor: "#F5010C" },
  { name: "Xiaomi 17 Ultra", price: "$1099", score: 98, scoreColor: "high" as const, bgColor: "#f8f3f0", accentColor: "#FF6900" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroFinder />
        <BrandsSection />
        <PhonesSection title="Upcoming Mobiles" phones={upcomingPhones} />
        <PhonesSection title="Latest and Popular Mobiles" phones={latestPhones} />
        <NewsSection />
        <TopPhonesSection />

        {/* Phone Finder quick access banner */}
        <section className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="bg-gradient-to-r from-foreground to-foreground/80 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
            {/* Glass orb decoration */}
            <div className="absolute right-32 top-0 bottom-0 w-32 rounded-full bg-primary/10 blur-2xl pointer-events-none"></div>
            <div className="flex items-center gap-3">
              <div className="glass rounded-xl p-3">
                <Search size={22} className="text-white" />
              </div>
              <div>
                <h2 className="text-background text-xl font-bold mb-1">Complete Phone Finder</h2>
                <p className="text-background/60 text-sm">Filter by brand, price, specs, and more to find the perfect phone for you.</p>
              </div>
            </div>
            <a href="/phone-finder" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors whitespace-nowrap shadow-lg">
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
