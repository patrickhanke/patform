"use client";

import { useContext, useMemo, useState } from "react";
import {
	createClassData,
	generateColumnsFromFields,
	Page,
	RenderFilters,
	Table,
	useCreateColumns
} from "@repo/ui";
import { EventClass, Filter } from "@repo/types";
import { PatstoreAppContext, useFindModuleData } from "@repo/provider";

const EventOverview = () => {
	const { currentModule } = useContext(PatstoreAppContext);
	const [filters, setFilters] = useState<Filter[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const [selectedRows, setSelectedRows] = useState<string[]>([]);

	const [order, setOrder] = useState<string>("createdAt_DESC");
	const { data, refetch, count } = useFindModuleData<EventClass>({
		module: currentModule,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order
	});

	const columns = useCreateColumns<EventClass>({
		data: generateColumnsFromFields(currentModule.fields),
		fields: currentModule.data_fields,
		className: "Event",
		refetch,
		categories: currentModule?.categories
	});

	const renderFilters = useMemo(() => {
		return (
			<RenderFilters
				filters={filters}
				setFilters={setFilters}
				fields={[
					{
						type: "input",
						key: "title",
						operator: "_regex",
						value: "",
						placeholder: "Suchwort"
					}
				]}
				categories={[]}
				initialFilters={[]}
			/>
		);
	}, []);

	return (
		<Page
			title={currentModule.name}
			emptyContent={true}
			createClass={createClassData({
				className: "Event",
				text: "Neue Veranstaltung erstellen",
				fields: currentModule.fields
			})}
			refetch={refetch}
		>
			<Table
				columns={columns}
				data={data || []}
				rowCount={count}
				pagination={pagination}
				setPagination={setPagination}
				enableRowSelection
				selectedRows={selectedRows}
				setSelectedRows={setSelectedRows}
				filterContent={renderFilters}
				setOrder={setOrder}
			/>
		</Page>
	);
};

export default EventOverview;
