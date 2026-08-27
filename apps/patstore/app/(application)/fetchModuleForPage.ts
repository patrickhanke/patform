import { cacheLife } from "next/cache";
import { fetchModuleByPath, resolveActiveProjectId } from "@repo/provider";
import { Module } from "@repo/types";

// Cached module lookup for overview pages. Must live in the app directory —
// "use cache" / cacheLife cannot be exported from @repo/provider because
// client components also import that package.
export async function fetchModuleForPage({
	sessionToken,
	cookieProjectId,
	path
}: {
	sessionToken?: string;
	cookieProjectId?: string;
	path: string;
}): Promise<{ module?: Module, projectId?: string }> {
	"use cache";
	cacheLife("hours");

	const projectId = await resolveActiveProjectId({
		sessionToken,
		cookieProjectId
	});

	const module = await fetchModuleByPath({
		projectId,
		path,
		sessionToken
	});

	if (!module || !projectId) {
		return { module: undefined, projectId: undefined };
	}

	return { module, projectId };
}
