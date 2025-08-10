import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1️⃣ Skip NextAuth routes, login, static files, assets
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2️⃣ Only act on normal browser navigations
  const acceptHeader = request.headers.get("accept") || "";
  const purpose = request.headers.get("purpose") || "";
  if (
    request.method !== "GET" || // Skip non-GET requests
    !acceptHeader.includes("text/html") || // Skip API/asset calls
    purpose === "prefetch" // Skip browser prefetch
  ) {
    return NextResponse.next();
  }

  // 3️⃣ Get NextAuth session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: true,
  });

  // 4️⃣ Protect /checker
  if (!token && pathname.startsWith("/checker")) {
    console.log("🚫 No token found, redirecting to /auth/login");
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// 5️⃣ Only match /checker routes
export const config = {
  matcher: ["/checker/:path*"],
};
