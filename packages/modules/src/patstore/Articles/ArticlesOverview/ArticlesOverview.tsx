"use client";

import { useState, useMemo } from "react";
import {
	generateColumnsFromFields,
	Modal,
	Page,
	Table,
	useCreateColumns
} from "@repo/ui";
import {
	filterModuleCategories,
	useDataHandler,
	useFindCategoryPageStates,
	useFindModuleData
} from "@repo/provider";

import { ArticleClass, Filter, Module } from "@repo/types";
import state from "./constants/articleState";

const ArticlesOverview = ({ module }: { module: Module }) => {
	const { deleteData } = useDataHandler();
	const [selectedRows, setSelectedRows] = useState<string[]>([]);
	const [filters, setFilters] = useState<Filter[]>([]);
	const { pageStates, setActivePage, activePage } = useFindCategoryPageStates(
		{
			categories:
				filterModuleCategories(module.categories || []).categoryIds || [],
			categoryModuleId: filterModuleCategories(module.categories || [])
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
	const { data, refetch, count, loading: dataLoading } = useFindModuleData<ArticleClass>({
		module,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order
	});

	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [loading, setLoading] = useState(false);

	const columns = useCreateColumns<ArticleClass>({
		data: generateColumnsFromFields(module.fields),
		fields: module.data_fields,
		className: "Article",
		refetch,
		categories: module.categories ?? [],
		constants: { state }
	});

	const pageHeaderButtons = useMemo(
		() => [
			{
				text: "Berichte löschen",
				onClick: () => {
					setDeleteModal(true);
				},
				icon: "delete",
				disabled: selectedRows.length === 0
			}
		],
		[selectedRows]
	);

	return (
		<Page
			title={module.name}
			emptyContent={true}
			pageHeaderButtons={pageHeaderButtons}
			createClass={{
				className: "Article",
				text: "Neuen Bericht erstellen",
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
				filterColumns={module.filters || []}
				setOrder={setOrder}
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
								className: "Article",
								objectId
							});
						})
					);
					await refetch();
					setSelectedRows([]);
					setLoading(false);
					setDeleteModal(false);
				}}
				header={"Berichte löschen"}
			>
				<p>
					Sind sich Sicher, dass sie {selectedRows.length} Berichte
					löschen möchten?
				</p>
			</Modal>
		</Page>
	);
};

export default ArticlesOverview;
