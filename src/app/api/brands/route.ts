export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [brands] = await pool.execute(`
      SELECT b.name, b.gsmarena_url, COUNT(d.id) AS device_count
      FROM brands b
      LEFT JOIN devices d ON d.brand_id = b.id
      GROUP BY b.id, b.name, b.gsmarena_url
      ORDER BY b.name
    `);
    return NextResponse.json({ brands });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

