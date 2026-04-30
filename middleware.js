import { proxy } from "@/lib/proxy";

export function middleware(request) {
  return proxy(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profiles/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
