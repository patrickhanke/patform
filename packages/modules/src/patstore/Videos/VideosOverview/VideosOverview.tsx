"use client";

import { useContext, useMemo, useState } from "react";
import {
	generateColumnsFromFields,
	Modal,
	Page,
	Table,
	useCreateColumns
} from "@repo/ui";
import { Filter, VideoClass } from "@repo/types";
import {
	PatstoreAppContext,
	useDataHandler,
	useFindModuleData
} from "@repo/provider";

const VideosOverview = () => {
	const { deleteData } = useDataHandler(false);
	const { currentModule } = useContext(PatstoreAppContext);
	const [filters, setFilters] = useState<Filter[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const [selectedRows, setSelectedRows] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [order, setOrder] = useState<string>("createdAt_DESC");
	const { data, refetch, count } = useFindModuleData<VideoClass>({
		module: currentModule,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order
	});

	const [deleteModal, setDeleteModal] = useState<boolean>(false);

	const columns = useCreateColumns<VideoClass>({
		data: generateColumnsFromFields(currentModule.fields),
		fields: currentModule.data_fields,
		className: "Video",
		refetch,
		categories: currentModule?.categories
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
			title={currentModule.name}
			// pageHeaderContent={<CreatePerson refetch={refetch} />}
			pageHeaderButtons={pageHeaderButtons}
			createClass={{
				className: "Video",
				text: "Neue Video erstellen",
				fields: currentModule.fields,
				refetch: refetch
			}}
			emptyContent={true}
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
				setOrder={setOrder}
				filters={filters}
				setFilters={setFilters}
				filterColumns={currentModule.filters || []}
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
