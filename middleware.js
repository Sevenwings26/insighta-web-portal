// middleware.js
import { NextResponse } from "next/server";

// Protected routes (cannot be accessed without auth)
const protectedRoutes = ["/dashboard", "/profiles", "/admin"];
// Auth routes (redirect to dashboard if already logged in)
const authRoutes = ["/login", "/register"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check for access token in cookies (can only be done server-side)
  const accessToken = request.cookies.get("access_token");
  const isAuthenticated = !!accessToken;
  
  // Redirect to login if accessing protected route without auth
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Redirect to dashboard if accessing auth route while authenticated
  if (authRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};



// import { NextResponse } from "next/server";

// export function middleware(request) {
//   const token =
//     request.cookies.get("access_token");

//   const path = request.nextUrl.pathname;

//   const protectedRoutes = [
//     "/dashboard",
//     "/profiles",
//     "/admin",
//   ];

//   const isProtected =
//     protectedRoutes.some((route) =>
//       path.startsWith(route)
//     );

//   if (isProtected && !token) {
//     return NextResponse.redirect(
//       new URL("/login", request.url)
//     );
//   }

//   return NextResponse.next();
// }


// // import { NextResponse } from "next/server";

// // export function middleware(request) {
// //   return NextResponse.next();
// // }

// // export const config = {
// //   matcher: [
// //     "/dashboard/:path*",
// //     "/profiles/:path*",
// //     "/admin/:path*",
// //   ],
// // };

