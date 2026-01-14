"use client";

import {
	generateColumnsFromFields,
	Page,
	Table,
	useCreateColumns
} from "@repo/ui";
import { useContext, useState } from "react";
import { Filter, FormClass } from "@repo/types";
import { PatstoreAppContext, useFindData } from "@repo/provider";

const EmailsOverview = () => {
	const { currentModule } = useContext(PatstoreAppContext);
	const [filters] = useState<Filter[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});

	console.log({ currentModule });
	const [order, setOrder] = useState<string>("createdAt_DESC");
	const { data, refetch, count } = useFindData({
		objectName: "Template",
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order,
		fields: ["title", "description", "createdAt"]
	});

	const columns = useCreateColumns<FormClass>({
		data: generateColumnsFromFields(currentModule.fields),
		fields: currentModule.data_fields,
		className: "Form",
		editLink: "Emails",
		refetch,
		categories: currentModule?.categories
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
						label: "Titel"
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

export default EmailsOverview;
