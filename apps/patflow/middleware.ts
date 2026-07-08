import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") || // exclude Next.js internals
    pathname.startsWith("/api") || //  exclude all API routes
    pathname.startsWith("/static") || // exclude static files
    pathname.startsWith("/impressum") || // exclude impressum
    pathname.startsWith("/datenschutz") || // exclude datenschutz
    pathname === "/firebase-messaging-sw.js" ||
    PUBLIC_FILE.test(pathname) // exclude all files in the public folder
  ) {
    return NextResponse.next();
  }

  const token = process.env.SESSION_TOKEN
    ? request.cookies.get(process.env.SESSION_TOKEN)?.value
    : "";
  const loggedInCookie =
    request.cookies.get(`${process.env.SESSION_TOKEN}_logged_in`)?.value || "";
  let loggedIn = loggedInCookie === "true" || false;

  if (!token) {
    loggedIn = false;
  }

  const httpHeaders = {
    "X-Parse-Session-Token": token || "",
    "X-Parse-Application-Id": process.env.SASHIDO_APP_ID || "",
    "X-Parse-REST-API-Key": process.env.SASHIDO_REST_KEY || "",
  };

  const headers = new Headers(httpHeaders);

  if (token && !loggedIn) {
    await fetch(`${process.env.SASHIDO_API_URL}users/me`, {
      method: "GET",
      headers,
    })
      .then((response) => response.json())
      .then((actualData) => {
        if (actualData.sessionToken === token) {
          loggedIn = true;
        }
      })
      .catch((error) => {
        console.error(error.message);
        loggedIn = false;
      });
  }
  const response = NextResponse.next();

  if (!token && request.nextUrl.pathname !== "/login") {
    return NextResponse.rewrite(new URL("/login", request.url));
  }

  return response;
}
