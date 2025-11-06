"use client";

import { useContext, useMemo, useState } from "react";
import {
	generateColumnsFromFields,
	Modal,
	Page,
	PatstoreImageUploader,
	RenderFilters,
	Separator,
	Table,
	useCreateColumns
} from "@repo/ui";
import { Filter, ImageClass } from "@repo/types";
import {
	PatstoreAppContext,
	useDataHandler,
	useFindModuleData
} from "@repo/provider";

const ImagesOverview = () => {
	const { currentModule } = useContext(PatstoreAppContext);
	const { deleteData } = useDataHandler(false);

	const [uploadImages, setUploadImages] = useState(false);
	const [filters, setFilters] = useState<Filter[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const [selectedRows, setSelectedRows] = useState<string[]>([]);

	const [loading, setLoading] = useState(false);
	const [order, setOrder] = useState<string>("createdAt_DESC");
	const { data, refetch, count } = useFindModuleData<ImageClass>({
		module: currentModule,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order
	});

	const [deleteModal, setDeleteModal] = useState(false);

	const columns = useCreateColumns<ImageClass>({
		data: generateColumnsFromFields(currentModule.fields),
		fields: currentModule.data_fields,
		className: "Image",
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
				text: "Bilder löschen",
				onClick: () => {
					setDeleteModal(true);
				},
				icon: "delete",
				disabled: selectedRows.length === 0
			},
			{
				text: "Mehrere Bilder hochladen",
				onClick: () => setUploadImages(true)
			}
		],
		[selectedRows]
	);

	return (
		<Page
			title="Bilder"
			pageHeaderButtons={pageHeaderButtons}
			emptyContent={true}
			createClass={{
				className: "Image",
				text: "Neue Bilder erstellen",
				fields: currentModule.fields,
				refetch: refetch
			}}
		>
			<Separator size="xs" noLine />
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
				isOpen={uploadImages}
				buttonDisabled={[false, false]}
				cancelButtonHandler={() => setUploadImages(false)}
				header="Bilder hochladen"
			>
				<p>
					Bitte wählen Sie die Bilder aus, die Sie hochladen möchten.
				</p>
				<PatstoreImageUploader
					maxFileCount={20}
					afterUploadHandler={async () => {
						await refetch();
					}}
				/>
			</Modal>
			<Modal
				isOpen={deleteModal}
				cancelButtonHandler={() => setDeleteModal(false)}
				buttonDisabled={[loading, loading]}
				confirmButtonHandler={async () => {
					setLoading(true);
					await Promise.all(
						selectedRows.map(async (objectId) => {
							await deleteData({
								className: "Image",
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
					Sind sich Sicher, dass sie {selectedRows.length} Bilder
					löschen möchten?
				</p>
			</Modal>
		</Page>
	);
};

export default ImagesOverview;
