import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSessionUser } from "@/lib/auth-server";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const [rows] = await pool.execute(
      "SELECT device_slug FROM user_wishlist WHERE user_id=? ORDER BY added_at DESC",
      [session.sub]
    ) as [Array<{ device_slug: string }>, unknown];
    return NextResponse.json({ wishlist: rows.map(r => r.device_slug) });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const slug = (body.slug || "").trim();
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  try {
    await pool.execute(
      "INSERT IGNORE INTO user_wishlist (user_id, device_slug) VALUES (?, ?)",
      [session.sub, slug]
    );
    const [rows] = await pool.execute(
      "SELECT device_slug FROM user_wishlist WHERE user_id=? ORDER BY added_at DESC",
      [session.sub]
    ) as [Array<{ device_slug: string }>, unknown];
    return NextResponse.json({ wishlist: rows.map(r => r.device_slug) });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
