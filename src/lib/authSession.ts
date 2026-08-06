import { NextResponse } from "next/server";

/** Session length for auth cookies (30 days). Sanctum tokens typically outlive this. */
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export function dashboardForRole(role?: string | null) {
  switch (role) {
    case "author":
      return "/content-dashboard";
    case "accountant":
      return "/accountant-dashboard";
    default:
      return "/admin-dashboard";
  }
}

export function roleFromUser(user: {
  admin_role?: string | null;
  role?: string | null;
} | null | undefined) {
  return user?.admin_role ?? user?.role ?? null;
}

type CookieOptions = {
  httpOnly: boolean;
  path: string;
  maxAge: number;
  sameSite: "lax";
  secure: boolean;
};

function authCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    path: "/",
    maxAge: AUTH_COOKIE_MAX_AGE,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };
}

export function applyAuthCookies(
  response: NextResponse,
  token: string,
  role?: string | null
) {
  const options = authCookieOptions();
  response.cookies.set("token", token, options);
  if (role) {
    response.cookies.set("role", role, options);
  }
  return response;
}
