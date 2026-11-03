import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { DocumentNode, Kind, parse, visit } from "graphql";
import {
	AccessError,
	getAccessContext,
	OBJECT_ID_PATTERN,
	resolveRequestProjectId,
	toErrorResponseInit
} from "./access";
import { fetchObjectWithMasterKey, projectIdsOf, SECRET_FIELDS } from "./policy";
import { createParseHeaders, getSashidoConfig } from "./sashido";

type Variables = Record<string, any>;

const graphqlError = (status: number, message: string) =>
	NextResponse.json(
		{ errors: [{ message, extensions: { code: status === 401 ? "UNAUTHENTICATED" : "FORBIDDEN" } }] },
		{ status }
	);

const decodeObjectId = (id: unknown): string => {
	if (typeof id === "string" && OBJECT_ID_PATTERN.test(id)) {
		return id;
	}
	if (typeof id === "string") {
		const [, objectId] = Buffer.from(id, "base64").toString("utf8").split(":");
		if (objectId && OBJECT_ID_PATTERN.test(objectId)) {
			return objectId;
		}
	}
	throw new AccessError(400, "Ungültige ID");
};

const getArgument = (
	field: { arguments?: readonly any[] },
	name: string,
	variables: Variables
) => {
	const argument = field.arguments?.find((arg) => arg.name.value === name);
	if (!argument) {
		return { variableName: undefined, value: undefined };
	}
	if (argument.value.kind === Kind.VARIABLE) {
		const variableName = argument.value.name.value as string;
		return { variableName, value: variables[variableName] };
	}
	if (argument.value.kind === Kind.STRING) {
		return { variableName: undefined, value: argument.value.value as string };
	}
	throw new AccessError(403, "Abfrage nicht erlaubt");
};

// Project members may use the master key only for read-only queries on users of their project.
const authorizeMemberMasterQuery = async (
	document: DocumentNode,
	variables: Variables,
	projectId: string
): Promise<Variables> => {
	const scopedVariables: Variables = { ...variables };

	visit(document, {
		Field(node) {
			if (SECRET_FIELDS.includes(node.name.value)) {
				throw new AccessError(403, "Abfrage nicht erlaubt");
			}
		}
	});

	for (const definition of document.definitions) {
		if (definition.kind === Kind.FRAGMENT_DEFINITION) {
			continue;
		}
		if (
			definition.kind !== Kind.OPERATION_DEFINITION ||
			definition.operation !== "query"
		) {
			throw new AccessError(403, "Abfrage nicht erlaubt");
		}

		for (const selection of definition.selectionSet.selections) {
			if (selection.kind !== Kind.FIELD) {
				throw new AccessError(403, "Abfrage nicht erlaubt");
			}
			const fieldName = selection.name.value;

			if (fieldName === "__typename") {
				continue;
			}

			if (fieldName === "users") {
				const { variableName, value } = getArgument(selection, "where", variables);
				if (!variableName) {
					throw new AccessError(403, "Abfrage nicht erlaubt");
				}
				const projectScope = { projects: { in: [projectId] } };
				scopedVariables[variableName] = value
					? { AND: [value, projectScope] }
					: projectScope;
				continue;
			}

			if (fieldName === "user") {
				const { value } = getArgument(selection, "id", variables);
				const target = await fetchObjectWithMasterKey("_User", decodeObjectId(value));
				if (!projectIdsOf("_User", target).includes(projectId)) {
					throw new AccessError(403, "Kein Zugriff auf diesen Nutzer");
				}
				continue;
			}

			throw new AccessError(403, "Abfrage nicht erlaubt");
		}
	}

	return scopedVariables;
};

export async function POST(request: NextRequest) {
	try {
		const context = await getAccessContext();
		const body = await request.json();
		const { query, operationName } = body;
		let variables: Variables = body.variables || {};

		if (typeof query !== "string" || !query) {
			return graphqlError(400, "GraphQL query is required");
		}

		const useMasterKey =
			body.useMasterKey === true ||
			request.headers.get("x-use-master-key") === "true";

		if (useMasterKey && !context.isSuperuser) {
			let document: DocumentNode;
			try {
				document = parse(query);
			} catch {
				return graphqlError(400, "Ungültige GraphQL Abfrage");
			}
			const projectId = resolveRequestProjectId(context);
			variables = await authorizeMemberMasterQuery(document, variables, projectId);
		}

		const { gqlUrl } = getSashidoConfig();
		if (!gqlUrl) {
			return graphqlError(500, "SASHIDO_GQL_URL environment variable is not configured");
		}

		const response = await fetch(gqlUrl, {
			method: "POST",
			headers: createParseHeaders({
				sessionToken: context.sessionToken,
				useMasterKey
			}),
			body: JSON.stringify({ query, variables, operationName }),
			cache: "no-store"
		});

		const data = await response.json();

		return NextResponse.json(data, { status: data.errors ? 200 : response.status });
	} catch (error) {
		const { status, message } = toErrorResponseInit(error);
		if (status === 500) {
			console.error("api/graphql error:", error instanceof Error ? error.message : error);
		}
		return graphqlError(status, message);
	}
}
