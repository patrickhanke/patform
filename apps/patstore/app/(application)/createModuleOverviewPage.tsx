import { Suspense, type ComponentType } from "react";
import { cookies } from "next/headers";
import { fetchModuleForPage } from "./fetchModuleForPage";
import { PageSkeleton } from "@repo/ui";
import { Module } from "@repo/types";

type ModuleOverviewPageOptions = {
	modulePath: string;
	fallbackTitle: string;
	Overview: ComponentType<{ module: Module, projectId: string }>;
	pageHeaderButtons?: number;
};

export function createModuleOverviewPage({
	modulePath,
	fallbackTitle,
	Overview,
	pageHeaderButtons = 2
}: ModuleOverviewPageOptions) {
	async function ModuleOverviewContent() {
		const cookieStore = await cookies();
		const sessionToken = cookieStore.get("patstore_token")?.value;
		const cookieProjectId = cookieStore.get(
			`${process.env.APP_NAME}_project_id`
		)?.value;

		const { module, projectId } = await fetchModuleForPage({
			sessionToken,
			cookieProjectId,
			path: modulePath
		});

		if (!module || !projectId) {
			return <PageSkeleton title={fallbackTitle} />;
		}

		return <Overview module={module} projectId={projectId} />;
	}

	return function ModuleOverviewPage() {
		return (
			<Suspense
				fallback={<PageSkeleton pageHeaderButtons={pageHeaderButtons} />}
			>
				<ModuleOverviewContent />
			</Suspense>
		);
	};
}
