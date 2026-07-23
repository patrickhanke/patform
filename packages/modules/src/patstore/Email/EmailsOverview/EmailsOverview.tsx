"use client";

import {
	generateColumnsFromFields,
	Page,
	Table,
	useCreateColumns
} from "@repo/ui";
import { useState } from "react";
import { Filter, FormClass, Module } from "@repo/types";
import { useFindModuleData } from "@repo/provider";

const EmailsOverview = ({ module }: { module: Module }) => {
	const [filters] = useState<Filter[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const [order, setOrder] = useState<string>("createdAt_DESC");
	const { data, refetch, count, loading: dataLoading } = useFindModuleData<FormClass>({
		module,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order
	});

	const columns = useCreateColumns<FormClass>({
		data: generateColumnsFromFields(module.fields),
		fields: module.data_fields,
		className: "Email",
		editLink: "emails",
		refetch,
		categories: module.categories
	});

	return (
		<Page
			title={module.name}
			emptyContent={true}
			createClass={{
				className: "Email",
				text: "Neue E-Mail erstellen",
				fields: module.fields,
				refetch: refetch,
				initialData: {
					state: "draft",
					settings: {
						recipient_list: "",
						subject: ""
					}
				}
			}}
			refetch={refetch}
		>
			<Table
				columns={columns}
				data={data || []}
				loading={dataLoading}
				rowCount={count}
				pagination={pagination}
				setPagination={setPagination}
				setOrder={setOrder}
			/>
		</Page>
	);
};

export default EmailsOverview;
