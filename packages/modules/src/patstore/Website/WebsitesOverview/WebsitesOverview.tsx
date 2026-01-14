"use client";

import { useContext } from "react";
import { PatstoreAppContext, useFindData } from "@repo/provider";
import { Page, Table, useCreateColumns } from "@repo/ui";
import { WebpageClass } from "@repo/types";
import createClass from "./constants/createWebpageClass";

const WebsitesOverview = () => {
	const { currentModule, user } = useContext(PatstoreAppContext);

	const { data, refetch } = useFindData({
		objectName: "Webpage",
		fields: [
			"objectId",
			"path",
			"title",
			"updated_by { objectId label portrait { name url } }",
			"created_by { objectId label portrait { name url } }",
			"createdAt"
		],
		moduleId: currentModule.objectId
	});

	const columns = useCreateColumns<WebpageClass>({
		data: [
			{ id: "title", type: "string", label: "Titel" },
			{ id: "path", type: "string", label: "Pfad" },
			{
				id: "created_by",
				type: "created_by",
				label: "Erstellt von"
			},
			{
				id: "updated_by",
				type: "updated_by",
				label: "Aktualisiert von"
			},
			{
				id: "createdAt",
				type: "date",
				label: "Erstellt am"
			}
		],
		fields: currentModule.data_fields,
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
			createClass={createClass}
			refetch={refetch}
		>
			{user && <Table data={data ?? []} columns={columns} />}
		</Page>
	);
};

export default WebsitesOverview;
