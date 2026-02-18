import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ChevronRight, Star, GitCompare, ShoppingCart, Heart, Share2,
  Monitor, Cpu, MemoryStick, Camera, Battery, Wifi, Smartphone,
  ChevronLeft, ChevronDown, CheckCircle2, ExternalLink, Play,
  ArrowLeft, Zap, Shield, Globe, Bluetooth, Nfc, Volume2
} from "lucide-react";

import samsungImg from "@/assets/phones/samsung-s25-ultra.png";
import iphoneImg from "@/assets/phones/iphone-16-pro-max.png";
import oneplusImg from "@/assets/phones/oneplus-13.png";
import motorolaImg from "@/assets/phones/motorola-edge-50.png";
import xiaomiImg from "@/assets/phones/xiaomi-15-ultra.png";
import realmeImg from "@/assets/phones/realme-p4.png";
import googleImg from "@/assets/phones/google-pixel-9-pro.png";
import vivoImg from "@/assets/phones/vivo-x200.png";

// ─── Phone Database ────────────────────────────────────────────────────────────
const phonesDB: Record<string, PhoneData> = {
  "samsung-galaxy-s25-ultra": {
    id: "samsung-galaxy-s25-ultra",
    name: "Samsung Galaxy S25 Ultra",
    brand: "Samsung",
    brandColor: "#1428A0",
    image: samsungImg,
    bgColor: "#f0f4f8",
    status: "Available",
    releaseDate: "January 2025",
    price: "$1,199",
    priceINR: "₹1,29,999",
    score: 97,
    scoreColor: "high" as const,
    userRating: 4.8,
    ratingCount: "4,737",
    verdict: "The Galaxy S25 Ultra is Samsung's best ever smartphone. With its Snapdragon 8 Elite chip, titanium design, and exceptional S Pen experience, it sets the benchmark for Android flagships in 2025.",
    quickSpecs: [
      { icon: Monitor, label: "Display", value: "6.9\" QHD+ AMOLED, 120Hz" },
      { icon: Cpu, label: "Chipset", value: "Snapdragon 8 Elite" },
      { icon: MemoryStick, label: "RAM", value: "12 GB / 16 GB" },
      { icon: Camera, label: "Main Camera", value: "200 MP + 50 MP + 10 MP" },
      { icon: Battery, label: "Battery", value: "5000 mAh, 45W Fast Charge" },
    ],
    specTable: [
      {
        category: "NETWORK",
        color: "#E53E3E",
        rows: [
          { label: "Technology", value: "GSM / HSPA / LTE / 5G" },
          { label: "5G Bands", value: "Sub-6 GHz & mmWave" },
        ],
      },
      {
        category: "LAUNCH",
        color: "#DD6B20",
        rows: [
          { label: "Announced", value: "2025, January 22" },
          { label: "Status", value: "Available. Released 2025, February 7" },
        ],
      },
      {
        category: "BODY",
        color: "#38A169",
        rows: [
          { label: "Dimensions", value: "162.8 x 77.6 x 8.2 mm" },
          { label: "Weight", value: "218 g" },
          { label: "Build", value: "Titanium frame, Corning Gorilla Armor 2, Ceramic back" },
          { label: "SIM", value: "Nano-SIM + eSIM" },
          { label: "Water Resistance", value: "IP68 dust/water resistant (up to 6m for 30 min)" },
        ],
      },
      {
        category: "DISPLAY",
        color: "#3182CE",
        rows: [
          { label: "Type", value: "Dynamic AMOLED 2X, 120Hz, 2600 nits (peak)" },
          { label: "Size", value: "6.9 inches, 114.4 cm²" },
          { label: "Resolution", value: "1440 x 3088 pixels (~493 ppi density)" },
          { label: "Protection", value: "Corning Gorilla Armor 2" },
          { label: "Always-on display", value: "Yes" },
        ],
      },
      {
        category: "PLATFORM",
        color: "#805AD5",
        rows: [
          { label: "OS", value: "Android 15, upgradable to Android 18" },
          { label: "Chipset", value: "Qualcomm SM8750 Snapdragon 8 Elite (3 nm)" },
          { label: "CPU", value: "Octa-core (2x4.47 GHz Oryon V2 & 6x3.53 GHz Oryon V2)" },
          { label: "GPU", value: "Adreno 830" },
        ],
      },
      {
        category: "MEMORY",
        color: "#D69E2E",
        rows: [
          { label: "Card slot", value: "No" },
          { label: "Internal", value: "256GB 12GB RAM, 512GB 12GB RAM, 512GB 16GB RAM, 1TB 16GB RAM" },
          { label: "Storage Type", value: "UFS 4.0" },
        ],
      },
      {
        category: "MAIN CAMERA",
        color: "#2B6CB0",
        rows: [
          { label: "Quad", value: "200 MP, f/1.7, 24mm (wide), multi-directional PDAF, OIS\n10 MP, f/2.4, 2x optical zoom, PDAF\n50 MP, f/3.4, 5x optical zoom, PDAF, OIS\n50 MP, f/2.2, 111˚ (ultrawide), AF" },
          { label: "Features", value: "LED flash, Auto-HDR, panorama, AI-powered scene optimizer" },
          { label: "Video", value: "8K@30fps, 4K@120fps, 1080p@240fps, HDR10+" },
        ],
      },
      {
        category: "SELFIE CAMERA",
        color: "#C05621",
        rows: [
          { label: "Single", value: "12 MP, f/2.2, 23mm (wide), Dual Pixel PDAF" },
          { label: "Video", value: "4K@60fps, 1080p@60fps" },
        ],
      },
      {
        category: "SOUND",
        color: "#2C7A7B",
        rows: [
          { label: "Loudspeaker", value: "Yes, with stereo speakers, Dolby Atmos" },
          { label: "3.5mm jack", value: "No" },
          { label: "Audio Features", value: "Hi-Res Audio, Hi-Res Audio Wireless" },
        ],
      },
      {
        category: "COMMS",
        color: "#2D3748",
        rows: [
          { label: "WLAN", value: "Wi-Fi 802.11 a/b/g/n/ac/6e/7, tri-band, Wi-Fi Direct" },
          { label: "Bluetooth", value: "5.4, A2DP, LE, aptX HD" },
          { label: "Positioning", value: "GPS, GLONASS, BeiDou, Galileo" },
          { label: "NFC", value: "Yes" },
          { label: "Infrared port", value: "No" },
          { label: "USB", value: "USB Type-C 3.2 Gen 2, OTG" },
        ],
      },
      {
        category: "FEATURES",
        color: "#553C9A",
        rows: [
          { label: "S Pen", value: "Yes, built-in" },
          { label: "Sensors", value: "Fingerprint (under display, ultrasonic), accelerometer, gyro, proximity, barometer, compass, SpO2, temperature" },
          { label: "Samsung Pay", value: "Yes, NFC + MST" },
        ],
      },
      {
        category: "BATTERY",
        color: "#276749",
        rows: [
          { label: "Type", value: "Li-Ion 5000 mAh, non-removable" },
          { label: "Charging", value: "45W wired, 50% in 30 min\n15W wireless (Qi2 Ready)\n4.5W reverse wireless" },
          { label: "Battery Life", value: "Up to 27 hours video playback" },
        ],
      },
      {
        category: "MISC",
        color: "#744210",
        rows: [
          { label: "Colors", value: "Titanium Black, Titanium Gray, Titanium Whitesilver, Titanium Blue" },
          { label: "Models", value: "SM-S938B, SM-S938B/DS, SM-S938U, SM-S938U1, SM-S938W" },
          { label: "SAR", value: "1.13 W/kg (head), 1.13 W/kg (body)" },
          { label: "Price", value: "From $1,199 / ₹1,29,999" },
        ],
      },
    ],
    relatedPhones: [
      { name: "Samsung S24 Ultra", image: samsungImg, price: "$999", score: 94 },
      { name: "iPhone 16 Pro Max", image: iphoneImg, price: "$1,199", score: 96 },
      { name: "Xiaomi 15 Ultra", image: xiaomiImg, price: "$1,099", score: 98 },
      { name: "OnePlus 13", image: oneplusImg, price: "$799", score: 94 },
    ],
  },

  // ─── iPhone 16 Pro Max ──────────────────────────────────────────────────────
  "iphone-16-pro-max": {
    id: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    brand: "Apple",
    brandColor: "#555555",
    image: iphoneImg,
    bgColor: "#f5f5f5",
    status: "Available",
    releaseDate: "September 2024",
    price: "$1,199",
    priceINR: "₹1,34,900",
    score: 96,
    scoreColor: "high" as const,
    userRating: 4.8,
    ratingCount: "8,219",
    verdict: "The iPhone 16 Pro Max is Apple's most capable iPhone yet. The A18 Pro chip delivers desktop-class performance, the Camera Control button is a genuinely useful hardware addition, and the 5x periscope zoom brings it level with Android's best.",
    quickSpecs: [
      { icon: Monitor, label: "Display", value: "6.9\" Super Retina XDR, 120Hz" },
      { icon: Cpu, label: "Chipset", value: "Apple A18 Pro" },
      { icon: MemoryStick, label: "RAM", value: "8 GB" },
      { icon: Camera, label: "Main Camera", value: "48 MP + 48 MP + 12 MP" },
      { icon: Battery, label: "Battery", value: "4685 mAh, 27W Fast Charge" },
    ],
    specTable: [
      {
        category: "NETWORK",
        color: "#E53E3E",
        rows: [
          { label: "Technology", value: "GSM / CDMA / HSPA / EVDO / LTE / 5G" },
          { label: "5G Bands", value: "Sub-6 GHz & mmWave (USA)" },
        ],
      },
      {
        category: "LAUNCH",
        color: "#DD6B20",
        rows: [
          { label: "Announced", value: "2024, September 9" },
          { label: "Status", value: "Available. Released 2024, September 20" },
        ],
      },
      {
        category: "BODY",
        color: "#38A169",
        rows: [
          { label: "Dimensions", value: "163 x 77.6 x 8.25 mm" },
          { label: "Weight", value: "227 g" },
          { label: "Build", value: "Glass front (Ceramic Shield), titanium frame, textured matte glass back" },
          { label: "SIM", value: "Nano-SIM + eSIM (USA: eSIM only)" },
          { label: "Water Resistance", value: "IP68 (up to 6m for 30 min)" },
        ],
      },
      {
        category: "DISPLAY",
        color: "#3182CE",
        rows: [
          { label: "Type", value: "LTPO Super Retina XDR OLED, 1-120Hz ProMotion, 2000 nits (peak)" },
          { label: "Size", value: "6.9 inches, 117.4 cm²" },
          { label: "Resolution", value: "1320 x 2868 pixels (~460 ppi density)" },
          { label: "Protection", value: "Ceramic Shield front, scratch-resistant glass back" },
          { label: "Always-on display", value: "Yes" },
        ],
      },
      {
        category: "PLATFORM",
        color: "#805AD5",
        rows: [
          { label: "OS", value: "iOS 18, upgradable to iOS 19" },
          { label: "Chipset", value: "Apple A18 Pro (3 nm)" },
          { label: "CPU", value: "Hexa-core (2x4.05 GHz Everest + 4x2.42 GHz Sawtooth)" },
          { label: "GPU", value: "Apple GPU (6-core)" },
        ],
      },
      {
        category: "MEMORY",
        color: "#D69E2E",
        rows: [
          { label: "Card slot", value: "No" },
          { label: "Internal", value: "256GB 8GB RAM, 512GB 8GB RAM, 1TB 8GB RAM" },
          { label: "Storage Type", value: "NVMe" },
        ],
      },
      {
        category: "MAIN CAMERA",
        color: "#2B6CB0",
        rows: [
          { label: "Triple", value: "48 MP, f/1.8, 24mm (wide), PDAF, sensor-shift OIS 2nd gen\n48 MP, f/2.8, 120mm (5x periscope telephoto), PDAF, OIS\n12 MP, f/2.2, 13mm, 120˚ (ultrawide), AF" },
          { label: "Camera Control", value: "Dedicated hardware button for quick camera access" },
          { label: "Features", value: "Dual-LED dual-tone flash, HDR, panorama, AI scene detection" },
          { label: "Video", value: "4K@120fps (ProRes), 4K@60fps, 1080p@240fps, Cinematic mode" },
        ],
      },
      {
        category: "SELFIE CAMERA",
        color: "#C05621",
        rows: [
          { label: "Single", value: "12 MP, f/1.9, 23mm (wide), PDAF" },
          { label: "Features", value: "SL 3D, (biometric sensor)" },
          { label: "Video", value: "4K@60fps, 1080p@120fps" },
        ],
      },
      {
        category: "SOUND",
        color: "#2C7A7B",
        rows: [
          { label: "Loudspeaker", value: "Yes, with stereo speakers, spatial audio" },
          { label: "3.5mm jack", value: "No" },
          { label: "Audio Features", value: "Dolby Atmos, Dolby Digital, Dolby Digital Plus, Apple Lossless" },
        ],
      },
      {
        category: "COMMS",
        color: "#2D3748",
        rows: [
          { label: "WLAN", value: "Wi-Fi 802.11 a/b/g/n/ac/6e/7, tri-band, Wi-Fi Direct, MIMO" },
          { label: "Bluetooth", value: "5.3, A2DP, LE" },
          { label: "Positioning", value: "GPS, GLONASS, BeiDou, Galileo" },
          { label: "NFC", value: "Yes (Apple Pay)" },
          { label: "Infrared port", value: "No" },
          { label: "USB", value: "USB Type-C 3.2 Gen 2, OTG" },
          { label: "Satellite", value: "Emergency SOS via satellite" },
        ],
      },
      {
        category: "FEATURES",
        color: "#553C9A",
        rows: [
          { label: "Face ID", value: "Yes, 3D face recognition" },
          { label: "Sensors", value: "Face ID, accelerometer, gyro, proximity, barometer, compass, Ultra Wideband" },
          { label: "Apple Intelligence", value: "Yes, on-device AI features" },
          { label: "Crash Detection", value: "Yes" },
        ],
      },
      {
        category: "BATTERY",
        color: "#276749",
        rows: [
          { label: "Type", value: "Li-Ion 4685 mAh, non-removable" },
          { label: "Charging", value: "27W wired, 50% in 30 min (MagSafe)\n25W MagSafe wireless\n15W Qi2 wireless" },
          { label: "Battery Life", value: "Up to 33 hours video playback" },
        ],
      },
      {
        category: "MISC",
        color: "#744210",
        rows: [
          { label: "Colors", value: "Black Titanium, White Titanium, Natural Titanium, Desert Titanium" },
          { label: "Models", value: "A3293, A3294, A3295, A3296" },
          { label: "SAR", value: "1.19 W/kg (head), 1.06 W/kg (body)" },
          { label: "Price", value: "From $1,199 / ₹1,34,900" },
        ],
      },
    ],
    relatedPhones: [
      { name: "Samsung Galaxy S25 Ultra", image: samsungImg, price: "$1,199", score: 97 },
      { name: "iPhone 15 Pro Max", image: iphoneImg, price: "$999", score: 93 },
      { name: "Google Pixel 9 Pro", image: googleImg, price: "$999", score: 95 },
      { name: "OnePlus 13", image: oneplusImg, price: "$799", score: 94 },
    ],
  },

  // ─── OnePlus 13 ─────────────────────────────────────────────────────────────
  "oneplus-13": {
    id: "oneplus-13",
    name: "OnePlus 13",
    brand: "OnePlus",
    brandColor: "#F5010C",
    image: oneplusImg,
    bgColor: "#fff0f0",
    status: "Available",
    releaseDate: "January 2025",
    price: "$799",
    priceINR: "₹69,999",
    score: 94,
    scoreColor: "high" as const,
    userRating: 4.6,
    ratingCount: "1,874",
    verdict: "The OnePlus 13 is a powerhouse flagship at a competitive price. Featuring the Snapdragon 8 Elite, a massive 6000 mAh battery with blazing 100W SuperVOOC charging, and a refined Hasselblad camera system, it punches well above its class.",
    quickSpecs: [
      { icon: Monitor, label: "Display", value: "6.82\" AMOLED, 120Hz" },
      { icon: Cpu, label: "Chipset", value: "Snapdragon 8 Elite" },
      { icon: MemoryStick, label: "RAM", value: "12 GB / 16 GB / 24 GB" },
      { icon: Camera, label: "Main Camera", value: "50 MP + 50 MP + 50 MP" },
      { icon: Battery, label: "Battery", value: "6000 mAh, 100W SuperVOOC" },
    ],
    specTable: [
      {
        category: "NETWORK",
        color: "#E53E3E",
        rows: [
          { label: "Technology", value: "GSM / HSPA / LTE / 5G" },
          { label: "5G Bands", value: "Sub-6 GHz" },
        ],
      },
      {
        category: "LAUNCH",
        color: "#DD6B20",
        rows: [
          { label: "Announced", value: "2024, December 31" },
          { label: "Status", value: "Available. Released 2025, January 7 (China); January 23 (Global)" },
        ],
      },
      {
        category: "BODY",
        color: "#38A169",
        rows: [
          { label: "Dimensions", value: "162.6 x 76.0 x 8.9 mm" },
          { label: "Weight", value: "210 g" },
          { label: "Build", value: "Glass front (Gorilla Glass Victus 2), aluminum frame, glass back" },
          { label: "SIM", value: "Dual Nano-SIM" },
          { label: "Water Resistance", value: "IP65 dust/water resistant" },
        ],
      },
      {
        category: "DISPLAY",
        color: "#3182CE",
        rows: [
          { label: "Type", value: "LTPO AMOLED, 1-120Hz, 4500 nits (peak)" },
          { label: "Size", value: "6.82 inches, 109.5 cm²" },
          { label: "Resolution", value: "1440 x 3168 pixels (~510 ppi density)" },
          { label: "Protection", value: "Corning Gorilla Glass Victus 2" },
          { label: "Always-on display", value: "Yes" },
        ],
      },
      {
        category: "PLATFORM",
        color: "#805AD5",
        rows: [
          { label: "OS", value: "Android 15, OxygenOS 15" },
          { label: "Chipset", value: "Qualcomm SM8750-AB Snapdragon 8 Elite (3 nm)" },
          { label: "CPU", value: "Octa-core (2x4.32 GHz Oryon V2 & 6x3.53 GHz Oryon V2)" },
          { label: "GPU", value: "Adreno 830" },
        ],
      },
      {
        category: "MEMORY",
        color: "#D69E2E",
        rows: [
          { label: "Card slot", value: "No" },
          { label: "Internal", value: "256GB 12GB RAM, 512GB 16GB RAM, 512GB 24GB RAM" },
          { label: "Storage Type", value: "UFS 4.0" },
        ],
      },
      {
        category: "MAIN CAMERA",
        color: "#2B6CB0",
        rows: [
          { label: "Triple (Hasselblad)", value: "50 MP, f/1.6, 23mm (wide), PDAF, OIS\n50 MP, f/2.6, 73mm (3x periscope telephoto), PDAF, OIS\n50 MP, f/2.0, 15mm (ultrawide), PDAF" },
          { label: "Features", value: "Hasselblad Natural Colour Solution, Dual-LED flash, HDR, panorama" },
          { label: "Video", value: "4K@60fps, 4K@30fps, 1080p@240fps, 10-bit LOG" },
        ],
      },
      {
        category: "SELFIE CAMERA",
        color: "#C05621",
        rows: [
          { label: "Single", value: "32 MP, f/2.4, 21mm (wide)" },
          { label: "Video", value: "4K@30fps, 1080p@30fps" },
        ],
      },
      {
        category: "SOUND",
        color: "#2C7A7B",
        rows: [
          { label: "Loudspeaker", value: "Yes, with stereo speakers" },
          { label: "3.5mm jack", value: "No" },
          { label: "Audio Features", value: "Dolby Atmos, Hi-Res Audio" },
        ],
      },
      {
        category: "COMMS",
        color: "#2D3748",
        rows: [
          { label: "WLAN", value: "Wi-Fi 802.11 a/b/g/n/ac/6e/7, Wi-Fi Direct" },
          { label: "Bluetooth", value: "5.4, A2DP, LE, aptX HD, LDAC" },
          { label: "Positioning", value: "GPS, GLONASS, BeiDou, Galileo" },
          { label: "NFC", value: "Yes" },
          { label: "Infrared port", value: "Yes" },
          { label: "USB", value: "USB Type-C 2.0, OTG" },
        ],
      },
      {
        category: "FEATURES",
        color: "#553C9A",
        rows: [
          { label: "Sensors", value: "Fingerprint (under display, optical), accelerometer, gyro, proximity, barometer, compass, color spectrum" },
          { label: "Alert Slider", value: "Yes, 3-position physical mute switch" },
          { label: "Hasselblad Camera", value: "Yes, professional color calibration" },
        ],
      },
      {
        category: "BATTERY",
        color: "#276749",
        rows: [
          { label: "Type", value: "Li-Po 6000 mAh, non-removable" },
          { label: "Charging", value: "100W SuperVOOC wired, 100% in 36 min\n50W AIRVOOC wireless\n10W reverse wireless" },
          { label: "Battery Life", value: "Up to 34 hours video playback" },
        ],
      },
      {
        category: "MISC",
        color: "#744210",
        rows: [
          { label: "Colors", value: "Midnight Ocean, Arctic Dawn, Black Eclipse" },
          { label: "Models", value: "CPH2649, PJD110" },
          { label: "SAR", value: "0.98 W/kg (head), 1.52 W/kg (body)" },
          { label: "Price", value: "From $799 / ₹69,999" },
        ],
      },
    ],
    relatedPhones: [
      { name: "Samsung Galaxy S25 Ultra", image: samsungImg, price: "$1,199", score: 97 },
      { name: "iPhone 16 Pro Max", image: iphoneImg, price: "$1,199", score: 96 },
      { name: "Xiaomi 15 Ultra", image: xiaomiImg, price: "$1,099", score: 98 },
      { name: "Google Pixel 9 Pro", image: googleImg, price: "$999", score: 95 },
    ],
  },

  // ─── Google Pixel 9 Pro ──────────────────────────────────────────────────────
  "google-pixel-9-pro": {
    id: "google-pixel-9-pro",
    name: "Google Pixel 9 Pro",
    brand: "Google",
    brandColor: "#4285F4",
    image: googleImg,
    bgColor: "#f0f4ff",
    status: "Available",
    releaseDate: "August 2024",
    price: "$999",
    priceINR: "₹1,09,999",
    score: 95,
    scoreColor: "high" as const,
    userRating: 4.5,
    ratingCount: "1,633",
    verdict: "The Pixel 9 Pro is Google's best phone ever. With the in-house Tensor G4 chip powering incredible AI features, a brand-new polished design, and class-leading computational photography, it's the ultimate Android AI phone.",
    quickSpecs: [
      { icon: Monitor, label: "Display", value: "6.3\" LTPO OLED, 1-120Hz" },
      { icon: Cpu, label: "Chipset", value: "Google Tensor G4" },
      { icon: MemoryStick, label: "RAM", value: "16 GB" },
      { icon: Camera, label: "Main Camera", value: "50 MP + 48 MP + 48 MP" },
      { icon: Battery, label: "Battery", value: "4700 mAh, 45W Fast Charge" },
    ],
    specTable: [
      {
        category: "NETWORK",
        color: "#E53E3E",
        rows: [
          { label: "Technology", value: "GSM / HSPA / LTE / 5G" },
          { label: "5G Bands", value: "Sub-6 GHz & mmWave" },
        ],
      },
      {
        category: "LAUNCH",
        color: "#DD6B20",
        rows: [
          { label: "Announced", value: "2024, August 13" },
          { label: "Status", value: "Available. Released 2024, August 22" },
        ],
      },
      {
        category: "BODY",
        color: "#38A169",
        rows: [
          { label: "Dimensions", value: "152.8 x 72.0 x 8.5 mm" },
          { label: "Weight", value: "199 g" },
          { label: "Build", value: "Corning Gorilla Glass Victus 2 front & back, polished aluminum frame" },
          { label: "SIM", value: "Nano-SIM + eSIM" },
          { label: "Water Resistance", value: "IP68 (up to 6m for 30 min)" },
        ],
      },
      {
        category: "DISPLAY",
        color: "#3182CE",
        rows: [
          { label: "Type", value: "LTPO OLED, 1-120Hz, 3000 nits (peak)" },
          { label: "Size", value: "6.3 inches, 97.7 cm²" },
          { label: "Resolution", value: "1280 x 2856 pixels (~495 ppi density)" },
          { label: "Protection", value: "Corning Gorilla Glass Victus 2" },
          { label: "Always-on display", value: "Yes" },
        ],
      },
      {
        category: "PLATFORM",
        color: "#805AD5",
        rows: [
          { label: "OS", value: "Android 14, upgradable to Android 18 (7 years guaranteed)" },
          { label: "Chipset", value: "Google Tensor G4 (4 nm)" },
          { label: "CPU", value: "Nona-core (1x3.1 GHz Cortex-X4 & 3x2.6 GHz Cortex-A720 & 4x1.92 GHz Cortex-A520 & 1x1.92 GHz Cortex-A520)" },
          { label: "GPU", value: "Immortalis-G715s MC10" },
        ],
      },
      {
        category: "MEMORY",
        color: "#D69E2E",
        rows: [
          { label: "Card slot", value: "No" },
          { label: "Internal", value: "128GB 16GB RAM, 256GB 16GB RAM, 512GB 16GB RAM, 1TB 16GB RAM" },
          { label: "Storage Type", value: "UFS 3.1" },
        ],
      },
      {
        category: "MAIN CAMERA",
        color: "#2B6CB0",
        rows: [
          { label: "Triple", value: "50 MP, f/1.7, 25mm (wide), PDAF, OIS\n48 MP, f/2.8, 113mm (5x periscope telephoto), PDAF, OIS\n48 MP, f/1.7, 123˚ (ultrawide), PDAF" },
          { label: "Features", value: "Dual-LED flash, Pixel Shift, Auto-HDR, panorama, AI Best Take" },
          { label: "Video", value: "8K@30fps (with zoom), 4K@60fps, 1080p@240fps, 10-bit HDR" },
        ],
      },
      {
        category: "SELFIE CAMERA",
        color: "#C05621",
        rows: [
          { label: "Single", value: "42 MP, f/2.2, 103˚ (ultrawide)" },
          { label: "Features", value: "Dual-LED flash" },
          { label: "Video", value: "4K@60fps, 1080p@60fps" },
        ],
      },
      {
        category: "SOUND",
        color: "#2C7A7B",
        rows: [
          { label: "Loudspeaker", value: "Yes, with stereo speakers" },
          { label: "3.5mm jack", value: "No" },
          { label: "Audio Features", value: "24-bit/192kHz audio, active noise cancellation" },
        ],
      },
      {
        category: "COMMS",
        color: "#2D3748",
        rows: [
          { label: "WLAN", value: "Wi-Fi 802.11 a/b/g/n/ac/6e/7, Wi-Fi Direct" },
          { label: "Bluetooth", value: "5.9, A2DP, LE, aptX HD" },
          { label: "Positioning", value: "GPS, GLONASS, BeiDou, Galileo" },
          { label: "NFC", value: "Yes" },
          { label: "Infrared port", value: "No" },
          { label: "USB", value: "USB Type-C 3.2 Gen 2, OTG" },
          { label: "UWB", value: "Yes, Ultra-Wideband chip" },
        ],
      },
      {
        category: "FEATURES",
        color: "#553C9A",
        rows: [
          { label: "Sensors", value: "Fingerprint (under display, optical), accelerometer, gyro, proximity, barometer, compass, SpO2" },
          { label: "Google AI", value: "Gemini Nano, Circle to Search, Live Translate, Call Screen" },
          { label: "Temperature Sensor", value: "Yes" },
          { label: "Satellite SOS", value: "Yes, Emergency SOS via satellite" },
        ],
      },
      {
        category: "BATTERY",
        color: "#276749",
        rows: [
          { label: "Type", value: "Li-Ion 4700 mAh, non-removable" },
          { label: "Charging", value: "45W wired, 50% in 30 min\n23W wireless\n12W reverse wireless" },
          { label: "Battery Life", value: "Up to 31 hours video playback" },
        ],
      },
      {
        category: "MISC",
        color: "#744210",
        rows: [
          { label: "Colors", value: "Obsidian, Porcelain, Wintergreen, Rose Quartz, Hazel" },
          { label: "Models", value: "GP4BC, G9BQD, GKWS6" },
          { label: "SAR", value: "0.99 W/kg (head), 0.96 W/kg (body)" },
          { label: "Price", value: "From $999 / ₹1,09,999" },
        ],
      },
    ],
    relatedPhones: [
      { name: "Samsung Galaxy S25 Ultra", image: samsungImg, price: "$1,199", score: 97 },
      { name: "iPhone 16 Pro Max", image: iphoneImg, price: "$1,199", score: 96 },
      { name: "OnePlus 13", image: oneplusImg, price: "$799", score: 94 },
      { name: "Vivo X200", image: vivoImg, price: "$699", score: 93 },
    ],
  },
};

