"use client";

import { useMemo, useState } from "react";
import {
	generateColumnsFromFields,
	Modal,
	Page,
	Table,
	useCreateColumns
} from "@repo/ui";
import { Filter, Module, VideoClass } from "@repo/types";
import { useDataHandler, useFindModuleData } from "@repo/provider";

const VideosOverview = ({ module }: { module: Module }) => {
	const { deleteData } = useDataHandler(false);
	const [filters, setFilters] = useState<Filter[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const [selectedRows, setSelectedRows] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [order, setOrder] = useState<string>("createdAt_DESC");
	const { data, refetch, count, loading: dataLoading } = useFindModuleData<VideoClass>({
		module,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order
	});

	const [deleteModal, setDeleteModal] = useState<boolean>(false);

	const columns = useCreateColumns<VideoClass>({
		data: generateColumnsFromFields(module.fields),
		fields: module.data_fields,
		className: "Video",
		refetch,
		categories: module.categories
	});

	const pageHeaderButtons = useMemo(
		() => [
			{
				text: "Personen löschen",
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
			pageHeaderButtons={pageHeaderButtons}
			createClass={{
				className: "Video",
				text: "Neue Video erstellen",
				fields: module.fields,
				refetch: refetch
			}}
			emptyContent={true}
			refetch={refetch}
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
				setOrder={setOrder}
				filters={filters}
				setFilters={setFilters}
				filterColumns={module.filters || []}
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
								className: "Video",
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
					Sind sich Sicher, dass sie {selectedRows.length} Videos
					löschen möchten?
				</p>
			</Modal>
		</Page>
	);
};

export default VideosOverview;
