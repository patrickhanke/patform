"use client";

import { useContext, useState } from "react";
import {
	generateColumnsFromFields,
	Page,
	Table,
	useCreateColumns
} from "@repo/ui";
import { EventClass, Filter } from "@repo/types";
import {
	filterModuleCategories,
	PatstoreAppContext,
	useFindCategoryPageStates,
	useFindModuleData
} from "@repo/provider";

const EventOverview = () => {
	const { currentModule } = useContext(PatstoreAppContext);
	const [filters, setFilters] = useState<Filter[]>([]);
	const { pageStates, setActivePage, activePage } = useFindCategoryPageStates(
		{
			categories:
				filterModuleCategories(currentModule.categories).categoryIds ||
				[],
			categoryModuleId: filterModuleCategories(currentModule.categories)
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

	return (
		<Page
			title={currentModule.name}
			emptyContent={true}
			createClass={{
				className: "Event",
				text: "Neue Veranstaltung erstellen",
				fields: currentModule.fields,
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
				rowCount={count}
				pagination={pagination}
				setPagination={setPagination}
				enableRowSelection
				selectedRows={selectedRows}
				setSelectedRows={setSelectedRows}
				filters={filters}
				setFilters={setFilters}
				filterColumns={currentModule.filters}
				setOrder={setOrder}
			/>
		</Page>
	);
};

export default EventOverview;
