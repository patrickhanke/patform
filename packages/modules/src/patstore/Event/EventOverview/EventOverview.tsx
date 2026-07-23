"use client";

import { useState } from "react";
import {
	generateColumnsFromFields,
	Page,
	Table,
	useCreateColumns
} from "@repo/ui";
import { EventClass, Filter, Module } from "@repo/types";
import {
	filterModuleCategories,
	useFindCategoryPageStates,
	useFindModuleData
} from "@repo/provider";

const EventOverview = ({ module }: { module: Module }) => {
	const [filters, setFilters] = useState<Filter[]>([]);
	const { pageStates, setActivePage, activePage } = useFindCategoryPageStates(
		{
			categories:
				filterModuleCategories(module.categories).categoryIds || [],
			categoryModuleId: filterModuleCategories(module.categories)
				.categoryModuleId,
			filters,
			setFilters
		}
	);

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const [selectedRows, setSelectedRows] = useState<string[]>([]);

	const [order, setOrder] = useState<string>("createdAt_DESC");
	const { data, refetch, count, loading: dataLoading } = useFindModuleData<EventClass>({
		module,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order
	});

	const columns = useCreateColumns<EventClass>({
		data: generateColumnsFromFields(module.fields),
		fields: module.data_fields,
		className: "Event",
		refetch,
		categories: module.categories
	});

	return (
		<Page
			title={module.name}
			emptyContent={true}
			createClass={{
				className: "Event",
				text: "Neue Veranstaltung erstellen",
				fields: module.fields,
				refetch: refetch
			}}
			refetch={refetch}
			pageStates={pageStates}
			setPageState={setActivePage}
			pageState={activePage}
		>
			<Table
				columns={columns}
				data={data || []}
				loading={dataLoading}
				rowCount={count}
				pagination={pagination}
				setPagination={setPagination}
				enableRowSelection
				selectedRows={selectedRows}
				setSelectedRows={setSelectedRows}
				filters={filters}
				setFilters={setFilters}
				filterColumns={module.filters}
				setOrder={setOrder}
			/>
		</Page>
	);
};

export default EventOverview;
