"use client";

import { useFindData } from "@repo/provider";
import { Page, Table, useCreateColumns, usePageData } from "@repo/ui";
import { ModuleOverviewProps, WebpageClass } from "@repo/types";
import createClass from "./constants/createWebpageClass";

const WebsitesOverview = ({
	module,
	languages
}: ModuleOverviewProps<"/website">) => {
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
		order: "path_ASC",
		moduleId: module.objectId
	});

	console.log(module.objectId);

	const columns = useCreateColumns<WebpageClass>({
		data: [
			{ id: "path", type: "string", label: "Pfad" },
			{ id: "title", type: "string", label: "Titel" },
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
		fields: module.data_fields,
		className: "Webpage",
		refetch,
		categories: module.categories,
		editLink: "website/pages",
		initialData: data ?? []
	});
	const { data: pageRows } = usePageData<WebpageClass[]>();

	return (
		<Page
			title={`${module.name} - Seiten`}
			description="Übersicht über alle Seiten"
			createClass={{
				...createClass,
				languages,
				initialState: "published"
			}}
			refetch={refetch}
		>
			<Table data={pageRows ?? data ?? []} columns={columns} />
		</Page>
	);
};

export default WebsitesOverview;
