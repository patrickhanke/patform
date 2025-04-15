import { generateGraphQLQuery } from "@repo/provider";
import { useQuery } from "@apollo/client";
import { WebsitePagesProps } from "./types";
import { Table, useCreateColumns } from "@repo/ui";
import { WebpageClass } from "@repo/types";
import column_constants from "./constants/column_constants";

const WebsitePages = ({ moduleId }: WebsitePagesProps) => {
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
				"content"
			]
		}),
		{ variables: { params: { module: moduleId } } }
	);

	const columns = useCreateColumns<WebpageClass>({
		data: [
			{ id: "name", type: "edit_string", label: "Name" },
			{ id: "title", type: "edit_string", label: "Titel" },
			{ id: "subtitle", type: "edit_textfield", label: "Untertitel" },
			{ id: "content", type: "edit_content", label: "Inhalte" },
			{ id: "type", type: "edit_state", label: "Typ" }
		],
		fields: undefined,
		className: "Webpage",
		refetch,
		constants: column_constants,
		categories: []
	});

	if (pageData) {
		const pages = pageData?.objects.findWebpage.results;

		return <Table data={pages} columns={columns} />;
	}

	return null;
};

export default WebsitePages;
