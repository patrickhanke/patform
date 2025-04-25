"use client";

import { useContext, useState, useMemo } from "react";
import { Modal, Page, RenderFilters, Table, useCreateColumns } from "@repo/ui";
import { Filter, NewsClass } from "@repo/types";
import { PatstoreAppContext, useDataHandler } from "@repo/provider";
import useFindNews from "./hooks/useFindNews";
import createClass from "./constants/createClass";

const NewsOverview = () => {
	const { currentModule } = useContext(PatstoreAppContext);
	const { deleteData } = useDataHandler();

	const [filters, setFilters] = useState<Filter[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const { news, refetch, count } = useFindNews({
		moduleId: currentModule.objectId,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize
	});
	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [selectedRows, setSelectedRows] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const columns = useCreateColumns<NewsClass>({
		data: [
			{ id: "image", type: "image", label: "Bild" },
			{ id: "title", type: "edit_string", label: "Titel" },
			{ id: "date", type: "date_picker", label: "Datum" },
			{ id: "text", type: "edit_texteditor", label: "Text" }
		],
		fields: currentModule.fields,
		className: "News",
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
				text: "News löschen",
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
			pageHeaderButtons={pageHeaderButtons}
			emptyContent={true}
			createClass={createClass}
			refetch={refetch}
		>
			<Table
				columns={columns}
				data={news || []}
				setPagination={setPagination}
				pagination={pagination}
				rowCount={count}
				filterContent={renderFilters}
				onRowSelection={setSelectedRows}
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
								className: "News",
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
