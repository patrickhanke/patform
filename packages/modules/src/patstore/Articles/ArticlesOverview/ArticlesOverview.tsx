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
	useFindModuleData
} from "@repo/provider";

import { ArticleClass, Filter } from "@repo/types";
import state from "./constants/articleState";

const ArticlesOverview = () => {
	const { currentModule } = useContext(PatstoreAppContext);
	const { deleteData } = useDataHandler();
	const [selectedRows, setSelectedRows] = useState<string[]>([]);
	const [filters, setFilters] = useState<Filter[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const [order, setOrder] = useState<string>("createdAt_DESC");
	const { data, refetch, count } = useFindModuleData<ArticleClass>({
		module: currentModule,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order
	});

	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [loading, setLoading] = useState(false);

	const columns = useCreateColumns<ArticleClass>({
		data: generateColumnsFromFields(currentModule.fields),
		fields: currentModule.data_fields,
		className: "Article",
		refetch,
		categories: currentModule?.categories,
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

	console.log(currentModule);

	return (
		<Page
			title={currentModule.name}
			emptyContent={true}
			pageHeaderButtons={pageHeaderButtons}
			createClass={{
				className: "Article",
				text: "Neuen Bericht erstellen",
				fields: currentModule.fields,
				refetch: refetch
			}}
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
