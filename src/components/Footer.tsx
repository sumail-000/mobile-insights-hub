import { Facebook, Twitter, Youtube, Instagram, ChevronRight, Smartphone, Cpu } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  { label: "Compare", href: "/compare" },
  { label: "Phone Finder", href: "/phone-finder" },
  { label: "Brands", href: "/brands" },
  { label: "Top 10", href: "/top-10" },
  { label: "News & Reviews", href: "/news" },
  { label: "Upcoming Mobiles", href: "/upcoming" },
  { label: "About Us", href: "/" },
  { label: "Contact Us", href: "/" },
  { label: "Privacy Policy", href: "/" },
  { label: "Terms & Conditions", href: "/" },
  { label: "Mobile Specifications Database", href: "/phone-finder" },
];

const newPhones = [
  { name: "Samsung Galaxy F70e", slug: "samsung-galaxy-f70e" },
  { name: "Apple iPhone 17e", slug: "apple-iphone-17e" },
  { name: "OnePlus 15R", slug: "oneplus-15r" },
  { name: "Infinix GT 50 Pro", slug: "infinix-gt-50-pro" },
  { name: "Samsung Galaxy S26 Ultra", slug: "samsung-galaxy-s26-ultra" },
  { name: "Xiaomi 17 Ultra", slug: "xiaomi-17-ultra" },
  { name: "Google Pixel 10 Pro", slug: "google-pixel-10-pro" },
  { name: "OnePlus Open 2", slug: "oneplus-open-2" },
  { name: "Vivo X200 Pro", slug: "vivo-x200-pro" },
  { name: "Motorola Razr 50 Ultra", slug: "motorola-razr-50-ultra" },
  { name: "Realme GT 7 Pro", slug: "realme-gt-7-pro" },
  { name: "iPhone 17 Pro Max", slug: "iphone-17-pro-max" },
];

export default function Footer() {
  return (
    <footer className="mt-6 bg-foreground text-background">
      {/* Main footer links */}
      <div className="border-b border-background/10 py-4">
        <div className="px-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {footerLinks.map((link, i) => (
            <Link key={i} href={link.href} className="text-background/70 hover:text-primary text-xs transition-colors">
              {link.label}
            </Link>
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
                <Link key={i} href={`/phone/${phone.slug}`} className="text-background/60 hover:text-primary text-xs py-0.5 transition-colors">
                  {phone.name}
                </Link>
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
