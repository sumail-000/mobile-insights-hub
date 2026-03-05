import { NextResponse } from "next/server";
import pool from "@/lib/db";

function urlToSlug(url: string) {
  const m = url.match(/\/([^/]+)\.php$/);
  return m ? m[1] : url;
}

function serializeDevice(row: Record<string, unknown>, full = false) {
  const slug = urlToSlug((row.gsmarena_url as string) || "");
  const d: Record<string, unknown> = {
    id: slug, slug,
    name: row.name || "",
    brand: row.brand_name || "",
    thumbnail: row.thumbnail_url || "",
    summary: row.summary || "",
  };
  if (full) {
    Object.assign(d, {
      chipset: row.chipset || "", ram: row.ram || "", main_camera: row.main_camera || "",
      selfie_camera: row.selfie_camera || "", battery: row.battery || "", charging: row.charging || "",
      storage: row.storage || "", display_size: row.display_size || "", display_type: row.display_type || "",
      display_res: row.display_res || "", os: row.os || "", network: row.network || "",
      nfc: row.nfc || "", usb: row.usb || "", bluetooth: row.bluetooth || "", wlan: row.wlan || "",
      colors: row.colors || "", weight: row.weight || "", dimensions: row.dimensions || "",
      sim: row.sim || "", sensors: row.sensors || "", announced: row.announced || "",
      status: row.status || "", popularity: row.popularity || "",
      fans: row.fans || null, rating: row.rating || null,
    });
    const raw = row.full_specs_json as string;
    if (raw) {
      try {
        const full = JSON.parse(raw);
        d.specs = full.specs || {}; d.data_specs = full.data_specs || {};
        d.highlights = full.highlights || {}; d.pictures = full.pictures || [];
        d.pictures_url = full.pictures_url || "";
      } catch { d.specs = {}; }
    }
  }
  return d;
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const url = `https://www.gsmarena.com/${slug}.php`;

  try {
    const [rows] = await pool.execute(
      `SELECT d.name, d.gsmarena_url, d.thumbnail_url, d.summary, b.name AS brand_name,
              ds.chipset, ds.ram, ds.storage, ds.main_camera, ds.selfie_camera,
              ds.battery, ds.charging, ds.display_size, ds.display_type, ds.display_res,
              ds.os, ds.network, ds.nfc, ds.usb, ds.bluetooth, ds.wlan,
              ds.colors, ds.weight, ds.dimensions, ds.sim, ds.sensors,
              ds.announced, ds.status, ds.popularity, ds.fans, ds.rating, ds.full_specs_json,
              GROUP_CONCAT(dp.url ORDER BY dp.position SEPARATOR '|||') AS pic_urls
       FROM devices d
       JOIN brands b ON b.id = d.brand_id
       LEFT JOIN device_specs ds ON ds.device_id = d.id
       LEFT JOIN device_pictures dp ON dp.device_id = d.id
       WHERE d.gsmarena_url = ?
       GROUP BY d.id, ds.id`,
      [url]
    ) as [Array<Record<string, unknown>>, unknown];

    if (!rows.length) return NextResponse.json({ error: "Device not found" }, { status: 404 });

    const row = rows[0];
    const device = serializeDevice(row, true);
    if (row.pic_urls) device.pictures = (row.pic_urls as string).split("|||").filter(Boolean);

    const [related] = await pool.execute(
      `SELECT d.name, d.gsmarena_url, d.thumbnail_url, b.name AS brand_name
       FROM devices d JOIN brands b ON b.id = d.brand_id
       WHERE b.name = ? AND d.gsmarena_url != ?
       ORDER BY d.scraped_at DESC LIMIT 8`,
      [row.brand_name as string, url]
    ) as [Array<Record<string, unknown>>, unknown];

    device.related = related.map((r) => serializeDevice(r));
    return NextResponse.json(device);
  } catch (err) {
    console.error("device detail error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
