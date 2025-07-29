import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface MyJWTPayload {
  userId: string;
  email: string;
  requests: number;
}

export function verifyToken(token: string): MyJWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as MyJWTPayload;
    return decoded;
  } catch (err) {
    console.error("❌ Token verification failed:", err);
    return null;
  }
}
