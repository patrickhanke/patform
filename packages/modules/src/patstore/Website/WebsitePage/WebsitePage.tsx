"use client";

import { PageState } from "@repo/types";
import { Page } from "@repo/ui";
import { useState } from "react";
import { WebpageSettings, WebpageContent } from "./content";
import page_states from "./constants/page_states";

const WebsitePage = ({
	websiteId,
	title
}: {
	websiteId: string;
	title: string;
}) => {
	const [pageState, setPageState] = useState<PageState>(
		page_states[0] as PageState
	);

	return (
		<Page
			title={`${title} - Inhalte`}
			description="Bearbeitung der Inhalte der Webseite"
			pageHeaderButtons={[]}
			pageStates={[...page_states]}
			pageState={pageState}
			setPageState={setPageState}
		>
			{pageState.value === "settings" && (
				<WebpageSettings websiteId={websiteId} />
			)}
			{pageState.value === "content" && (
				<WebpageContent websiteId={websiteId} />
			)}
		</Page>
	);
};

export default WebsitePage;
