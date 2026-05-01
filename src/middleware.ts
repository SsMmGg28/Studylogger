import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session");
  const clientSession = request.cookies.get("client-session")?.value === "true";
  const { pathname } = request.nextUrl;

  const publicPaths = ["/landing", "/auth/login", "/auth/register", "/download"];
  const isPublicPath = publicPaths.includes(pathname);

  // Allow static files, API routes, and setup-username (which requires partial auth) to pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/api/cron") ||
    pathname.startsWith("/api/desktop") ||
    pathname === "/auth/setup-username" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Demo mode cookie check (used for local testing)
  const isDemo = request.cookies.get("demo-mode")?.value === "true";
  const hasAuthHint = Boolean(session) || clientSession || isDemo;

  if (!hasAuthHint && !isPublicPath) {
    return NextResponse.redirect(new URL("/landing", request.url));
  }

  if (hasAuthHint && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.json).*)"],
};
