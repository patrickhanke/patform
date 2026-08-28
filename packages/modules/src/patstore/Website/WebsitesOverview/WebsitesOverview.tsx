"use client";

import { useContext, useState } from "react";
import { PatstoreAppContext, useFindData } from "@repo/provider";
import { Page, Table, useCreateColumns } from "@repo/ui";
import { LanguageValue, Module, WebpageClass } from "@repo/types";
import createClass from "./constants/createWebpageClass";

const WebsitesOverview = ({ module }: { module: Module }) => {
	const { user } = useContext(PatstoreAppContext);
	const [language, setLanguage] = useState<LanguageValue>(
		module.settings?.language as LanguageValue
	);

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

		order: "path_DESC",
		moduleId: module.objectId
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

	console.log("createClass", createClass);

	return (
		<Page
			title={`${module.name} - Seiten`}
			description="Übersicht über alle Seiten"
			createClass={createClass}
			refetch={refetch}
		>
			{user && (
				<Table
					data={data ?? []}
					columns={columns}
					language={language}
					languages={module.settings?.languages || []}
					changeLanguage={setLanguage}
				/>
			)}
		</Page>
	);
};

export default WebsitesOverview;
