"use client";

import { useMemo, useState } from "react";
import {
	generateColumnsFromFields,
	Modal,
	Page,
	PatstoreImageUploader,
	Separator,
	Table,
	useCreateColumns,
	usePageData
} from "@repo/ui";
import { Filter, ImageClass, ModuleOverviewProps } from "@repo/types";
import { useDataHandler, useFindModuleData, useGetData } from "@repo/provider";

const ImagesOverview = ({
	module,
	projectId,
	languages,
	defaultLanguage
}: ModuleOverviewProps<"/images"> & { projectId: string }) => {
	const { deleteData } = useDataHandler(false);
	const [uploadImages, setUploadImages] = useState(false);
	const [filters, setFilters] = useState<Filter[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const [selectedRows, setSelectedRows] = useState<string[]>([]);
	const { data: project } = useGetData({
		objectName: "Project",
		fields: ["name", "objectId", "connected_images"],
		id: projectId
	});

	const connectedImages = useMemo(() => {
		const imageArray: string[] = [];
		Object.keys(project?.connected_images || {}).forEach((key) => {
			const images: string[] = project?.connected_images[key].images;
			images.forEach((image) => {
				if (!imageArray.includes(image)) {
					imageArray.push(image);
				}
			});
		});
		return imageArray;
	}, [project]);

	const [loading, setLoading] = useState(false);
	const [order, setOrder] = useState<string>("createdAt_DESC");
	const {
		data,
		refetch,
		count,
		loading: dataLoading,
		language,
		changeLanguage
	} = useFindModuleData<ImageClass>({
		module,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize,
		order,
		defaultLanguage
	});

	const [deleteModal, setDeleteModal] = useState(false);

	const columns = useCreateColumns<ImageClass>({
		data: [...generateColumnsFromFields(module.fields)],
		fields: module.data_fields,
		className: "Image",
		refetch,
		categories: module.categories,
		initialData: data ?? []
	});
	const { data: pageRows } = usePageData<ImageClass[]>();

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
				text: "Bilder hochladen",
				onClick: () => setUploadImages(true)
			},
			{
				text: filters.find((filter) => filter.id === "objectId")
					? "Alle Bilder einblenden"
					: "Unbenutzte Bilder anzeigen",
				onClick: () => {
					const filterActive = filters.find(
						(filter) => filter.id === "objectId"
					);

					if (filterActive) {
						setFilters(
							filters.filter((filter) => filter.id !== "objectId")
						);
					} else {
						setFilters([
							...filters,
							{
								id: "objectId",
								key: "objectId",
								operator: "notIn",
								value: connectedImages
							}
						]);
					}
				}
			}
		],

		[selectedRows, filters, connectedImages]
	);

	return (
		<Page
			title={module.name}
			pageHeaderButtons={pageHeaderButtons}
			emptyContent={true}
		>
			<Separator size="xs" noLine />
			<Table
				columns={columns}
				data={pageRows ?? data ?? []}
				loading={dataLoading}
				rowCount={count}
				pagination={pagination}
				setPagination={setPagination}
				enableRowSelection
				selectedRows={selectedRows}
				setSelectedRows={setSelectedRows}
				filters={filters}
				setFilters={setFilters}
				filterColumns={module.filters}
				setOrder={setOrder}
				language={language}
				changeLanguage={changeLanguage}
				languages={languages}
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
						setUploadImages(false);
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
