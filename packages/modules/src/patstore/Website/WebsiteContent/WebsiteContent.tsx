"use client";

import { Page, PageHeaderButton } from "@repo/ui";
import { useContext, useMemo } from "react";

import { useQuery } from "@apollo/client";
import { ContentElement } from "./content/ContentElement";
import { ContentClass } from "@repo/types";
import {
	generateGraphQLQuery,
	PatstoreAppContext,
	useDataHandler
} from "@repo/provider";

const WebsiteContent = () => {
	const { currentModule, user } = useContext(PatstoreAppContext);
	const { deleteData, createData } = useDataHandler();

	const { data: contentData, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Content",
			fields: ["objectId", "name"]
		}),
		{
			variables: {
				params: { module: { _eq: currentModule.objectId } }
			}
		}
	);

	const pageHeaderButtons: PageHeaderButton[] = useMemo(
		() => [
			{
				text: "SeitenElement hinzufügen",
				onClick: async () => {
					await createData({
						className: "Webpage",
						updateObject: {
							title: "Neue Seite",
							name: "new-site",
							module: {
								__type: "Pointer",
								className: "Module",
								objectId: currentModule.objectId
							},
							content: [],
							categories: [],
							created_by: {
								__type: "Pointer",
								className: "_User",
								objectId: user?.objectId
							}
						},
						feedback: "Seite erfolgreich erstellt"
					});
					await refetch();
				},
				icon: "add",
				is_add_button: true,
				disabled: !user?.is_superuser
			}
		],
		[user]
	);

	return (
		<Page
			title={`${currentModule.name} - Inhalte`}
			description="Übersicht über alle Seiten"
			emptyContent={true}
			pageHeaderButtons={user?.is_superuser ? pageHeaderButtons : []}
		>
			{contentData &&
				contentData.objects.findContent.results.map((content: ContentClass) => (
					<ContentElement content={content} />
				))}
		</Page>
	);
};

export default WebsiteContent;
