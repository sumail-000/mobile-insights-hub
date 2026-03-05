import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../index.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "PhoneSpecs — Mobile Phone Specifications Database",
    template: "%s | PhoneSpecs",
  },
  description: "The ultimate mobile phone specifications database. Compare phones, explore brands, find your perfect device.",
  keywords: ["mobile phones", "phone specs", "specifications", "compare phones", "smartphone database"],
  openGraph: {
    type: "website",
    siteName: "PhoneSpecs",
    title: "PhoneSpecs — Mobile Phone Specifications Database",
    description: "The ultimate mobile phone specifications database.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
