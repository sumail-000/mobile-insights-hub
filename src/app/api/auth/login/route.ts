import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";
import { signToken } from "@/lib/auth-server";
import crypto from "crypto";

function checkPassword(password: string, stored: string) {
  try {
    const [salt, h] = stored.split("$");
    const attempt = crypto.pbkdf2Sync(password, salt, 100_000, 32, "sha256").toString("hex");
    return crypto.timingSafeEqual(Buffer.from(h, "hex"), Buffer.from(attempt, "hex"));
  } catch { return false; }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";

  if (!email || !password)
    return NextResponse.json({ error: "email and password are required" }, { status: 400 });

  try {
    const [rows] = await pool.execute(
      "SELECT id, name, email, password_hash, avatar_url FROM users WHERE email=?", [email]
    ) as [Array<{ id: number; name: string; email: string; password_hash: string; avatar_url?: string }>, unknown];

    const user = rows[0];
    if (!user || !checkPassword(password, user.password_hash))
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const [wlRows] = await pool.execute(
      "SELECT device_slug FROM user_wishlist WHERE user_id=? ORDER BY added_at DESC",
      [user.id]
    ) as [Array<{ device_slug: string }>, unknown];
    const wishlist = wlRows.map(r => r.device_slug);
    const token = await signToken({ sub: String(user.id), name: user.name, email: user.email });

    const cookieStore = await cookies();
    cookieStore.set("ps_token", token, { httpOnly: true, secure: false, maxAge: 60 * 60 * 24 * 30, path: "/" });

    return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email, avatar_url: user.avatar_url, wishlist } });
  } catch (err) {
    console.error("login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

