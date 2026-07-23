"use client";

import { useState, useMemo } from "react";
import {
	generateColumnsFromFields,
	Modal,
	Page,
	Table,
	useCreateColumns
} from "@repo/ui";
import { Filter, Module, NewsClass } from "@repo/types";
import {
	useDataHandler,
	useFindModuleData,
	filterModuleCategories,
	useFindCategoryPageStates
} from "@repo/provider";

const NewsOverview = ({ module }: { module: Module }) => {
	const { deleteData } = useDataHandler();
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
	const [order, setOrder] = useState<string>("createdAt_DESC");
	const {
		data,
		refetch,
		count,
		loading: dataLoading
	} = useFindModuleData<NewsClass>({
		module,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order
	});
	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [selectedRows, setSelectedRows] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const columns = useCreateColumns<NewsClass>({
		data: generateColumnsFromFields(module.fields),
		fields: module.data_fields,
		className: "Entry",
		refetch,
		categories: module.categories
	});

	const pageHeaderButtons = useMemo(
		() => [
			{
				text: `${selectedRows.length} ${module.name} löschen`,
				onClick: () => {
					setDeleteModal(true);
				},
				icon: "delete",
				disabled: selectedRows.length === 0
			}
		],
		[selectedRows, module.name]
	);

	return (
		<Page
			title={module.name}
			pageHeaderButtons={pageHeaderButtons}
			emptyContent={true}
			createClass={{
				className: "Entry",
				text: `Neue ${module.name} erstellen`,
				fields: module.fields,
				refetch: refetch
			}}
			pageStates={pageStates}
			setPageState={setActivePage}
			pageState={activePage}
			refetch={refetch}
		>
			<Table
				columns={columns}
				data={data || []}
				loading={dataLoading}
				setPagination={setPagination}
				pagination={pagination}
				rowCount={count}
				filterColumns={module.filters}
				filters={filters}
				setFilters={setFilters}
				selectedRows={selectedRows}
				setSelectedRows={setSelectedRows}
				setOrder={setOrder}
				enableRowSelection
			/>
			<Modal
				isOpen={deleteModal}
				cancelButtonHandler={() => setDeleteModal(false)}
				buttonDisabled={[loading, loading]}
				confirmButtonHandler={async () => {
					setLoading(true);
					await Promise.all(
						selectedRows.map(async (objectId) => {
							await deleteData({
								className: "Entry",
								objectId
							});
						})
					);
					await refetch();
					setLoading(false);
					setDeleteModal(false);
				}}
				header={"News löschen"}
			>
				<p>Sind sich Sicher, dass sie die News löschen möchten?</p>
			</Modal>
		</Page>
	);
};

export default NewsOverview;
