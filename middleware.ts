import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Only run our logic here — don't re-export NextAuth's middleware
export async function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // If we're already on the login page, don't redirect again
  if (url.pathname.startsWith("/auth/login")) {
    return NextResponse.next();
  }

  // Get session token
  const token = await getToken({
    req: request,
    secureCookie: process.env.NODE_ENV === "production",
  });

  // Protect /checker route
  if (!token && url.pathname === "/checker") {
    // Always build URL from canonical NEXTAUTH_URL if set
    const loginUrl = new URL(
      "/auth/login",
      process.env.NEXTAUTH_URL || request.url
    );
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Only run on protected routes (no /auth/login to avoid loop)
export const config = {
  matcher: ["/checker"],
};
