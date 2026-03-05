import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSessionUser } from "@/lib/auth-server";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [rows] = await pool.execute(
      "SELECT id, name, email, avatar_url, created_at FROM users WHERE id=?", [session.sub]
    ) as [Array<{ id: number; name: string; email: string; avatar_url?: string; created_at?: Date }>, unknown];

    const user = rows[0];
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const [wlRows] = await pool.execute(
      "SELECT device_slug FROM user_wishlist WHERE user_id=? ORDER BY added_at DESC",
      [session.sub]
    ) as [Array<{ device_slug: string }>, unknown];
    const wishlist = wlRows.map(r => r.device_slug);
    return NextResponse.json({ id: user.id, name: user.name, email: user.email, avatar_url: user.avatar_url, wishlist, created_at: user.created_at?.toISOString() || null });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
