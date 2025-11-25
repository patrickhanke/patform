"use client";

import { useContext, useState, useMemo } from "react";
import {
	generateColumnsFromFields,
	Modal,
	Page,
	RenderFilters,
	Table,
	useCreateColumns
} from "@repo/ui";
import {
	PatstoreAppContext,
	useDataHandler,
	useFindCategoryPageStates,
	useFindModuleData,
	filterModuleCategories
} from "@repo/provider";
import { DownloadClass, Filter } from "@repo/types";

const DownloadsOverview = () => {
	const { deleteData } = useDataHandler(false);
	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [loading, setLoading] = useState(false);
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
	const { data, refetch, count } = useFindModuleData<DownloadClass>({
		module: currentModule,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order
	});

	const columns = useCreateColumns<DownloadClass>({
		data: generateColumnsFromFields(currentModule.fields),
		fields: currentModule.data_fields,
		className: "Download",
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

	const pageHeaderButtons = useMemo(
		() => [
			{
				text: "Downloads löschen",
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
			title={currentModule.name}
			emptyContent={true}
			createClass={{
				className: "Download",
				text: "Neuen Download erstellen",
				fields: currentModule.fields,
				refetch: refetch
			}}
			refetch={refetch}
			pageHeaderButtons={pageHeaderButtons}
			pageStates={pageStates}
			pageState={activePage}
			setPageState={setActivePage}
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
			<Modal
				isOpen={deleteModal}
				cancelButtonHandler={() => setDeleteModal(false)}
				buttonDisabled={[loading, loading]}
				confirmButtonHandler={async () => {
					setLoading(true);
					await Promise.all(
						selectedRows.map(async (objectId) => {
							await deleteData({
								className: "Download",
								objectId
							});
						})
					);
					await refetch();
					setSelectedRows([]);
					setLoading(false);
					setDeleteModal(false);
				}}
				header={"Bilder löschen"}
			>
				<p>
					Sind sich Sicher, dass sie {selectedRows.length} Downloads
					löschen möchten?
				</p>
			</Modal>
		</Page>
	);
};

export default DownloadsOverview;
