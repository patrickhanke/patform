import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const createAxiosClient = (useMasterKey: boolean) => {
	const headers: Record<string, string> = {
		"X-Parse-Application-Id": process.env.SASHIDO_APP_ID!,
		"X-Parse-REST-API-Key": process.env.SASHIDO_REST_KEY!
	};

	if (useMasterKey) {
		headers["X-Parse-Master-Key"] = process.env.SASHIDO_MASTER_KEY!;
	}

	return axios.create({
		baseURL: process.env.SASHIDO_API_URL,
		headers
	});
};

export async function POST(request: NextRequest) {
	const body = await request.json();
	const { email } = body;

	const client = createAxiosClient(true);

	try {
		const getUserProjects = await client.post("functions/get_user_projects_with_lettermint_key", { email });

		const userProjects = getUserProjects.data.result;
		console.log("userProjects", userProjects);
		if (!getUserProjects.data.result) {
			return NextResponse.json(
				{ error: "No projects found for user" },
				{ status: 404 }
			);
		}
		console.log("userProjects", userProjects);
		let projectId ="wDPzX80JYO";

		if (userProjects && userProjects.length === 0) {
			projectId = userProjects[0].id;
		}

		if (!projectId) {
			return NextResponse.json(
				{ error: "No project found for user" },
				{ status: 404 }
			);
		}

		const response = await client.post("functions/send_password_reset", { email, project_id: projectId });

		if (!response.data.result) {
			return NextResponse.json(
				{ error: "Failed to send password reset" },
				{ status: 500 }
			);
		}

		return NextResponse.json(response.data.result);
	}  catch (error: any) {
		console.error("GET Error:", error.message);
		return NextResponse.json(
			{ error: error.message, details: error.response?.data },
			{ status: error.response?.status || 500 }
		);
	}
}
