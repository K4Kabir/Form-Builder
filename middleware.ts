import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  const { pathname } = request.nextUrl;

  // If the user is on an auth route and has a session, redirect to the dashboard
  if (sessionCookie && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If the user is on a protected route and does not have a session, redirect to the home page
  if (
    !sessionCookie &&
    (pathname.startsWith("/dashboard") || pathname.startsWith("/profile"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/profile", "/auth/:path*"], // Apply middleware to auth, dashboard and profile routes
};
