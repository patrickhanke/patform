"use client";

import { useCallback, useContext, useMemo, useState } from "react";
import {
	DataTransfer,
	generateQuery,
	Modal,
	Page,
	PatstoreDisplayImage,
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
	PatstoreAppContext,
	useDataHandler
} from "@repo/provider";

const ImagesOverview = () => {
	const { currentModule, user } = useContext(PatstoreAppContext);
	const { deleteData, createData } = useDataHandler(false);

	const [uploadImages, setUploadImages] = useState(false);
	const [newImages, setNewImages] = useState<
		{ filePath: string; fileName: string }[]
	>([]);

	const [filters, setFilters] = useState<Filter[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const [selectedRows, setSelectedRows] = useState<string[]>([]);

	const [loading, setLoading] = useState(false);

	const { images, refetch, count } = useGetImages({
		moduleId: currentModule.objectId,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize
	});

	const resetUploadImages = () => {
		setNewImages([]);
		setUploadImages(false);
	};

	const imageUploadHandler = useCallback(async () => {
		const uploadArray = newImages.map(async (image) => {
			await createData({
				className: "Image",
				updateObject: {
					name: image.fileName,
					filePath: image.filePath,
					categories: [],
					description: "",
					fields: [],
					created_by: {
						__type: "Pointer",
						className: "_User",
						objectId: user.objectId
					},
					module: {
						__type: "Pointer",
						className: "Module",
						objectId: currentModule.objectId
					}
				},
				userId: user?.objectId
			});
		});

		await Promise.all(uploadArray);
		await refetch();
	}, [currentModule, user, newImages, user]);

	const [deleteModal, setDeleteModal] = useState(false);

	const columns = useCreateColumns<ImageClass>({
		data: [
			{ id: "filePath", type: "image", label: "Vorschau" },
			{ id: "date", type: "date", label: "Datum" },
			{ id: "name", type: "edit_string", label: "Name" },
			{
				id: "description",
				type: "edit_textfield",
				label: "Beschreibung"
			},
			{
				id: "connected_elements",
				type: "connected_elements",
				label: "Verknüpfungen"
			}
		],
		fields: currentModule.fields,
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
					fields: ["username", "portrait"]
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

	return (
		<Page
			title="Bilder"
			pageHeaderButtons={pageHeaderButtons}
			emptyContent={true}
		>
			{process.env.NODE_ENV === "development" && dataTransfer}
			<Separator size="xs" noLine />
			<Table
				columns={columns}
				data={images || []}
				rowCount={count}
				pagination={pagination}
				setPagination={setPagination}
				enableRowSelection
				onRowSelection={setSelectedRows}
				filterContent={renderFilters}
			/>
			<Modal
				isOpen={uploadImages}
				buttonDisabled={[false, newImages.length === 0]}
				cancelButtonHandler={() => resetUploadImages()}
				confirmButtonHandler={async () => {
					await imageUploadHandler();
					resetUploadImages();
				}}
				header="Bilder hochladen"
			>
				<p>
					Bitte wählen Sie die Bilder aus, die Sie hochladen möchten.
				</p>
				<PatstoreImageUploader
					maxFileCount={20}
					onChange={(newImages) => {
						setNewImages(newImages);
					}}
				/>
				{newImages.length > 0 && (
					<div>
						<p>{newImages.length} Bilder ausgewählt</p>
						<div className="flex row ai-ce jc-fs gap-sm wrap">
							{newImages.map((image) => (
								<PatstoreDisplayImage
									key={image.filePath}
									filePath={image.filePath}
									name={image.fileName}
								/>
							))}
						</div>
					</div>
				)}
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
