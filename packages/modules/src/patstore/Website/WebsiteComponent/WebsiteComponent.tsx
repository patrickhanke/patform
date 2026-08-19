"use client";

import { PageState } from "@repo/types";
import { Loader, Page } from "@repo/ui";
import { useState } from "react";
import { ComponentSettings, ComponentContent } from "./content";
import page_states from "./constants/page_states";
import { useGetData } from "@repo/provider";

const WebsiteComponent = ({
	contentId,
	title
}: {
	contentId: string;
	title: string;
}) => {
	const [pageState, setPageState] = useState<PageState>(
		page_states[0] as PageState
	);

	const { data, refetch, loading } = useGetData({
		objectName: "Content",
		fields: ["objectId", "title", "type", "content_id", "active", "data"],
		id: contentId
	});

	if (loading) return <Loader width="100%" height="100%" />;

	return (
		<Page
			title={`${title}`}
			description="Bearbeitung des Inhalts"
			pageHeaderButtons={[]}
			pageStates={[...page_states]}
			pageState={pageState}
			setPageState={setPageState}
			refetch={refetch}
		>
			{!data ? (
				<p>Daten konnten nicht geladen werden.</p>
			) : (
				<>
					{pageState.value === "settings" && (
						<ComponentSettings
							objectId={data.objectId}
							contentId={data.content_id}
							title={data.title}
							active={data.active}
							type={data.type}
						/>
					)}
					{pageState.value === "content" && (
						<ComponentContent
							objectId={data.objectId}
							data={data.data}
							type={data.type}
						/>
					)}
				</>
			)}
		</Page>
	);
};

export default WebsiteComponent;
