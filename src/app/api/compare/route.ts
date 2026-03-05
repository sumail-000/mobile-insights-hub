import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import pool from "@/lib/db";

function urlToSlug(url: string) {
  const m = url.match(/\/([^/]+)\.php$/);
  return m ? m[1] : url;
}

function serializeFull(row: Record<string, unknown>) {
  const slug = urlToSlug((row.gsmarena_url as string) || "");
  return {
    id: slug, slug,
    name: row.name || "",
    brand: row.brand_name || "",
    thumbnail: row.thumbnail_url || "",
    summary: row.summary || "",
    chipset: row.chipset || "",
    ram: row.ram || "",
    storage: row.storage || "",
    main_camera: row.main_camera || "",
    selfie_camera: row.selfie_camera || "",
    battery: row.battery || "",
    charging: row.charging || "",
    display_size: row.display_size || "",
    display_type: row.display_type || "",
    display_res: row.display_res || "",
    os: row.os || "",
    network: row.network || "",
    nfc: row.nfc || "",
    bluetooth: row.bluetooth || "",
    wlan: row.wlan || "",
    weight: row.weight || "",
    dimensions: row.dimensions || "",
    colors: row.colors || "",
    sim: row.sim || "",
    sensors: row.sensors || "",
    announced: row.announced || "",
    status: row.status || "",
    fans: row.fans || null,
    rating: row.rating || null,
  };
}

async function fetchDevice(slug: string) {
  const url = `https://www.gsmarena.com/${slug}.php`;
  const [rows] = await pool.execute(
    `SELECT d.name, d.gsmarena_url, d.thumbnail_url, d.summary, b.name AS brand_name,
            ds.chipset, ds.ram, ds.storage, ds.main_camera, ds.selfie_camera,
            ds.battery, ds.charging, ds.display_size, ds.display_type, ds.display_res,
            ds.os, ds.network, ds.nfc, ds.bluetooth, ds.wlan,
            ds.colors, ds.weight, ds.dimensions, ds.sim, ds.sensors,
            ds.announced, ds.status, ds.fans, ds.rating
     FROM devices d
     JOIN brands b ON b.id = d.brand_id
     LEFT JOIN device_specs ds ON ds.device_id = d.id
     WHERE d.gsmarena_url = ?`,
    [url]
  ) as [Array<Record<string, unknown>>, unknown];
  return rows[0] ? serializeFull(rows[0]) : null;
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const slug1 = sp.get("slug1") || "";
  const slug2 = sp.get("slug2") || "";

  if (!slug1 || !slug2)
    return NextResponse.json({ error: "slug1 and slug2 required" }, { status: 400 });

  try {
    const [d1, d2] = await Promise.all([fetchDevice(slug1), fetchDevice(slug2)]);

    if (!d1 || !d2) {
      return NextResponse.json({ error: "One or both devices not found" }, { status: 404 });
    }

    // Log this comparison pair for popular comparisons tracking
    const [s1, s2] = [slug1, slug2].sort();
    await pool.execute(
      `INSERT INTO comparisons_log (slug1, slug2, count) VALUES (?,?,1)
       ON DUPLICATE KEY UPDATE count=count+1, last_compared=NOW()`,
      [s1, s2]
    ).catch(() => {}); // non-critical

    return NextResponse.json({ device1: d1, device2: d2 });
  } catch (err) {
    console.error("compare error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