// Default phone data for any phone not in DB
function getPhoneData(id: string): PhoneData {
  if (phonesDB[id]) return phonesDB[id];
  // Generic fallback
  return {
    ...phonesDB["samsung-galaxy-s25-ultra"],
    id,
    name: id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
  };
}

// ─── Types ─────────────────────────────────────────────────────────────────────
interface PhoneData {
  id: string;
  name: string;
  brand: string;
  brandColor: string;
  image: string;
  bgColor: string;
  status: string;
  releaseDate: string;
  price: string;
  priceINR: string;
  score: number;
  scoreColor: "high" | "mid" | "low";
  userRating: number;
  ratingCount: string;
  verdict: string;
  quickSpecs: { icon: React.ElementType; label: string; value: string }[];
  specTable: { category: string; color: string; rows: { label: string; value: string }[] }[];
  relatedPhones: { name: string; image: string; price: string; score: number }[];
}

// ─── Score Badge ───────────────────────────────────────────────────────────────
function ScoreBadge({ score, color }: { score: number; color: "high" | "mid" | "low" }) {
  const gradients = {
    high: "from-green-600 to-emerald-700",
    mid: "from-amber-500 to-orange-600",
    low: "from-red-500 to-rose-600",
  };
  return (
    <div className={`bg-gradient-to-br ${gradients[color]} text-white rounded-xl px-3 py-2 text-center shadow-lg`}>
      <div className="text-2xl font-black leading-none">{score}%</div>
      <div className="text-[10px] font-bold opacity-90 mt-0.5 tracking-wide">SPEC SCORE</div>
    </div>
  );
}

