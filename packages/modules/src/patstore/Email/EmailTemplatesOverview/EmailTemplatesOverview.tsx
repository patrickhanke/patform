"use client";

import { Page, Table, useCreateColumns } from "@repo/ui";
import { useState } from "react";
import { Filter, Module, TemplateClass } from "@repo/types";
import { useFindData } from "@repo/provider";

const EmailTemplatesOverview = ({ module }: { module: Module }) => {
	const [filters] = useState<Filter[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});

	const [order, setOrder] = useState<string>("createdAt_DESC");
	const { data, refetch, count } = useFindData({
		objectName: "Template",
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order,
		fields: ["objectId", "title", "description", "createdAt"]
	});

	const columns = useCreateColumns<TemplateClass>({
		data: [
			{ id: "title", type: "string", label: "Titel" },
			{ id: "description", type: "textfield", label: "Beschreibung" },
			{ id: "createdAt", type: "date", label: "Erstellt am" }
		],
		fields: module.data_fields,
		className: "Template",
		editLink: `emails/templates`,
		refetch,
		categories: module.categories
	});

	return (
		<Page
			title={"Email Vorlagen"}
			emptyContent={true}
			createClass={{
				className: "Template",
				text: "Neue Email Vorlage erstellen",
				fields: [
					{
						id: "title",
						name: "title",
						type: "input",
						label: "Titel",
						required: true,
						active: true,
						default: true
					}
				],
				refetch: refetch,
				initialData: {
					title: "",
					type: "email"
				}
			}}
			refetch={refetch}
		>
			<Table
				columns={columns}
				data={data || []}
				rowCount={count}
				pagination={pagination}
				setPagination={setPagination}
				setOrder={setOrder}
			/>
		</Page>
	);
};

export default EmailTemplatesOverview;
