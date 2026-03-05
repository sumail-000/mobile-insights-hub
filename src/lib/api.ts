async function req<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers as Record<string, string> || {}) },
    credentials: "include",
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data as T;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  wishlist: string[];
  created_at?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const authAPI = {
  signup: (name: string, email: string, password: string) =>
    req<AuthResponse>("/api/auth/signup", { method: "POST", body: JSON.stringify({ name, email, password }) }),
  login: (email: string, password: string) =>
    req<AuthResponse>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  me: () => req<AuthUser>("/api/auth/me"),
  logout: () => req<{ ok: boolean }>("/api/auth/logout", { method: "POST" }),
};

// ── Brands ────────────────────────────────────────────────────────────────────

export interface Brand {
  name: string;
  gsmarena_url: string;
  device_count: number;
}

export const getBrands = () =>
  req<{ brands: Brand[] }>("/api/brands").then((r) => r.brands);

// ── Devices ───────────────────────────────────────────────────────────────────

export interface Device {
  id: string;
  slug: string;
  name: string;
  brand: string;
  thumbnail: string;
  summary: string;
  chipset?: string;
  ram?: string;
  main_camera?: string;
  battery?: string;
  display_size?: string;
  os?: string;
  rating?: string;
  fans?: string;
  storage?: string;
  charging?: string;
  display_type?: string;
  display_res?: string;
  display_resolution?: string;
  network?: string;
  nfc?: string;
  usb?: string;
  bluetooth?: string;
  wlan?: string;
  colors?: string;
  weight?: string;
  dimensions?: string;
  build?: string;
  sim?: string;
  water_resistance?: string;
  sensors?: string;
  announced?: string;
  status?: string;
  popularity?: string;
  selfie_camera?: string;
  cpu?: string;
  gpu?: string;
  internal_storage?: string;
  card_slot?: string;
  models?: string;
  full_specs_json?: string | object;
  specs?: Record<string, Record<string, string>>;
  data_specs?: Record<string, string>;
  highlights?: Record<string, string>;
  pictures?: string[];
  pictures_url?: string;
  related?: Device[];
}

export interface DevicesResponse {
  devices: Device[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface DeviceFilters {
  brand?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: "name" | "rating" | "fans" | "newest";
  network?: string;
  ram?: string;
  os?: string;
}

export const getDevices = (filters: DeviceFilters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== "") params.set(k, String(v));
  });
  return req<DevicesResponse>(`/api/devices?${params}`);
};

export const getDevice = (slug: string) =>
  req<Device>(`/api/devices/${slug}`);

// ── Search ────────────────────────────────────────────────────────────────────

export const searchDevices = (q: string) =>
  req<{ results: Device[]; total: number }>(`/api/search?q=${encodeURIComponent(q)}`);

// ── Top 10 ────────────────────────────────────────────────────────────────────

export interface TopDevice {
  rank: number;
  slug: string;
  name: string;
  brand: string;
  thumbnail: string;
  chipset?: string;
  ram?: string;
  main_camera?: string;
  battery?: string;
  display_size?: string;
  os?: string;
  rating?: string | null;
  fans?: string | null;
  announced?: string;
  status?: string;
}

export const getTopPhones = (sort: "fans" | "rating" | "newest" = "fans", limit = 10) =>
  req<{ devices: TopDevice[]; sort: string }>(`/api/top-10?sort=${sort}&limit=${limit}`);

// ── Upcoming ──────────────────────────────────────────────────────────────────

export interface UpcomingPhone {
  id: number;
  slug: string;
  name: string;
  brand: string;
  brand_color: string;
  expected_price: string;
  launch_quarter: string;
  launch_date: string;
  status: "Confirmed" | "Rumored" | "Official";
  thumbnail_url?: string;
  chipset?: string;
  ram?: string;
  camera?: string;
  battery?: string;
  display?: string;
  hype: number;
  followers: string;
  description?: string;
}

export interface UpcomingFilters {
  brand?: string;
  quarter?: string;
  status?: string;
  search?: string;
}

export const getUpcoming = (filters: UpcomingFilters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
  return req<{ upcoming: UpcomingPhone[] }>(`/api/upcoming?${params}`);
};

// ── News ──────────────────────────────────────────────────────────────────────

export interface NewsArticle {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  category: "news" | "review" | "deep-dive" | "comparison";
  author: string;
  thumbnail_url?: string;
  related_device_slug?: string;
  related_brand?: string;
  published_at: string;
  is_featured: number;
  views: number;
}

export interface NewsFilters {
  category?: string;
  featured?: "1";
  brand?: string;
  limit?: number;
  page?: number;
}

export const getNews = (filters: NewsFilters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) params.set(k, String(v)); });
  return req<{ articles: NewsArticle[]; total: number; page: number; limit: number; pages: number }>(`/api/news?${params}`);
};

// ── Compare ───────────────────────────────────────────────────────────────────

export const compareDevices = (slug1: string, slug2: string) =>
  req<{ device1: Device; device2: Device }>(`/api/compare?slug1=${encodeURIComponent(slug1)}&slug2=${encodeURIComponent(slug2)}`);

// ── Wishlist ──────────────────────────────────────────────────────────────────

export const wishlist = {
  add: (slug: string) =>
    req<{ wishlist: string[] }>("/api/wishlist", {
      method: "POST",
      body: JSON.stringify({ slug }),
    }),
  remove: (slug: string) =>
    req<{ wishlist: string[] }>(`/api/wishlist/${slug}`, { method: "DELETE" }),
};
