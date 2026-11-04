import { NextRequest, NextResponse } from "next/server";
import { getSessionCookieName, parseRest } from "@repo/provider/server";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 90;

type LoginResponse = {
	sessionToken?: string;
	error?: string;
};

const failure = (status: number) =>
	NextResponse.json(
		{ error: "Das Einloggen ist leider fehlgeschlagen" },
		{ status }
	);

const logFailedLogin = (email: string, reason: string) => {
	void parseRest("functions/create_log", {
		method: "POST",
		body: {
			type: "error",
			operation: "login",
			className: "Patstore",
			message: `Ungültiger Login: ${reason}`,
			data: { username: email },
			service: "login_patstore",
		},
	}).catch((error) => {
		console.error(
			"login log failed:",
			error instanceof Error ? error.message : error
		);
	});
};

export async function POST(request: NextRequest) {
	let body: { email?: unknown; password?: unknown };
	try {
		body = await request.json();
	} catch {
		return failure(400);
	}

	const email = typeof body.email === "string" ? body.email.trim() : "";
	const password = typeof body.password === "string" ? body.password : "";
	if (!email || !password) {
		return NextResponse.json(
			{ error: "Eine E-Mail Adresse und ein Passwort müssen angegeben werden" },
			{ status: 400 }
		);
	}

	try {
		const { status, data } = await parseRest<LoginResponse>("login", {
			method: "POST",
			body: { username: email, password },
		});

		if (status === 200 && data.sessionToken) {
			const response = NextResponse.json({ ok: true });
			// Readable by the browser: existing Parse calls still attach this cookie.
			response.cookies.set(getSessionCookieName(), data.sessionToken, {
				httpOnly: false,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				path: "/",
				maxAge: SESSION_MAX_AGE_SECONDS,
			});
			return response;
		}

		logFailedLogin(email, data.error || String(status));

		if (data.error === "Invalid username/password.") {
			return NextResponse.json(
				{ error: "Falsche E-Mail / Passwort Kombination" },
				{ status: 401 }
			);
		}

		return failure(status >= 500 ? 503 : 400);
	} catch (error) {
		console.error(
			"login error:",
			error instanceof Error ? error.message : error
		);
		logFailedLogin(
			email,
			error instanceof Error ? error.message : "request failed"
		);
		return failure(503);
	}
}
