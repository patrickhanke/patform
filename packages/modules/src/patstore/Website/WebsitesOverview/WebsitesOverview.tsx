"use client";

import { useContext } from "react";
import { generateGraphQLQuery, PatstoreAppContext } from "@repo/provider";
import { useQuery } from "@apollo/client";
import { Page, Table, useCreateColumns } from "@repo/ui";
import { WebpageClass } from "@repo/types";

const WebsitesOverview = () => {
	const { currentModule, user } = useContext(PatstoreAppContext);

	const { data: pageData, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Webpage",
			fields: ["objectId", "name", "title"]
		}),
		{ variables: { params: { module: { _eq: currentModule.objectId } } } }
	);

	const columns = useCreateColumns<WebpageClass>({
		data: [{ id: "title", type: "string", label: "Titel" }],
		fields: currentModule.fields,
		className: "Webpage",
		refetch,
		categories: currentModule?.categories,
		editLink: "website/pages"
	});

	return (
		<Page
			title={`${currentModule.name} - Seiten`}
			description="Übersicht über alle Seiten"
			// pageHeaderButtons={pageHeaderButtons}
		>
			{user && (
				<Table
					data={pageData?.objects.findWebpage.results || []}
					columns={columns}
				/>
			)}
		</Page>
	);
};

export default WebsitesOverview;
