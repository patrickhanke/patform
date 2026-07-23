import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;
const SESSION_COOKIE =
	process.env.SESSION_TOKEN || "patflow_session_token";

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		pathname.startsWith("/static") ||
		pathname.startsWith("/login") ||
		pathname.startsWith("/impressum") ||
		pathname.startsWith("/datenschutz") ||
		pathname === "/firebase-messaging-sw.js" ||
		PUBLIC_FILE.test(pathname)
	) {
		return NextResponse.next();
	}

	const token = request.cookies.get(SESSION_COOKIE)?.value;

	if (!token) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	const userData = await fetch(`${process.env.SASHIDO_API_URL}users/me`, {
		method: "GET",
		headers: {
			"X-Parse-Session-Token": token,
			"X-Parse-Application-Id": process.env.SASHIDO_APP_ID || "",
			"X-Parse-REST-API-Key": process.env.SASHIDO_REST_KEY || "",
		},
	})
		.then((response) => response.json())
		.catch(() => null);

	if (userData?.objectId) {
		return NextResponse.next();
	}

	const response = NextResponse.redirect(new URL("/login", request.url));
	response.cookies.set(SESSION_COOKIE, "", { maxAge: 0 });
	response.cookies.set(`${SESSION_COOKIE}_logged_in`, "", { maxAge: 0 });
	return response;
}
