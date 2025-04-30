"use client";

import { useContext, useState } from "react";
import {
	Modal,
	Page,
	RenderFilters,
	Separator,
	Table,
	useCreateColumns
} from "@repo/ui";
import useGetImages from "./hooks/useGetImages";
import { Filter, ImageClass, PageState } from "@repo/types";
import { ImageUploader, useImageDataHandler } from "../ImageUploader";
import deleteModalInitialValues from "./constants/deleteModalInitialValues";
import {
	generateImagePath,
	PatstoreAppContext,
	useAppContext
} from "@repo/provider";

const pageStates: PageState[] = [
	{ value: "all", label: "Alle" },
	{ value: "active", label: "Aktiv" },
	{ value: "inactive", label: "Inaktiv" }
];

const ImagesOverview = () => {
	const { project } = useAppContext();
	const { currentModule } = useContext(PatstoreAppContext);
	const [uploadImages, setUploadImages] = useState(false);
	const [newImages, setNewImages] = useState<string[]>([]);
	const [activeState, setActiveState] = useState(pageStates[0]);
	const [filters, setFilters] = useState<Filter[]>([]);
	const { images, refetch } = useGetImages({
		moduleId: currentModule.objectId,
		filters
	});

	const { imageUploadHandler } = useImageDataHandler({
		projectId: project.objectId,
		afterCancelFunction: refetch,
		afterSaveFunction: refetch
	});

	const [deleteModal, setDeleteModal] = useState(deleteModalInitialValues);

	const columns = useCreateColumns<ImageClass>({
		data: [
			{ id: "filePath", type: "image", label: "Vorschau" },
			{ id: "date", type: "date", label: "Datum" },
			{ id: "name", type: "edit_string", label: "Name" },
			{ id: "description", type: "edit_textfield", label: "Beschreibung" }
		],
		fields: currentModule.fields,
		className: "Image",
		refetch,
		categories: currentModule?.categories
	});

	return (
		<Page
			title="Bilder"
			pageHeaderButtons={[
				{
					text: "Bilder hochladen",
					onClick: () => setUploadImages(true)
				}
			]}
			emptyContent={true}
			pageStates={pageStates}
			pageState={activeState}
			setPageState={setActiveState}
		>
			<RenderFilters
				categories={currentModule.categories}
				filters={filters}
				setFilters={setFilters}
				initialFilters={[]}
				fields={[]}
			/>
			<Separator size="xs" noLine />
			<Table columns={columns} data={images || []} />
			<Modal
				isOpen={uploadImages}
				buttonDisabled={[false, newImages.length === 0]}
				cancelButtonHandler={() => setUploadImages(false)}
				confirmButtonHandler={async () => {
					await imageUploadHandler(newImages);
					setUploadImages(false);
				}}
				header="Upload Images"
			>
				<ImageUploader
					label="Uploader"
					path={generateImagePath(
						process.env.APP_NAME as string,
						project.path
					)}
					onChange={(images) => {
						setNewImages(images as string[]);
					}}
				/>
			</Modal>
			<Modal
				isOpen={deleteModal.isOpen}
				cancelButtonHandler={() =>
					setDeleteModal(deleteModalInitialValues)
				}
				confirmButtonHandler={() => {
					deleteModal.confirmButtonHandler();
					setDeleteModal(deleteModalInitialValues);
				}}
				header={deleteModal.header}
			>
				<p>Sind sich Sicher, dass sie das Bild löschen möchten?</p>
			</Modal>
		</Page>
	);
};

export default ImagesOverview;
