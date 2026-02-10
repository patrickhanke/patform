import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "edge";

interface GraphQLRequest {
	query: string;
	variables?: Record<string, any>;
	useMasterKey?: boolean;
}

// Helper to create headers for GraphQL request
const createHeaders = (useMasterKey: boolean, sessionToken?: string) => {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		"X-Parse-Application-Id": process.env.SASHIDO_APP_ID!,
		"X-Parse-REST-API-Key": process.env.SASHIDO_REST_KEY!
	};

	if (sessionToken) {
		headers["X-Parse-Session-Token"] = sessionToken;
	}

	if (useMasterKey && process.env.SASHIDO_MASTER_KEY) {
		headers["X-Parse-Master-Key"] = process.env.SASHIDO_MASTER_KEY;
	}

	return headers;
};

export async function POST(request: NextRequest) {
	try {
		const body: GraphQLRequest = await request.json();
		const { query, variables, useMasterKey = false } = body;

		if (!query) {
			return NextResponse.json(
				{ error: "GraphQL query is required" },
				{ status: 400 }
			);
		}

		// Get session token from cookies
		const cookieStore = await cookies();
		const sessionToken = cookieStore.get(
			process.env.SESSION_TOKEN || "patstore_token"
		)?.value;

		// Prepare headers
		const headers = createHeaders(useMasterKey, sessionToken);

		// Make GraphQL request to Parse Server
		const graphqlUrl = process.env.SASHIDO_GQL_URL;

		if (!graphqlUrl) {
			return NextResponse.json(
				{ 
					errors: [{ 
						message: "SASHIDO_GQL_URL environment variable is not configured",
						extensions: { code: "CONFIGURATION_ERROR" }
					}]
				},
				{ status: 500 }
			);
		}
		
		const response = await fetch(graphqlUrl, {
			method: "POST",
			headers,
			body: JSON.stringify({
				query,
				variables
			})
		});

		const data = await response.json();

		// Check for GraphQL errors
		if (data.errors) {
			console.error("GraphQL Errors:", data.errors);
			return NextResponse.json(
				{ 
					errors: data.errors,
					data: data.data || null 
				},
				{ status: 200 } // GraphQL spec returns 200 even with errors
			);
		}

		return NextResponse.json(data);
	} catch (error: any) {
		console.error("GraphQL Route Error:", error.message);
		return NextResponse.json(
			{ 
				errors: [{ 
					message: error.message,
					extensions: { code: "INTERNAL_SERVER_ERROR" }
				}]
			},
			{ status: 500 }
		);
	}
}
