"use client";

import {
	generateColumnsFromFields,
	Page,
	Table,
	useCreateColumns
} from "@repo/ui";
import { useContext, useState } from "react";
import { Filter, FormClass } from "@repo/types";
import { PatstoreAppContext, useFindModuleData } from "@repo/provider";
import initial_data from "./constants/initial_data";

const FormsOverview = () => {
	const { currentModule } = useContext(PatstoreAppContext);
	const [filters] = useState<Filter[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const [order, setOrder] = useState<string>("createdAt_DESC");
	const { data, refetch, count } = useFindModuleData<FormClass>({
		module: currentModule,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order
	});

	const columns = useCreateColumns<FormClass>({
		data: generateColumnsFromFields(currentModule.fields),
		fields: currentModule.data_fields,
		className: "Form",
		editLink: "forms",
		refetch,
		categories: currentModule?.categories
	});

	return (
		<Page
			title={currentModule.name}
			emptyContent={true}
			createClass={{
				className: "Form",
				text: "Neues Formular erstellen",
				fields: currentModule.fields,
				refetch: refetch,
				initialData: initial_data
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

export default FormsOverview;
