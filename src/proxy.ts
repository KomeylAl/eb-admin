import { NextRequest, NextResponse } from "next/server";

function dashboardForRole(role?: string) {
  switch (role) {
    case "author":
      return "/content-dashboard";
    case "accountant":
      return "/accountant-dashboard";
    default:
      return "/admin-dashboard";
  }
}

export default function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  // Cookie stores admin_role (boss, author, accountant, …)
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  // static resources => skip
  if (
    pathname.startsWith("/_next/static/") ||
    pathname.startsWith("/static/") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // --- ROOT ---
  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(
        new URL(dashboardForRole(role), request.url)
      );
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // --- AUTH PAGE ---
  if (pathname.startsWith("/auth/login")) {
    if (token) {
      return NextResponse.redirect(
        new URL(dashboardForRole(role), request.url)
      );
    }
    return NextResponse.next();
  }

  // --- DASHBOARD PAGES ---
  if (pathname.startsWith("/admin-dashboard")) {
    if (!token)
      return NextResponse.redirect(new URL("/auth/login", request.url));
    if (role === "author")
      return NextResponse.redirect(new URL("/content-dashboard", request.url));
    if (role === "accountant")
      return NextResponse.redirect(
        new URL("/accountant-dashboard", request.url)
      );
  }

  if (pathname.startsWith("/content-dashboard")) {
    if (!token)
      return NextResponse.redirect(new URL("/auth/login", request.url));
    if (role !== "author")
      return NextResponse.redirect(new URL(dashboardForRole(role), request.url));
  }

  if (pathname.startsWith("/accountant-dashboard")) {
    if (!token)
      return NextResponse.redirect(new URL("/auth/login", request.url));
    if (role !== "accountant")
      return NextResponse.redirect(new URL(dashboardForRole(role), request.url));
  }

  // --- DEFAULT ---
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/admin-dashboard/:path*",
    "/content-dashboard/:path*",
    "/accountant-dashboard/:path*",
    "/auth/login",
  ],
};
