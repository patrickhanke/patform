import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Note: File uploads using Parse SDK need to remain client-side
// as they require the Parse SDK's File handling capabilities.
// This endpoint can be used for other file operations if needed.

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get("file") as File;
		const fileName = formData.get("fileName") as string;

		if (!file) {
			return NextResponse.json(
				{ error: "File is required" },
				{ status: 400 }
			);
		}

		const cookieStore = await cookies();
		const sessionToken = cookieStore.get(
			process.env.SESSION_TOKEN || "patstore_token"
		)?.value;

		// Convert file to base64 for Parse
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const base64 = buffer.toString("base64");

		// Upload to Parse
		const response = await fetch(`${process.env.SASHIDO_API_URL}/files/${fileName}`, {
			method: "POST",
			headers: {
				"X-Parse-Application-Id": process.env.SASHIDO_APP_ID!,
				"X-Parse-REST-API-Key": process.env.SASHIDO_REST_KEY!,
				"X-Parse-Session-Token": sessionToken || "",
				"Content-Type": file.type
			},
			body: JSON.stringify({
				base64,
				_ContentType: file.type
			})
		});

		const data = await response.json();

		return NextResponse.json(data);
	} catch (error: any) {
		console.error("File upload error:", error.message);
		return NextResponse.json(
			{ error: error.message },
			{ status: 500 }
		);
	}
}
