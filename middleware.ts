import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1️⃣ Skip middleware for NextAuth API routes & login page
  if (
    pathname.startsWith("/api/auth") || // NextAuth endpoints
    pathname.startsWith("/auth/login") // Login page
  ) {
    return NextResponse.next();
  }

  // 2️⃣ Check session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  // 3️⃣ Redirect to login if no token on protected route
  if (!token && pathname.startsWith("/checker")) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.search = ""; // Remove query params to avoid loops
    return NextResponse.redirect(loginUrl);
  }

  // 4️⃣ Allow request through
  return NextResponse.next();
}

// 5️⃣ Only run on /checker pages
export const config = {
  matcher: ["/checker/:path*"],
};
