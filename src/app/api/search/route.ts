import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() || "";
  if (!q || q.length < 2) return NextResponse.json({ results: [], total: 0 });

  try {
    const [rows] = await pool.execute(
      `SELECT d.name, d.gsmarena_url, d.thumbnail_url, d.summary, b.name AS brand_name,
              ds.chipset, ds.ram, ds.main_camera, ds.battery, ds.display_size, ds.os
       FROM devices d JOIN brands b ON b.id = d.brand_id
       LEFT JOIN device_specs ds ON ds.device_id = d.id
       WHERE d.name LIKE ? OR b.name LIKE ?
       ORDER BY d.name ASC LIMIT 20`,
      [`%${q}%`, `%${q}%`]
    ) as [Array<Record<string, unknown>>, unknown];

    const results = rows.map((r) => {
      const m = (r.gsmarena_url as string || "").match(/\/([^/]+)\.php$/);
      const slug = m ? m[1] : "";
      return { id: slug, slug, name: r.name || "", brand: r.brand_name || "",
        thumbnail: r.thumbnail_url || "", summary: r.summary || "",
        chipset: r.chipset || "", ram: r.ram || "", main_camera: r.main_camera || "",
        battery: r.battery || "", display_size: r.display_size || "", os: r.os || "" };
    });

    return NextResponse.json({ results, total: results.length });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
