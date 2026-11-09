import "server-only";
import { NextRequest, NextResponse } from "next/server";
import {
	AccessContext,
	AccessError,
	getAccessContext,
	resolveRequestProjectId,
	toErrorResponseInit,
	withLegitimateUser
} from "./access";
import {
	assertMemberMayModify,
	assertMemberMayUseMasterKey,
	assertObjectId,
	assertProjectPointer,
	authorizeUserManagement,
	normalizeClassName,
	projectPointer,
	sanitizeMemberWrite,
	scopeWhere,
	stripSecretFields
} from "./policy";
import {
	enforceContentDelete,
	enforceContentWrite,
	prepareContentRead,
	stripReadResult
} from "./contentAccess";
import { parseRest } from "./sashido";

type ParseObject = Record<string, any>;

const errorResponse = (error: unknown) => {
	const { status, message } = toErrorResponseInit(error);
	if (status === 500) {
		console.error(
			"api/data error:",
			error instanceof Error ? error.message : error
		);
	}
	return NextResponse.json({ error: message }, { status });
};

const parseResponse = (
	context: AccessContext,
	status: number,
	data: ParseObject
) => {
	if (status >= 400) {
		return NextResponse.json(
			{
				error: data?.error || "Anfrage fehlgeschlagen",
				code: data?.code
			},
			{ status }
		);
	}
	return NextResponse.json(
		context.isSuperuser ? data : stripSecretFields(data)
	);
};

const parseClientWhere = (query: string | null): ParseObject | undefined => {
	if (!query) {
		return undefined;
	}
	try {
		const where = JSON.parse(`{${query}}`);
		if (!where || typeof where !== "object" || Array.isArray(where)) {
			throw new Error();
		}
		return where;
	} catch {
		throw new AccessError(400, "Ungültige Abfrage");
	}
};

const parseLimit = (limit: string | null) => {
	if (!limit) {
		return undefined;
	}
	const value = Number(limit);
	if (!Number.isInteger(value) || value < 0 || value > 10000) {
		throw new AccessError(400, "Ungültiges Limit");
	}
	return value;
};

// A client may only *request* the master key. Superusers get it unrestricted; project members only
// scoped to a project they belong to (see policy.ts).
export async function GET(request: NextRequest) {
	try {
		const context = await getAccessContext();
		const searchParams = request.nextUrl.searchParams;
		const className = normalizeClassName(searchParams.get("className"));
		const useMasterKey = searchParams.get("useMasterKey") === "true";
		let where = parseClientWhere(searchParams.get("query"));
		const limit = parseLimit(searchParams.get("limit"));
		let accessProjectId = context.activeProjectId;

		if (useMasterKey && !context.isSuperuser) {
			assertMemberMayUseMasterKey(className);
			accessProjectId = resolveRequestProjectId(
				context,
				searchParams.get("projectId") || undefined
			);
			const scope = scopeWhere(className, accessProjectId);
			where = where ? { $and: [where, scope] } : scope;
		}

		let contentAccess: Awaited<ReturnType<typeof prepareContentRead>>["access"] | undefined;
		if (!context.isSuperuser && accessProjectId) {
			const prepared = await prepareContentRead(
				accessProjectId,
				context.user.objectId,
				className,
				where
			);
			where = prepared.where;
			contentAccess = prepared.access;
		}

		const params = new URLSearchParams();
		if (where) {
			params.set("where", JSON.stringify(where));
		}
		if (limit !== undefined) {
			params.set("limit", String(limit));
		}
		const qs = params.toString();

		const { status, data } = await parseRest(
			qs ? `classes/${className}?${qs}` : `classes/${className}`,
			{ sessionToken: context.sessionToken, useMasterKey }
		);

		const visible =
			status < 400 && contentAccess
				? stripReadResult(data, contentAccess.roles, contentAccess.modules, className)
				: data;

		return parseResponse(context, status, visible);
	} catch (error) {
		return errorResponse(error);
	}
}

