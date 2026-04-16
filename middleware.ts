import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

import { canAccessPath, getPermissionForPath } from "@/lib/permissions";

const protectedPaths = [
  "/dashboard",
  "/contacts",
  "/opportunities",
  "/inbox",
  "/schedule",
  "/meta",
  "/automations",
  "/activity",
];

function getSecret() {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET ?? "fitness4all-local-dev-secret-change-me",
  );
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get("f4a_session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const verified = await jwtVerify(token, getSecret());
    const role = String(verified.payload.role ?? "");
    const permission = getPermissionForPath(pathname);

    if (permission && !canAccessPath(role as never, pathname)) {
      return NextResponse.redirect(new URL("/forbidden", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/contacts/:path*",
    "/opportunities/:path*",
    "/inbox/:path*",
    "/schedule/:path*",
    "/meta/:path*",
    "/automations/:path*",
    "/activity/:path*",
  ],
};
