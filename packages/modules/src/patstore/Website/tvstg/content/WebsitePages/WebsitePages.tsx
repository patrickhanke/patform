import { generateGraphQLQuery } from "@repo/provider";
import { useQuery } from "@apollo/client";
import { WebsitePagesProps } from "./types";
import { Table, useCreateColumns } from "@repo/ui";
import { WebpageClass } from "@repo/types";
import column_constants from "./constants/column_constants";
import { useEffect } from "react";

const WebsitePages = ({
	moduleId,
	categories,
	refetchTrigger
}: WebsitePagesProps) => {
	const { data: pageData, refetch } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Webpage",
			fields: [
				"title",
				"objectId",
				"name",
				"title",
				"subtitle",
				"type",
				"categories",
				"content"
			]
		}),
		{ variables: { params: { module: { _eq: moduleId } } } }
	);

	const columns = useCreateColumns<WebpageClass>({
		data: [
			{ id: "name", type: "edit_string", label: "Name" },
			{ id: "title", type: "edit_string", label: "Titel" },
			{ id: "subtitle", type: "edit_textfield", label: "Untertitel" },
			{ id: "content", type: "edit_content", label: "Inhalte" },
			{
				id: "type",
				type: "edit_state",
				label: "Typ"
			}
		],
		fields: undefined,
		className: "Webpage",
		constants: column_constants,
		refetch,
		categories: categories || [],
		disableCategory(row, label) {
			console.log({ row, label });

			if (row.type === "webpage") {
				return true;
			}
			if (row.type === "sport_page" && label == "Sportarten") {
				return false;
			}
			if (row.type === "training_page" && label == "Trainingsgruppen") {
				return false;
			}
			return true;
		}
	});

	useEffect(() => {
		if (refetchTrigger) {
			refetch();
		}
	}, [refetchTrigger, refetch]);

	if (pageData) {
		const pages = pageData?.objects.findWebpage.results;

		return <Table data={pages} columns={columns} />;
	}

	return null;
};

export default WebsitePages;