const prepareWrite = async ({
	context,
	className,
	body,
	isCreate
}: {
	context: AccessContext;
	className: string;
	body: ParseObject;
	isCreate: boolean;
}) => {
	const useMasterKey = body.useMasterKey === true;
	let data: ParseObject = { ...(body.updateObject || {}) };
	let projectId: string | undefined;

	if (body.projectId) {
		projectId = resolveRequestProjectId(
			context,
			assertObjectId(body.projectId)
		);
		data.project = projectPointer(projectId);
	}

	const authorId = body.userId
		? assertObjectId(body.userId)
		: context.user.objectId;
	data[isCreate ? "created_by" : "updated_by"] = {
		__type: "Pointer",
		className: "_User",
		objectId: authorId
	};

	assertProjectPointer(context, data);

	if (useMasterKey && !context.isSuperuser) {
		assertMemberMayUseMasterKey(className);
		projectId = resolveRequestProjectId(context, projectId);
		const objectId = isCreate ? undefined : assertObjectId(body.objectId);
		const isAdmin = await authorizeUserManagement(context, {
			className,
			operation: isCreate ? "create" : "update",
			objectId,
			projectId
		});
		if (objectId) {
			await assertMemberMayModify(className, objectId, projectId);
		}
		data = await sanitizeMemberWrite({
			className,
			updateObject: data,
			projectId,
			isCreate,
			isAdmin
		});
	}

	if (!context.isSuperuser) {
		const accessProjectId = projectId || context.activeProjectId;
		if (accessProjectId) {
			data = await enforceContentWrite({
				projectId: accessProjectId,
				userId: context.user.objectId,
				className,
				data,
				isCreate,
				objectId: isCreate ? undefined : assertObjectId(body.objectId)
			});
		}
	}

	return { data, useMasterKey };
};

const batchUpdate = async (body: ParseObject) => {
	const updates = body.updates as ParseObject[];
	const results = await withLegitimateUser(
		updates.map((update) => async (context) => {
			const objectId = String(update.objectId || "");
			try {
				const className = normalizeClassName(update.className);
				const id = assertObjectId(update.objectId);
				const { data, useMasterKey } = await prepareWrite({
					context,
					className,
					body: {
						updateObject: update.updateObject,
						objectId: id,
						projectId: update.projectId ?? body.projectId,
						useMasterKey: update.useMasterKey ?? body.useMasterKey,
						userId: body.userId
					},
					isCreate: false
				});
				const { status, data: result } = await parseRest(
					`classes/${className}/${id}`,
					{
						method: "PUT",
						body: data,
						sessionToken: context.sessionToken,
						useMasterKey
					}
				);
				if (status >= 400) {
					return {
						objectId: id,
						error: result?.error || "Aktualisieren fehlgeschlagen"
					};
				}
				return { objectId: id };
			} catch (error) {
				return {
					objectId,
					error:
						error instanceof Error
							? error.message
							: "Aktualisieren fehlgeschlagen"
				};
			}
		}),
		2000
	);
	return NextResponse.json({ results });
};

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		if (Array.isArray(body.updates)) {
			return batchUpdate(body);
		}
		const context = await getAccessContext();
		const className = normalizeClassName(body.className);
		const { data, useMasterKey } = await prepareWrite({
			context,
			className,
			body,
			isCreate: true
		});

		const { status, data: result } = await parseRest(
			`classes/${className}`,
			{
				method: "POST",
				body: data,
				sessionToken: context.sessionToken,
				useMasterKey
			}
		);

		return parseResponse(context, status, result);
	} catch (error) {
		return errorResponse(error);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const context = await getAccessContext();
		const body = await request.json();
		const className = normalizeClassName(body.className);
		const objectId = assertObjectId(body.objectId);
		const { data, useMasterKey } = await prepareWrite({
			context,
			className,
			body,
			isCreate: false
		});

		const { status, data: result } = await parseRest(
			`classes/${className}/${objectId}`,
			{
				method: "PUT",
				body: data,
				sessionToken: context.sessionToken,
				useMasterKey
			}
		);

		return parseResponse(context, status, result);
	} catch (error) {
		return errorResponse(error);
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const context = await getAccessContext();
		const searchParams = request.nextUrl.searchParams;
		const className = normalizeClassName(searchParams.get("className"));
		const objectId = assertObjectId(searchParams.get("objectId"));
		const useMasterKey = searchParams.get("useMasterKey") === "true";
		const accessProjectId =
			useMasterKey && !context.isSuperuser
				? resolveRequestProjectId(
						context,
						searchParams.get("projectId") || undefined
					)
				: context.activeProjectId;

		if (useMasterKey && !context.isSuperuser && accessProjectId) {
			assertMemberMayUseMasterKey(className);
			await authorizeUserManagement(context, {
				className,
				operation: "delete",
				objectId,
				projectId: accessProjectId
			});
			await assertMemberMayModify(className, objectId, accessProjectId);
		}

		if (!context.isSuperuser && accessProjectId) {
			await enforceContentDelete(
				accessProjectId,
				context.user.objectId,
				className,
				objectId
			);
		}

		const { status, data } = await parseRest(
			`classes/${className}/${objectId}`,
			{
				method: "DELETE",
				sessionToken: context.sessionToken,
				useMasterKey
			}
		);

		return parseResponse(context, status, data);
	} catch (error) {
		return errorResponse(error);
	}
}
