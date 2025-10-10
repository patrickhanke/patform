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
import { Filter, NewsClass } from "@repo/types";
import { PatstoreAppContext, useDataHandler } from "@repo/provider";
import useFindNews from "./hooks/useFindNews";
import createNews from "./constants/createNews";

const NewsOverview = () => {
	const { currentModule } = useContext(PatstoreAppContext);
	const { deleteData } = useDataHandler();
	console.log({ currentModule });

	const [filters, setFilters] = useState<Filter[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const { news, refetch, count } = useFindNews({
		module: currentModule,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize
	});
	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [selectedRows, setSelectedRows] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const columns = useCreateColumns<NewsClass>({
		data: generateColumnsFromFields(currentModule.fields),
		fields: currentModule.data_fields,
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
			createClass={createNews}
			refetch={refetch}
		>
			<Table
				columns={columns}
				data={news || []}
				setPagination={setPagination}
				pagination={pagination}
				rowCount={count}
				filterContent={renderFilters}
				selectedRows={selectedRows}
				setSelectedRows={setSelectedRows}
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
