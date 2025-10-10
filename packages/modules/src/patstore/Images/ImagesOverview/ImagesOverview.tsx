"use client";

import { useContext, useMemo, useState } from "react";
import {
	DataTransfer,
	generateColumnsFromFields,
	generateQuery,
	Modal,
	Page,
	PatstoreImageUploader,
	RenderFilters,
	Separator,
	Table,
	useCreateColumns
} from "@repo/ui";
import useGetImages from "./hooks/useGetImages";
import { Filter, ImageClass } from "@repo/types";
import {
	convertDateToString,
	getImageUrlFromBytescale,
	PatstoreAppContext,
	useDataHandler
} from "@repo/provider";

const ImagesOverview = () => {
	const { currentModule, user } = useContext(PatstoreAppContext);
	const { deleteData, updateImage } = useDataHandler(false);

	const [uploadImages, setUploadImages] = useState(false);
	const [filters, setFilters] = useState<Filter[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const [selectedRows, setSelectedRows] = useState<string[]>([]);

	const [loading, setLoading] = useState(false);

	const { images, refetch, count } = useGetImages({
		module: currentModule,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize
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
						key: "name",
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
				text: "Bilder hochladen",
				onClick: () => setUploadImages(true)
			}
		],
		[selectedRows]
	);

	const dataTransfer = useMemo(
		() => (
			<DataTransfer<
				ImageClass,
				{
					username: string;
					portrait: object;
				}
			>
				sourceClassName="Uebungsleiter"
				targetClassName="Image"
				moduleId={currentModule.objectId}
				userId={user.objectId}
				url="https://pg-app-mvx9tbt2yit00ef2pzlktzg3k81djj.scalabl.cloud/graphql/"
				masterKey="POcP3f5vEluCLVT1txftBPf5XGTIPYSki6UR7VRH"
				appId="E24kTRGCLBzXhUOQvwFNekgPpoMPeHRNITT67YiR"
				query={generateQuery({
					objectName: "Uebungsleiter",
					fields: ["username", "portrait {url name}"]
				})}
				propertyMapping={(person) => ({
					name: person.username,
					filePath: person.portrait as unknown as string,
					categories: [],
					description: "",
					fields: [],
					date: convertDateToString(new Date()),
					connected_elements: []
				})}
			/>
		),
		[user]
	);

	console.log(selectedRows);

	return (
		<Page
			title="Bilder"
			pageHeaderButtons={pageHeaderButtons}
			emptyContent={true}
		>
			{process.env.NODE_ENV === "development" && dataTransfer}
			{process.env.NODE_ENV === "development" && (
				<>
					<button
						onClick={async () => {
							const filteredImages = images.filter(
								(image) => !image.file && image.filePath
							);

							console.log(filteredImages);

							await Promise.all(
								filteredImages.map(async (image) => {
									const bsUrl = getImageUrlFromBytescale({
										filePath: image.filePath
									});

									console.log(bsUrl);
									const response = await fetch(bsUrl);
									const blob = await response.blob();

									console.log(blob);
									const fileUrl =
										bsUrl.split("/").pop() || image.name;

									console.log(fileUrl);

									updateImage({
										file: blob,
										name: fileUrl.replace(
											/[^a-zA-Z0-9._-]/g,
											"_"
										),
										imageId: image.objectId,
										feedback: "Bild erfolgreich hochgeladen"
									});
								})
							);

							refetch();
						}}
					>
						Bilder aktualisieren
					</button>
				</>
			)}
			<Separator size="xs" noLine />
			<Table
				columns={columns}
				data={images || []}
				rowCount={count}
				pagination={pagination}
				setPagination={setPagination}
				enableRowSelection
				selectedRows={selectedRows}
				setSelectedRows={setSelectedRows}
				filterContent={renderFilters}
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
