import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtUtils } from "./utils/jwt";
import { getNewAccessToken } from "./service/refreshToken";

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = ["/", "/news"];
// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const cookiesStore = await cookies();
  /* system 1 for get cookies */
  // const cookiesStore = await cookies();
  //   const accessToken = cookiesStore.get("accessToken")?.value;

  /* system 2 for get cookies */
  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let decodedAccessToken = accessToken
    ? await jwtUtils.verifyToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string,
      )
    : null;

  const decodedRefreshToken = refreshToken
    ? await jwtUtils.verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      )
    : null;

  // console.log(decodedAccessToken , decodedRefreshToken)
  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    // console.log("Refresh")
    // access Token has expired but refresh Token is valid, get new access Token from backend
    const result = await getNewAccessToken();
    if (result.success) {
      const newAccessToken = result.data.accessToken;
      cookiesStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
      });

      accessToken = newAccessToken;
      decodedAccessToken = await jwtUtils.verifyToken(
        accessToken!,
        process.env.JWT_ACCESS_SECRET as string,
      );
    }
  }

  let userRole = null;
  if (decodedAccessToken?.success) {
    userRole = (decodedAccessToken.data as JwtPayload).role;
  }

  if (!decodedAccessToken?.success) {
    // token has expired or is invalid, clear the cookies
    cookiesStore.delete("accessToken");
    // return NextResponse.redirect(new URL("/login", request.url));
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
  // console.log(pathname);
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
