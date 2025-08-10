import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip NextAuth routes, login page, static files, and assets
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get the NextAuth session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: true,
  });

  // If not logged in and accessing /checker → send to login
  if (!token && pathname.startsWith("/checker")) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Only run for /checker routes
export const config = {
  matcher: ["/checker/:path*"],
};
