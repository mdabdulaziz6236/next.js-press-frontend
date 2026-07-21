import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtUtils } from "./utils/jwt";

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = ["/", "/news"];
// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  /* system 1 for get cookies */
  const cookiesStore = await cookies();
  //   const accessToken = cookiesStore.get("accessToken")?.value;

  /* system 2 for get cookies */
  const accessToken = request.cookies.get("accessToken")?.value;

  const decodedToken = accessToken
    ? await jwtUtils.verifyToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string,
      )
    : null;
  let userRole = null;
  if (decodedToken?.success) {
    userRole = (decodedToken.data as JwtPayload).role;
  }

  if (!decodedToken?.success) {
    // token has expired or is invalid, clear the cookies
    cookiesStore.delete("accessToken");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // user is logged in and trying to access Auth routes , redirect to root or dashboard;
  if (accessToken && AUTH_ROUTES.includes(pathname)) {
    if (userRole === "USER") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    } else if (userRole === "AUTHOR") {
      return NextResponse.redirect(new URL("/author-dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  // Authenticated pages protection
  if (!accessToken && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Authorization
  if (pathname.startsWith("/dashboard") && userRole !== "USER") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  } else if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  } else if (
    pathname.startsWith("/author-dashboard") &&
    userRole !== "AUTHOR"
  ) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // "/dashboard/:path*",
    // "/admin-dashboard"

    "/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)",
  ],
};
