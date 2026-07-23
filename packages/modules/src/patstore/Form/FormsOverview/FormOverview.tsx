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
import initial_data from "./constants/initial_data";

const FormsOverview = ({ module }: { module: Module }) => {
	const [filters] = useState<Filter[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const [order, setOrder] = useState<string>("createdAt_DESC");
	const {
		data,
		refetch,
		count,
		loading: dataLoading
	} = useFindModuleData<FormClass>({
		module,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order
	});

	const columns = useCreateColumns<FormClass>({
		data: generateColumnsFromFields(module.fields),
		fields: module.data_fields,
		className: "Form",
		editLink: "forms",
		refetch,
		categories: module.categories
	});

	return (
		<Page
			title={module.name}
			emptyContent={true}
			createClass={{
				className: "Form",
				text: "Neues Formular erstellen",
				fields: module.fields,
				refetch: refetch,
				initialData: initial_data
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

export default FormsOverview;
