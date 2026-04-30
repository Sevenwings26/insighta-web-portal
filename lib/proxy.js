import { NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/profiles",
  "/admin",
];

const authRoutes = [
  "/login",
  "/register",
];

export function proxy(request) {
  const { pathname } = request.nextUrl;

  const accessToken =
    request.cookies.get("access_token");

  const isAuthenticated = !!accessToken;

  // Protect routes
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // Prevent logged-in users from accessing login/register
  const isAuthPage = authRoutes.includes(pathname);

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return NextResponse.next();
}
