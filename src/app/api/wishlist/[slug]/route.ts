export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSessionUser } from "@/lib/auth-server";

export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await params;

  try {
    await pool.execute(
      "DELETE FROM user_wishlist WHERE user_id=? AND device_slug=?",
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
