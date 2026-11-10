import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { triggerDeployWebhook } from "../general/data/server/triggerDeployWebhook";
import { toErrorResponseInit } from "./access";
import { CLASS_NAME_PATTERN } from "./policy";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json().catch(() => ({}));
		const objectClass = body?.objectClass;
		const projectId = body?.projectId;

		if (
			typeof objectClass !== "string" ||
			!CLASS_NAME_PATTERN.test(objectClass)
		) {
			return NextResponse.json(
				{ error: "Ungültige Klasse" },
				{ status: 400 }
			);
		}

		if (
			projectId !== undefined &&
			projectId !== null &&
			typeof projectId !== "string"
		) {
			return NextResponse.json(
				{ error: "Ungültige Projekt-ID" },
				{ status: 400 }
			);
		}

		await triggerDeployWebhook(
			objectClass,
			typeof projectId === "string" && projectId ? projectId : undefined
		);

		return NextResponse.json({ ok: true });
	} catch (error) {
		const { status, message } = toErrorResponseInit(error);
		if (status === 500) {
			console.error(
				"api/deploy-hook error:",
				error instanceof Error ? error.message : error
			);
		}
		return NextResponse.json({ error: message }, { status });
	}
}
