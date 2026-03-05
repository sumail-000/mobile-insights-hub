import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";
import { signToken } from "@/lib/auth-server";
import crypto from "crypto";

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const h = crypto.pbkdf2Sync(password, salt, 100_000, 32, "sha256").toString("hex");
  return `${salt}$${h}`;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";

  if (!name || !email || !password)
    return NextResponse.json({ error: "name, email and password are required" }, { status: 400 });
  if (password.length < 6)
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email))
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });

  try {
    const [existing] = await pool.execute("SELECT id FROM users WHERE email=?", [email]) as [Array<{ id: number }>, unknown];
    if (existing.length) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password_hash) VALUES (?,?,?)",
      [name, email, hashPassword(password)]
    ) as [{ insertId: number }, unknown];

    const userId = result.insertId;
    const token = await signToken({ sub: String(userId), name, email });
    const cookieStore = await cookies();
    cookieStore.set("ps_token", token, { httpOnly: true, secure: false, maxAge: 60 * 60 * 24 * 30, path: "/" });

    return NextResponse.json({ token, user: { id: userId, name, email, wishlist: [] } }, { status: 201 });
  } catch (err) {
    console.error("signup error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
