import { Facebook, Twitter, Youtube, Instagram, ChevronRight, Smartphone, Cpu } from "lucide-react";

const footerLinks = [
  "Contact Us", "Compare", "Phone Finder", "Top 10", "Privacy Policy", "Sitemap", "About Us", "Terms & Conditions", "Mobile Specifications Database",
];

const newPhones = [
  "Samsung Galaxy F70e", "Apple iPhone 17e", "Lava Yuva Star 3", "OnePlus 15R",
  "Oppo A6i+", "Infinix GT 50 Pro", "Oppo A6x 4G", "Oppo A6v",
  "Samsung Galaxy S26 Ultra", "Oppo K14x 5G", "Lava Bold N2", "Xiaomi 17 Ultra",
];

export default function Footer() {
  return (
    <footer className="mt-6 bg-foreground text-background">
      {/* Main footer links */}
      <div className="border-b border-background/10 py-4">
        <div className="px-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {footerLinks.map((link, i) => (
            <a key={i} href="#" className="text-background/70 hover:text-primary text-xs transition-colors">
              {link}
            </a>
          ))}
        </div>
      </div>

      {/* New phones grid */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-4">
            <h4 className="text-background/90 font-bold text-sm mb-3 uppercase tracking-wide">New Mobile Phones</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
              {newPhones.map((phone, i) => (
                <a key={i} href="#" className="text-background/60 hover:text-primary text-xs py-0.5 transition-colors">
                  {phone}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Social + copyright */}
        <div className="border-t border-background/10 mt-6 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-background/50 text-xs">Connect with us on Social media</p>
            <div className="flex items-center gap-3 mt-2">
              {[Facebook, Twitter, Youtube, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="text-background/50 hover:text-primary transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1.5 justify-center mb-1">
              <div className="bg-primary rounded px-1.5 py-0.5 flex items-center gap-1">
                <Smartphone size={12} className="text-white" />
                <Cpu size={10} className="text-white" />
              </div>
              <span className="text-background/90 font-bold text-lg">PhoneSpecs</span>
            </div>
            <p className="text-background/40 text-xs">© 2026 PhoneSpecs. All rights reserved.</p>
            <p className="text-background/30 text-xs">The ultimate mobile phone specifications database.</p>
          </div>
          <a href="#" className="text-primary text-xs font-semibold hover:underline flex items-center gap-1">
            Report a Bug <ChevronRight size={10} />
          </a>
        </div>
      </div>
    </footer>
  );
}
