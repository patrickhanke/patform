import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

// Helper to create axios client with proper headers
const createAxiosClient = (useMasterKey: boolean, sessionToken?: string) => {
	const headers: Record<string, string> = {
		"X-Parse-Application-Id": process.env.SASHIDO_APP_ID!,
		"X-Parse-REST-API-Key": process.env.SASHIDO_REST_KEY!
	};

	if (sessionToken) {
		headers["X-Parse-Session-Token"] = sessionToken;
	}

	if (useMasterKey) {
		headers["X-Parse-Master-Key"] = process.env.SASHIDO_MASTER_KEY!;
	}

	return axios.create({
		baseURL: process.env.SASHIDO_API_URL,
		headers
	});
};

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const className = searchParams.get("className");
		const query = searchParams.get("query");
		const useMasterKey = searchParams.get("useMasterKey") === "true";

		if (!className) {
			return NextResponse.json(
				{ error: "className is required" },
				{ status: 400 }
			);
		}

		const cookieStore = await cookies();
		const sessionToken = cookieStore.get(
			process.env.SESSION_TOKEN || "patstore_token"
		)?.value;

		const client = createAxiosClient(useMasterKey, sessionToken);

		const url = query
			? `classes/${className}?where={${query}}`
			: `classes/${className}`;

		const response = await client.get(url);

		return NextResponse.json(response.data);
	} catch (error: any) {
		console.error("GET Error:", error.message);
		return NextResponse.json(
			{ error: error.message, details: error.response?.data },
			{ status: error.response?.status || 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const {
			className,
			updateObject,
			useMasterKey,
			userId,
			projectId
		} = body;

		if (!className) {
			return NextResponse.json(
				{ error: "className is required" },
				{ status: 400 }
			);
		}

		const cookieStore = await cookies();
		const sessionToken = cookieStore.get(
			process.env.SESSION_TOKEN || "patstore_token"
		)?.value;

		const client = createAxiosClient(useMasterKey, sessionToken);

		// Add metadata to the object
		const dataToSave = { ...updateObject };

		if (userId) {
			dataToSave.created_by = {
				__type: "Pointer",
				className: "_User",
				objectId: userId
			};
		}

		if (projectId) {
			dataToSave.project = {
				__type: "Pointer",
				className: "Project",
				objectId: projectId
			};
		}

		const response = await client.post(`classes/${className}`, dataToSave);

		return NextResponse.json(response.data);
	} catch (error: any) {
		console.error("POST Error:", error.message);
		return NextResponse.json(
			{ error: error.message, details: error.response?.data },
			{ status: error.response?.status || 500 }
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();
		const {
			className,
			objectId,
			updateObject,
			useMasterKey,
			userId,
			projectId
		} = body;

		if (!className || !objectId) {
			return NextResponse.json(
				{ error: "className and objectId are required" },
				{ status: 400 }
			);
		}

		const cookieStore = await cookies();
		const sessionToken = cookieStore.get(
			process.env.SESSION_TOKEN || "patstore_token"
		)?.value;

		const client = createAxiosClient(useMasterKey, sessionToken);

		// Add metadata to the object
		const dataToUpdate = { ...updateObject };

		if (userId) {
			dataToUpdate.updated_by = {
				__type: "Pointer",
				className: "_User",
				objectId: userId
			};
		}

		if (projectId) {
			dataToUpdate.project = {
				__type: "Pointer",
				className: "Project",
				objectId: projectId
			};
		}

		const response = await client.put(
			`classes/${className}/${objectId}`,
			dataToUpdate
		);

		return NextResponse.json(response.data);
	} catch (error: any) {
		console.error("PUT Error:", error.message);
		return NextResponse.json(
			{ error: error.message, details: error.response?.data },
			{ status: error.response?.status || 500 }
		);
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const className = searchParams.get("className");
		const objectId = searchParams.get("objectId");
		const useMasterKey = searchParams.get("useMasterKey") === "true";

		if (!className || !objectId) {
			return NextResponse.json(
				{ error: "className and objectId are required" },
				{ status: 400 }
			);
		}

		const cookieStore = await cookies();
		const sessionToken = cookieStore.get(
			process.env.SESSION_TOKEN || "patstore_token"
		)?.value;

		const client = createAxiosClient(useMasterKey, sessionToken);

		const response = await client.delete(`classes/${className}/${objectId}`);

		return NextResponse.json(response.data);
	} catch (error: any) {
		console.error("DELETE Error:", error.message);
		return NextResponse.json(
			{ error: error.message, details: error.response?.data },
			{ status: error.response?.status || 500 }
		);
	}
}
