import { Suspense } from "react";
// import { cookies } from "next/headers";
// import { fetchFormById, fetchWebpageById } from "@repo/provider";
import { PageSkeleton } from "@repo/ui";
import {WebsitePage} from "@repo/modules";

async function WebsitePageContent({
	params
}: {
	params: Promise<{ webpage_id: string }>;
}) {
	const { webpage_id } = await params;
	// const cookieStore = await cookies();
	// const sessionToken = cookieStore.get("patstore_token")?.value;

	// const webpage = await fetchWebpageById({ id: webpage_id, sessionToken });

	// if (!webpage) {
	// 	return <p>Seite nicht gefunden</p>;
	// }

	return <WebsitePage websiteId={webpage_id} />;
}

export default function WebsitePageRender({
	params
}: {
	params: Promise<{ webpage_id: string }>;
}) {
	return (
		<Suspense fallback={<PageSkeleton pageStates={3} />}>
			<WebsitePageContent params={params} />
		</Suspense>
	);
}
