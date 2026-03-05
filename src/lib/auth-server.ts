import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "phonespecs-secret-2026-change-in-prod"
);

export interface JWTPayload {
  sub: string;
  name: string;
  email: string;
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("ps_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}
