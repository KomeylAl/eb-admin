import jwt from "jsonwebtoken";

const secret = process.env.ACCESS_TOKEN_SECRET || "super-secret-key";

export function verifyJwt<T = any>(token: string): T | null {
  if (!secret) throw new Error("JWT_SECRET is not set in env");
  try {
    const j = jwt.verify(token, secret) as T;
    return j;
  } catch (e) {
    return null;
  }
}
