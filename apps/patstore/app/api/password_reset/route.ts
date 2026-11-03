import { NextRequest, NextResponse } from "next/server";
import { parseRest } from "@repo/provider/server";

export async function POST(request: NextRequest) {
	const body = await request.json();
	const { email } = body;

	try {
		const getUserProjects = await parseRest<{ result?: { id: string }[] }>(
			"functions/get_user_projects_with_lettermint_key",
			{ method: "POST", body: { email }, useMasterKey: true }
		);

		const userProjects = getUserProjects.data.result;
		if (!userProjects) {
			return NextResponse.json(
				{ error: "No projects found for user" },
				{ status: 404 }
			);
		}
		let projectId ="HC0trnizvl";

		if (userProjects && userProjects.length === 0) {
			projectId = userProjects[0].id;
		}

		if (!projectId) {
			return NextResponse.json(
				{ error: "No project found for user" },
				{ status: 404 }
			);
		}

		const response = await parseRest<{ result?: unknown }>(
			"functions/send_password_reset",
			{ method: "POST", body: { email, project_id: projectId }, useMasterKey: true }
		);

		if (!response.data.result) {
			return NextResponse.json(
				{ error: "Failed to send password reset" },
				{ status: 500 }
			);
		}

		return NextResponse.json(response.data.result);
	}  catch (error: any) {
		console.error("password_reset error:", error.message);
		return NextResponse.json(
			{ error: "Failed to send password reset" },
			{ status: 500 }
		);
	}
}
