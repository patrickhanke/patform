"use client";

import { useFindData } from "@repo/provider";
import { Page, Table, useCreateColumns } from "@repo/ui";
import { ModuleOverviewProps, WebpageClass } from "@repo/types";
import createClass from "./constants/createWebpageClass";

const WebsitesOverview = ({
	module,
	languages,
	defaultLanguage
}: ModuleOverviewProps<"/website">) => {
	const { data, refetch, language, changeLanguage } = useFindData({
		objectName: "Webpage",
		fields: [
			"objectId",
			"path",
			"title",
			"updated_by { objectId label portrait { name url } }",
			"created_by { objectId label portrait { name url } }",
			"createdAt"
		],
		order: "path_DESC",
		moduleId: module.objectId,
		defaultLanguage
	});

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
		editLink: "website/pages"
	});

	return (
		<Page
			title={`${module.name} - Seiten`}
			description="Übersicht über alle Seiten"
			createClass={{ ...createClass, languages }}
			refetch={refetch}
		>
			<Table
				data={data ?? []}
				columns={columns}
				language={language}
				languages={languages}
				changeLanguage={changeLanguage}
			/>
		</Page>
	);
};

export default WebsitesOverview;
