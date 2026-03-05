import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const category = sp.get("category") || "";
  const featured = sp.get("featured") || "";
  const brand = sp.get("brand") || "";
  const limit = Math.min(50, Math.max(1, Number(sp.get("limit") || 20)));
  const page = Math.max(1, Number(sp.get("page") || 1));
  const offset = (page - 1) * limit;

  const where: string[] = ["1=1"];
  const params: (string | number)[] = [];

  if (category) { where.push("category = ?"); params.push(category); }
  if (featured === "1") { where.push("is_featured = 1"); }
  if (brand) { where.push("related_brand = ?"); params.push(brand); }

  try {
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) as total FROM news_articles WHERE ${where.join(" AND ")}`,
      params
    ) as [Array<{ total: number }>, unknown];
    const total = countRows[0]?.total || 0;

    const [rows] = await pool.execute(
      `SELECT id, slug, title, excerpt, category, author, thumbnail_url,
              related_device_slug, related_brand, published_at, is_featured, views
       FROM news_articles WHERE ${where.join(" AND ")}
       ORDER BY is_featured DESC, published_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    ) as [Array<Record<string, unknown>>, unknown];

    return NextResponse.json({ articles: rows, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("news error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, title, excerpt, content, category, author, thumbnail_url,
      related_device_slug, related_brand, is_featured } = body;
    if (!slug || !title) return NextResponse.json({ error: "slug and title required" }, { status: 400 });
    await pool.execute(
      `INSERT INTO news_articles (slug,title,excerpt,content,category,author,thumbnail_url,related_device_slug,related_brand,is_featured)
       VALUES (?,?,?,?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE title=VALUES(title),excerpt=VALUES(excerpt),updated_at=NOW()`,
      [slug, title, excerpt||null, content||null, category||'news', author||'Editorial Team',
       thumbnail_url||null, related_device_slug||null, related_brand||null, is_featured?1:0]
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("news POST error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

