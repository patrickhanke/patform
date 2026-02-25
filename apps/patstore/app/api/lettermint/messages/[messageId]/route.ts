import { NextRequest, NextResponse } from "next/server";

const LETTERMINT_API_BASE = "https://api.lettermint.co/v1";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ messageId: string }> }
) {
	const { messageId } = await params;

	if (!messageId) {
		return NextResponse.json(
			{ error: "messageId is required" },
			{ status: 400 }
		);
	}

	const apiKey =
		process.env.LETTERMINT_API_KEY ||
		process.env.NEXT_PUBLIC_LETTERMINT_KEY;

	if (!apiKey) {
		return NextResponse.json(
			{ error: "LetterMint API key not configured" },
			{ status: 500 }
		);
	}

	try {
		const response = await fetch(
			`${LETTERMINT_API_BASE}/messages/${messageId}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${apiKey}`,
					"Content-Type": "application/json"
				}
			}
		);

		const data = await response.json();

		if (!response.ok) {
			return NextResponse.json(data, { status: response.status });
		}

		return NextResponse.json(data);
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		console.error("LetterMint API error:", message);
		return NextResponse.json(
			{ error: message },
			{ status: 500 }
		);
	}
}
