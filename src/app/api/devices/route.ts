export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import pool from "@/lib/db";

function urlToSlug(url: string): string {
  const m = url.match(/\/([^/]+)\.php$/);
  return m ? m[1] : url;
}

function serializeDevice(row: Record<string, unknown>) {
  const slug = urlToSlug((row.gsmarena_url as string) || "");
  return {
    id: slug, slug,
    name: row.name || "",
    brand: row.brand_name || "",
    thumbnail: row.thumbnail_url || "",
    summary: row.summary || "",
    chipset: row.chipset || "",
    ram: row.ram || "",
    main_camera: row.main_camera || "",
    battery: row.battery || "",
    display_size: row.display_size || "",
    os: row.os || "",
    rating: row.rating || null,
    fans: row.fans || null,
  };
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const brand = sp.get("brand") || "";
  const search = sp.get("search") || "";
  const page = Math.max(1, Number(sp.get("page") || 1));
  const limit = Math.min(100, Math.max(1, Number(sp.get("limit") || 24)));
  const sort = sp.get("sort") || "name";
  const network = sp.get("network") || "";
  const ram = sp.get("ram") || "";
  const os = sp.get("os") || "";
  const offset = (page - 1) * limit;

  const where: string[] = ["1=1"];
  const params: (string | number)[] = [];

  if (brand) { where.push("b.name = ?"); params.push(brand); }
  if (search) { where.push("(d.name LIKE ? OR b.name LIKE ?)"); params.push(`%${search}%`, `%${search}%`); }
  if (network) { where.push("ds.network LIKE ?"); params.push(`%${network}%`); }
  if (ram) { where.push("ds.ram LIKE ?"); params.push(`%${ram}%`); }
  if (os) { where.push("ds.os LIKE ?"); params.push(`%${os}%`); }

  const whereSQL = where.join(" AND ");
  const orderMap: Record<string, string> = {
    name: "d.name ASC",
    rating: "CAST(ds.rating AS DECIMAL(4,2)) DESC",
    fans: "CAST(REPLACE(IFNULL(ds.fans,'0'), ',', '') AS UNSIGNED) DESC",
    newest: "d.scraped_at DESC",
  };
  const orderSQL = orderMap[sort] || "d.name ASC";

  try {
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total FROM devices d
       JOIN brands b ON b.id = d.brand_id
       LEFT JOIN device_specs ds ON ds.device_id = d.id
       WHERE ${whereSQL}`,
      params
    ) as [Array<{ total: number }>, unknown];
    const total = countRows[0]?.total || 0;

    const [rows] = await pool.execute(
      `SELECT d.name, d.gsmarena_url, d.thumbnail_url, d.summary,
              b.name AS brand_name,
              ds.chipset, ds.ram, ds.main_camera, ds.battery,
              ds.display_size, ds.os, ds.rating, ds.fans
       FROM devices d
       JOIN brands b ON b.id = d.brand_id
       LEFT JOIN device_specs ds ON ds.device_id = d.id
       WHERE ${whereSQL}
       ORDER BY ${orderSQL}
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    ) as [Array<Record<string, unknown>>, unknown];

    return NextResponse.json({
      devices: rows.map(serializeDevice),
      total, page, limit,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("devices error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

