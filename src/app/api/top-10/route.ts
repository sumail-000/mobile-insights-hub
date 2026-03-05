import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import pool from "@/lib/db";

function urlToSlug(url: string) {
  const m = url.match(/\/([^/]+)\.php$/);
  return m ? m[1] : url;
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const sort = sp.get("sort") || "fans"; // fans | rating | newest
  const limit = Math.min(20, Math.max(1, Number(sp.get("limit") || 10)));

  const orderMap: Record<string, string> = {
    fans: "CAST(REPLACE(IFNULL(ds.fans,'0'), ',', '') AS UNSIGNED) DESC",
    rating: "CAST(ds.rating AS DECIMAL(4,2)) DESC",
    newest: "d.scraped_at DESC",
  };
  const orderSQL = orderMap[sort] || orderMap.fans;

  try {
    const [rows] = await pool.execute(
      `SELECT d.name, d.gsmarena_url, d.thumbnail_url, b.name AS brand_name,
              ds.chipset, ds.ram, ds.main_camera, ds.battery, ds.display_size,
              ds.os, ds.rating, ds.fans, ds.announced, ds.status
       FROM devices d
       JOIN brands b ON b.id = d.brand_id
       LEFT JOIN device_specs ds ON ds.device_id = d.id
       WHERE ds.fans IS NOT NULL OR ds.rating IS NOT NULL
       ORDER BY ${orderSQL}
       LIMIT ?`,
      [limit]
    ) as [Array<Record<string, unknown>>, unknown];

    const devices = rows.map((r, i) => ({
      rank: i + 1,
      slug: urlToSlug((r.gsmarena_url as string) || ""),
      name: r.name || "",
      brand: r.brand_name || "",
      thumbnail: r.thumbnail_url || "",
      chipset: r.chipset || "",
      ram: r.ram || "",
      main_camera: r.main_camera || "",
      battery: r.battery || "",
      display_size: r.display_size || "",
      os: r.os || "",
      rating: r.rating || null,
      fans: r.fans || null,
      announced: r.announced || "",
      status: r.status || "",
    }));

    return NextResponse.json({ devices, sort });
  } catch (err) {
    console.error("top-10 error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