// ─── Star Rating ───────────────────────────────────────────────────────────────
function StarRating({ rating, count }: { rating: number; count: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            size={14}
            className={i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}
          />
        ))}
      </div>
      <span className="text-sm font-bold text-foreground">{rating}/5</span>
      <span className="text-xs text-muted-foreground">({count} ratings)</span>
    </div>
  );
}

// ─── Spec Table Row ────────────────────────────────────────────────────────────
function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-border/30 hover:bg-primary/3 transition-colors group">
      <td className="py-3 pr-4 pl-0 text-sm text-muted-foreground font-medium w-[38%] align-top leading-relaxed">
        {label}
      </td>
      <td className="py-3 text-sm text-foreground font-medium leading-relaxed whitespace-pre-line">
        {value}
      </td>
    </tr>
  );
}

// ─── Spec Section ──────────────────────────────────────────────────────────────
function SpecSection({ category, color, rows }: { category: string; color: string; rows: { label: string; value: string }[] }) {
  return (
    <div className="glass-card rounded-xl overflow-hidden mb-3">
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{ backgroundColor: color + "18", borderBottom: `2px solid ${color}40` }}
      >
        <div className="w-1 h-5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-sm font-bold tracking-wider uppercase" style={{ color }}>
          {category}
        </span>
      </div>
      <div className="px-5 pb-1">
        <table className="w-full">
          <tbody>
            {rows.map((row, i) => (
              <SpecRow key={i} label={row.label} value={row.value} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab Bar ───────────────────────────────────────────────────────────────────
const TABS = ["INFO", "SPECS", "COMPARE", "PICTURES"];

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function PhoneDetailPage() {
  const { id } = useParams<{ id: string }>();
  const phone = getPhoneData(id || "samsung-galaxy-s25-ultra");
  const [activeTab, setActiveTab] = useState("INFO");
  const [wishlist, setWishlist] = useState(false);
  const tabRef = useRef<HTMLDivElement>(null);
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (tabRef.current) {
        setSticky(tabRef.current.getBoundingClientRect().top <= 56);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-screen-xl mx-auto px-4 pt-4 pb-1">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/" className="hover:text-primary transition-colors">Mobiles</Link>
          <ChevronRight size={12} />
          <Link to="/brands" className="hover:text-primary transition-colors">{phone.brand}</Link>
          <ChevronRight size={12} />
          <span className="text-foreground font-medium truncate">{phone.name}</span>
        </nav>
      </div>

      {/* ═══ HERO SECTION ═══════════════════════════════════════════════════ */}
      <section className="max-w-screen-xl mx-auto px-4 py-4">
        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Brand color accent bar */}
          <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${phone.brandColor}, ${phone.brandColor}88)` }} />

          <div className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-8">

              {/* ── Left: Phone Image ─────────────────────────────────────── */}
              <div className="flex-shrink-0 flex flex-col items-center gap-4">
                {/* Main Image Card */}
                <div
                  className="relative w-full lg:w-72 h-80 lg:h-96 rounded-2xl flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: phone.bgColor }}
                >
                  {/* Ambient glow */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{ background: `radial-gradient(ellipse at 50% 100%, ${phone.brandColor}60, transparent 70%)` }}
                  />
                  <img
                    src={phone.image}
                    alt={phone.name}
                    className="relative z-10 h-64 lg:h-80 w-auto object-contain drop-shadow-2xl"
                  />
                  {/* Score badge floating */}
                  <div className="absolute top-3 left-3 z-20">
                    <ScoreBadge score={phone.score} color={phone.scoreColor} />
                  </div>
                  {/* Wishlist button */}
                  <button
                    onClick={() => setWishlist(!wishlist)}
                    className="absolute top-3 right-3 z-20 glass rounded-full p-2 backdrop-blur-sm border border-white/20 hover:border-red-400/50 transition-all"
                  >
                    <Heart size={16} className={wishlist ? "fill-red-500 text-red-500" : "text-foreground"} />
                  </button>
                </div>

                {/* Thumbnail row */}
                <div className="flex gap-2">
                  {[phone.image, phone.image, phone.image].map((img, i) => (
                    <div
                      key={i}
                      className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center overflow-hidden cursor-pointer transition-all ${i === 0 ? "border-primary" : "border-border/50 hover:border-primary/50"}`}
                      style={{ backgroundColor: phone.bgColor }}
                    >
                      <img src={img} alt="" className="h-10 w-auto object-contain" />
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Right: Phone Info ─────────────────────────────────────── */}
              <div className="flex-1 min-w-0">
                {/* Status + Title */}
                <div className="flex flex-wrap items-start gap-3 mb-3">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ backgroundColor: phone.brandColor + "18", color: phone.brandColor, border: `1px solid ${phone.brandColor}40` }}
                  >
                    {phone.status}
                  </span>
                  <span className="text-xs text-muted-foreground py-1">Released: {phone.releaseDate}</span>
                </div>

                <h1 className="text-2xl md:text-3xl font-black text-foreground mb-2 leading-tight">{phone.name}</h1>

                <StarRating rating={phone.userRating} count={phone.ratingCount} />

                {/* Quick spec pills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-5">
                  {phone.quickSpecs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-3 glass-card rounded-xl px-3.5 py-2.5 border border-border/60">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: phone.brandColor + "15" }}
                      >
                        <spec.icon size={16} style={{ color: phone.brandColor }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide leading-none mb-0.5">{spec.label}</p>
                        <p className="text-xs font-bold text-foreground leading-tight">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price */}
                <div className="flex flex-wrap items-baseline gap-3 mb-5">
                  <span className="text-3xl font-black text-foreground">{phone.price}</span>
                  <span className="text-lg text-muted-foreground">{phone.priceINR}</span>
                  <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">In Stock</span>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-primary-foreground shadow-lg hover:opacity-90 transition-all active:scale-95"
                    style={{ background: `linear-gradient(135deg, ${phone.brandColor}, ${phone.brandColor}cc)` }}
                  >
                    <ShoppingCart size={16} />
                    Buy Now
                  </button>
                  <button className="glass-card flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm hover:border-primary/50 transition-all active:scale-95">
                    <GitCompare size={16} className="text-primary" />
                    Compare
                  </button>
                  <button className="glass-card flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm hover:border-primary/50 transition-all active:scale-95">
                    <Share2 size={16} className="text-muted-foreground" />
                    Share
                  </button>
                </div>

                {/* Verdict */}
                <div className="mt-5 p-4 rounded-xl border-l-4 bg-primary/5" style={{ borderColor: phone.brandColor }}>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">Expert Verdict</p>
                  <p className="text-sm text-foreground leading-relaxed">{phone.verdict}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STICKY TAB BAR ════════════════════════════════════════════════ */}
      <div ref={tabRef} className="max-w-screen-xl mx-auto px-4 mb-4">
        {/* Spacer when tab bar is sticky so content doesn't jump */}
        {sticky && <div className="h-14" />}
        <div className={`glass-card rounded-xl overflow-hidden transition-all ${sticky ? "fixed top-14 left-0 right-0 z-40 max-w-none rounded-none shadow-xl border-x-0 border-t-0" : ""}`}>
          <div className={`flex ${sticky ? "max-w-screen-xl mx-auto px-4" : ""}`}>
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3.5 text-sm font-bold tracking-wide transition-all relative ${
                  activeTab === tab
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeTab === tab && (
                  <span
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(135deg, ${phone.brandColor}, ${phone.brandColor}bb)` }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ TAB CONTENT ═══════════════════════════════════════════════════ */}
      <div className="max-w-screen-xl mx-auto px-4 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Main Content ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">

            {/* INFO TAB */}
            {activeTab === "INFO" && (
              <>
                {/* Key highlights */}
                <div className="glass-card rounded-2xl p-5">
                  <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-primary" />
                    Key Highlights
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: "Display", value: '6.9" QHD+', sub: "AMOLED 120Hz", icon: Monitor, color: "#3182CE" },
                      { label: "Processor", value: "SD 8 Elite", sub: "3nm Chipset", icon: Cpu, color: "#805AD5" },
                      { label: "RAM", value: "12 / 16 GB", sub: "LPDDR5X", icon: MemoryStick, color: "#D69E2E" },
                      { label: "Camera", value: "200 MP", sub: "Quad Rear", icon: Camera, color: "#2B6CB0" },
                      { label: "Battery", value: "5000 mAh", sub: "45W Charging", icon: Battery, color: "#276749" },
                      { label: "Storage", value: "Up to 1TB", sub: "UFS 4.0", icon: Shield, color: "#C05621" },
                    ].map((h, i) => (
                      <div key={i} className="rounded-xl p-3.5 border border-border/50 hover:border-primary/30 transition-colors bg-white/50 backdrop-blur-sm">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5"
                          style={{ backgroundColor: h.color + "18" }}
                        >
                          <h.icon size={18} style={{ color: h.color }} />
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">{h.label}</p>
                        <p className="text-sm font-black text-foreground">{h.value}</p>
                        <p className="text-[10px] text-muted-foreground">{h.sub}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Design & Build */}
                <div className="glass-card rounded-2xl p-5">
                  <h2 className="text-base font-bold mb-3">Design & Build</h2>
                  <div className="space-y-2">
                    {[
                      { label: "Height", value: "162.8 mm" },
                      { label: "Width", value: "77.6 mm" },
                      { label: "Thickness", value: "8.2 mm" },
                      { label: "Weight", value: "218 grams" },
                      { label: "Build Material", value: "Titanium frame, Corning Gorilla Armor 2, Ceramic back" },
                      { label: "Water Resistance", value: "Yes, IP68 rated (up to 6m for 30 min)" },
                    ].map((row, i) => (
                      <div key={i} className={`flex gap-4 py-2 ${i < 5 ? "border-b border-border/30" : ""}`}>
                        <span className="text-sm text-muted-foreground w-36 shrink-0 font-medium">{row.label}</span>
                        <span className="text-sm text-foreground font-semibold">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Camera Section */}
                <div className="glass-card rounded-2xl p-5">
                  <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                    <Camera size={16} className="text-primary" />
                    Camera System
                  </h2>
                  {/* Rear camera table */}
                  <div className="mb-4">
                    <p className="text-sm font-bold text-foreground mb-2">Rear Camera</p>
                    <div className="rounded-xl overflow-hidden border border-border/40">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-muted/50">
                            {["Camera", "MP", "Aperture", "Focal Length", "Sensor"].map(h => (
                              <th key={h} className="py-2 px-3 text-left font-bold text-muted-foreground">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            ["Primary", "200 MP", "f/1.7", "24mm", "ISOCELL HP2"],
                            ["Periscope", "50 MP", "f/3.4", "130mm (5x)", "ISOCELL JN3"],
                            ["Telephoto", "10 MP", "f/2.4", "67mm (3x)", "ISOCELL JN1"],
                            ["Ultrawide", "50 MP", "f/2.2", "13mm", "ISOCELL JN3"],
                          ].map((row, i) => (
                            <tr key={i} className={`border-t border-border/30 ${i % 2 === 0 ? "bg-white/30" : "bg-white/10"}`}>
                              {row.map((cell, j) => (
                                <td key={j} className={`py-2.5 px-3 ${j === 0 ? "font-bold text-foreground" : "text-muted-foreground"}`}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* Front camera */}
                  <div>
                    <p className="text-sm font-bold text-foreground mb-2">Front Camera</p>
                    <div className="rounded-xl overflow-hidden border border-border/40">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-muted/50">
                            {["Camera", "MP", "Aperture", "Focal Length"].map(h => (
                              <th key={h} className="py-2 px-3 text-left font-bold text-muted-foreground">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white/30 border-t border-border/30">
                            {["Primary", "12 MP", "f/2.2", "23mm"].map((cell, j) => (
                              <td key={j} className={`py-2.5 px-3 ${j === 0 ? "font-bold text-foreground" : "text-muted-foreground"}`}>{cell}</td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Battery Section */}
                <div className="glass-card rounded-2xl p-5">
                  <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                    <Battery size={16} className="text-primary" />
                    Battery & Charging
                  </h2>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: "Capacity", value: "5000", unit: "mAh" },
                      { label: "Wired", value: "45", unit: "W" },
                      { label: "Wireless", value: "15", unit: "W" },
                    ].map((stat, i) => (
                      <div key={i} className="text-center rounded-xl p-3.5 border border-border/50 bg-white/40 backdrop-blur-sm">
                        <div className="text-2xl font-black text-primary">{stat.value}<span className="text-sm font-bold">{stat.unit}</span></div>
                        <div className="text-[10px] text-muted-foreground font-medium mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Battery Type", value: "Li-Ion, non-removable" },
                      { label: "Talk Time", value: "Up to 37 hours (4G)" },
                      { label: "Video Playback", value: "Up to 27 hours" },
                      { label: "Reverse Charging", value: "Yes, 4.5W reverse wireless" },
                    ].map((row, i) => (
                      <div key={i} className={`flex gap-4 py-2 ${i < 3 ? "border-b border-border/30" : ""}`}>
                        <span className="text-sm text-muted-foreground w-36 shrink-0 font-medium">{row.label}</span>
                        <span className="text-sm text-foreground font-semibold">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connectivity */}
                <div className="glass-card rounded-2xl p-5">
                  <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                    <Wifi size={16} className="text-primary" />
                    Network & Connectivity
                  </h2>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { icon: Globe, label: "5G", value: "Sub-6 & mmWave" },
                      { icon: Wifi, label: "Wi-Fi", value: "Wi-Fi 7 (802.11be)" },
                      { icon: Bluetooth, label: "Bluetooth", value: "5.4, aptX HD" },
                      { icon: Nfc, label: "NFC", value: "Yes" },
                      { icon: Zap, label: "USB", value: "Type-C 3.2 Gen 2" },
                      { icon: Volume2, label: "Audio", value: "Dolby Atmos, Hi-Res" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border/50 bg-white/40 backdrop-blur-sm">
                        <item.icon size={16} className="text-primary shrink-0" />
                        <div>
                          <p className="text-[10px] text-muted-foreground font-medium">{item.label}</p>
                          <p className="text-xs font-bold text-foreground">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* SPECS TAB */}
            {activeTab === "SPECS" && (
              <div>
                <div className="glass-card rounded-2xl p-5 mb-4">
                  <h2 className="text-base font-bold mb-1">Full Specifications</h2>
                  <p className="text-xs text-muted-foreground">Complete technical specifications for {phone.name}</p>
                </div>
                {phone.specTable.map((section, i) => (
                  <SpecSection key={i} {...section} />
                ))}
              </div>
            )}

            {/* COMPARE TAB */}
            {activeTab === "COMPARE" && (
              <div className="glass-card rounded-2xl p-6 text-center">
                <GitCompare size={40} className="text-primary mx-auto mb-3 opacity-60" />
                <h2 className="text-lg font-bold mb-2">Compare with other phones</h2>
                <p className="text-sm text-muted-foreground mb-4">Select phones to compare side-by-side with {phone.name}</p>
                <Link to="/phone-finder" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors">
                  Open Phone Finder
                  <ExternalLink size={14} />
                </Link>
              </div>
            )}

            {/* PICTURES TAB */}
            {activeTab === "PICTURES" && (
              <div className="glass-card rounded-2xl p-5">
                <h2 className="text-base font-bold mb-4">Official Images</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-[3/4] rounded-xl overflow-hidden border border-border/50 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all group"
                      style={{ backgroundColor: phone.bgColor }}
                    >
                      <img
                        src={phone.image}
                        alt={`${phone.name} view ${i + 1}`}
                        className="h-full w-auto object-contain p-4 group-hover:scale-105 transition-transform duration-300 drop-shadow-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ───────────────────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Quick buy card */}
            <div className="glass-card rounded-2xl overflow-hidden sticky top-20">
              <div className="h-1" style={{ background: `linear-gradient(90deg, ${phone.brandColor}, transparent)` }} />
              <div className="p-5">
                <div className="text-xl font-black mb-0.5">{phone.price}</div>
                <div className="text-xs text-muted-foreground mb-4">{phone.priceINR} · Free delivery</div>

                <button
                  className="w-full py-3 rounded-xl font-bold text-sm text-primary-foreground mb-2 hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  style={{ background: `linear-gradient(135deg, ${phone.brandColor}, ${phone.brandColor}cc)` }}
                >
                  <ShoppingCart size={16} />
                  Buy on Amazon
                </button>
                <button className="w-full glass-card py-3 rounded-xl font-bold text-sm hover:border-primary/50 transition-all flex items-center justify-center gap-2">
                  <ExternalLink size={16} className="text-primary" />
                  View All Stores
                </button>

                <div className="mt-4 space-y-2">
                  {[
                    { icon: Shield, text: "1 Year Manufacturer Warranty" },
                    { icon: Zap, text: "45W Fast Charger in Box" },
                    { icon: CheckCircle2, text: "Official India Warranty" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <item.icon size={13} className="text-emerald-500 shrink-0" />
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Related phones */}
            <div className="glass-card rounded-2xl p-4">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Smartphone size={14} className="text-primary" />
                Related Phones
              </h3>
              <div className="space-y-2.5">
                {phone.relatedPhones.map((rel, i) => (
                  <Link
                    key={i}
                    to="/phone-finder"
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                  >
                    <div className="w-12 h-14 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#f0f4f8" }}>
                      <img src={rel.image} alt={rel.name} className="h-12 w-auto object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2">{rel.name}</p>
                      <p className="text-xs font-bold text-primary mt-1">{rel.price}</p>
                    </div>
                    <div className={`text-[10px] font-black px-1.5 py-1 rounded-lg text-white shrink-0 ${rel.score >= 90 ? "bg-green-600" : "bg-amber-500"}`}>
                      {rel.score}%
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Updated date */}
            <div className="glass-card rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Mobiles › {phone.name}</span>
              <span className="text-xs text-muted-foreground">Updated: Feb 18, 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ POPULAR MOBILES CAROUSEL ═══════════════════════════════════════ */}
      <section className="max-w-screen-xl mx-auto px-4 pb-8">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold">Popular Mobiles</h2>
            <Link to="/phone-finder" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {[
              { name: "Samsung Galaxy S25 Ultra", price: "$1,199", score: 97, image: samsungImg, bg: "#f0f4f8" },
              { name: "iPhone 16 Pro Max", price: "$1,199", score: 96, image: iphoneImg, bg: "#f5f5f5" },
              { name: "OnePlus 13", price: "$799", score: 94, image: oneplusImg, bg: "#fff0f0" },
              { name: "Motorola Edge 50", price: "$369", score: 89, image: motorolaImg, bg: "#f0f4ff" },
              { name: "Xiaomi 15 Ultra", price: "$1,099", score: 98, image: xiaomiImg, bg: "#f8f3f0" },
              { name: "Realme P4", price: "$299", score: 87, image: realmeImg, bg: "#fff8f0" },
              { name: "Google Pixel 9 Pro", price: "$999", score: 95, image: googleImg, bg: "#f0f4ff" },
              { name: "Vivo X200", price: "$699", score: 93, image: vivoImg, bg: "#f0f0ff" },
            ].map((p, i) => (
              <Link
                key={i}
                to={`/phone/${p.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex flex-col shrink-0 w-40 glass-card rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all group"
              >
                <div className="relative h-40 flex items-center justify-center" style={{ backgroundColor: p.bg }}>
                  <div className={`absolute top-2 left-2 text-white text-xs font-bold rounded-lg px-1.5 py-1 leading-tight ${p.score >= 90 ? "bg-green-700" : "bg-amber-600"}`}>
                    <div className="text-sm leading-none">{p.score}%</div>
                    <div className="text-[9px] opacity-80">Score</div>
                  </div>
                  <img src={p.image} alt={p.name} className="h-32 w-auto object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-2.5 bg-white/70 backdrop-blur-sm">
                  <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">{p.name}</p>
                  <p className="text-xs font-black text-primary mt-1">{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
