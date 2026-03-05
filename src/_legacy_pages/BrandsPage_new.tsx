import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ChevronRight, Search, Smartphone, Grid3X3, List, X,
  Cpu, MemoryStick, Camera, Battery, Monitor, Star,
  ArrowLeft, SlidersHorizontal, ExternalLink, GitCompare,
  Loader2, AlertCircle
} from "lucide-react";
import { getBrands, getDevices, Brand, Device } from "@/lib/api";
