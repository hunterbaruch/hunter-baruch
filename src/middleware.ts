import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Lightweight admin gate — cookie presence only.
 *
 * Do NOT import `@/lib/auth` here. Wrapping middleware with NextAuth pulls
 * Prisma + bcrypt into the Edge bundle and exceeds Vercel's 1 MB middleware
 * size limit. Real session validation still happens in admin server pages
 * via `auth()`.
 */
function hasSessionCookie(request: NextRequest) {
  return Boolean(
    request.cookies.get("__Secure-authjs.session-token")?.value ||
      request.cookies.get("authjs.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value ||
      request.cookies.get("next-auth.session-token")?.value,
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname.startsWith("/admin/login");
  const signedIn = hasSessionCookie(request);

  if (!isLogin && !signedIn) {
    const loginUrl = new URL("/admin/login", request.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLogin && signedIn) {
    return NextResponse.redirect(new URL("/admin/leads", request.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
