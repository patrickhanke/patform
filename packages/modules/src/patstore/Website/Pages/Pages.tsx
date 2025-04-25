"use client";

import { useContext, useMemo, useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
	PatstoreAppContext,
	generateGraphQLQuery,
	useDataHandler
} from "@repo/provider";
import { Modal, Page, PageHeaderButton } from "@repo/ui";
import { PageState, WebpageClass } from "@repo/types";
import { WebsitePage } from "./content/Page";

const Pages = () => {
	const { deleteData, createData } = useDataHandler();
	const { currentModule, user } = useContext(PatstoreAppContext);
	const [pageState, setPageState] = useState<PageState>();
	const [deleteModal, setDeleteModal] = useState(false);

	const { data: pageData, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Webpage",
			fields: ["objectId", "name", "title"]
		}),
		{ variables: { params: { module: { _eq: currentModule.objectId } } } }
	);

	const pageStates = useMemo(() => {
		if (!pageData) return [];
		const pages = pageData.objects.findWebpage.results;
		return pages.map((page: WebpageClass) => ({
			label: page.title,
			value: page.objectId
		}));
	}, [pageData]);

	useEffect(() => {
		if (pageStates.length > 0) {
			setPageState(pageStates[0]);
		}
	}
	, [pageStates]);

	const pageHeaderButtons: PageHeaderButton[] = useMemo(
		() => [
			{
				text: "Seite löschen",
				onClick: () => {
					setDeleteModal(true);
				},
				disabled: pageState === undefined || !user?.is_superuser
			},
			{
				text: "Seite hinzufügen",
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
		[pageState, user]
	);

	return (
		<Page
			title={`${currentModule.name} - Seiten`}
			description="Übersicht über alle Seiten"
			// pageHeaderContent={}
			emptyContent={true}
			pageStates={pageStates}
			pageState={pageState || pageStates[0]}
			setPageState={setPageState}
			pageHeaderButtons={pageHeaderButtons}
		>
			{user && pageState && (
				<WebsitePage websiteId={pageState.value} user={user} />
			)}
			<Modal
				header="Seite löschen"
				isOpen={deleteModal}
				cancelButtonHandler={() => setDeleteModal(false)}
				confirmButtonHandler={async () => {
					if (!pageState) return;
					await deleteData({
						className: "Webpage",
						objectId: pageState.value
					});
					setDeleteModal(false);
					await refetch();
				}}
				confirmButtonText="Seite Löschen"
			>
				<p>
					Möchten Sie die Seite <strong>{pageState?.label}</strong>{" "}
					wirklich löschen?
				</p>
			</Modal>
		</Page>
	);
};

export default Pages;
