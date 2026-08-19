import { Suspense } from "react";
import { cookies } from "next/headers";
// import { fetchFormById, fetchWebpageById } from "@repo/provider";
import { PageSkeleton } from "@repo/ui";
import {WebsiteComponent} from "@repo/modules";
import { fetchContentById } from "@repo/provider";

async function WebsiteComponentContent({
	params
}: {
	params: Promise<{ component_id: string }>;
}) {
	const { component_id } = await params;
	const cookieStore = await cookies();
	const sessionToken = cookieStore.get("patstore_token")?.value;

	const content = await fetchContentById({ id: component_id, sessionToken: sessionToken });

	if (!content) {
		return <p>Seite nicht gefunden</p>;
	}

	return <WebsiteComponent contentId={component_id} title={content.title} />;
}

export default function WebsiteComponentRender({
	params
}: {
	params: Promise<{ component_id: string }>;
}) {
	return (
		<Suspense fallback={<PageSkeleton pageStates={3} />}>
			<WebsiteComponentContent params={params} />
		</Suspense>
	);
}
