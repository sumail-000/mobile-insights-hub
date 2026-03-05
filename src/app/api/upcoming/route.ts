export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const brand = sp.get("brand") || "";
  const quarter = sp.get("quarter") || "";
  const status = sp.get("status") || "";
  const search = sp.get("search") || "";

  const where: string[] = ["1=1"];
  const params: (string | number)[] = [];

  if (brand) { where.push("brand = ?"); params.push(brand); }
  if (quarter) { where.push("launch_quarter = ?"); params.push(quarter); }
  if (status) { where.push("status = ?"); params.push(status); }
  if (search) { where.push("(name LIKE ? OR brand LIKE ?)"); params.push(`%${search}%`, `%${search}%`); }

  try {
    const [rows] = await pool.execute(
      `SELECT * FROM upcoming_phones WHERE ${where.join(" AND ")} ORDER BY hype DESC`,
      params
    ) as [Array<Record<string, unknown>>, unknown];

    return NextResponse.json({ upcoming: rows });
  } catch (err) {
    console.error("upcoming error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, name, brand, brand_color, expected_price, launch_quarter, launch_date, status,
      thumbnail_url, chipset, ram, camera, battery, display, hype, followers, description } = body;
    if (!slug || !name || !brand) return NextResponse.json({ error: "slug, name, brand required" }, { status: 400 });
    await pool.execute(
      `INSERT INTO upcoming_phones (slug,name,brand,brand_color,expected_price,launch_quarter,launch_date,status,thumbnail_url,chipset,ram,camera,battery,display,hype,followers,description)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE name=VALUES(name),brand=VALUES(brand),hype=VALUES(hype),updated_at=NOW()`,
      [slug,name,brand,brand_color||'#ff6e14',expected_price||'TBA',launch_quarter||null,launch_date||null,
       status||'Rumored',thumbnail_url||null,chipset||null,ram||null,camera||null,battery||null,display||null,
       hype||50,followers||'0',description||null]
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("upcoming POST error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

