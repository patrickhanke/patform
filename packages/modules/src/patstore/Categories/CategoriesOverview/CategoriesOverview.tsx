"use client";

import { useContext, useMemo, useState } from "react";
import { Modal, Page, Table, useCreateColumns } from "@repo/ui";
import { CategoryClass } from "@repo/types";
import { PatstoreAppContext, useFindData } from "@repo/provider";
import deleteModalInitialValues from "./constants/deleteModalInitialValues";
import CreateCategory from "./components/CreateCategory";

const Categories = () => {
	const { currentModule } = useContext(PatstoreAppContext);
	const pageStates = useMemo(
		() => currentModule?.settings?.categories,
		[currentModule]
	);
	const [activeState, setActiveState] = useState(
		pageStates ? pageStates[0] : undefined
	);

	const { data: categories, refetch } = useFindData({
		objectName: "Category",
		fields: [
			"objectId",
			"title",
			"image",
			"createdAt",
			"data",
			"color",
			"categories",
			"description"
		],
		filters: activeState?.value
			? [
					{
						key: "category_id",
						value: activeState.id,
						operator: "equalTo",
						id: activeState.id
					}
				]
			: [],
		limit: 10,
		skip: 0,
		order: "createdAt_DESC"
	});

	const [deleteModal, setDeleteModal] = useState(deleteModalInitialValues);

	const columns = useCreateColumns<CategoryClass>({
		data: [
			{ id: "image", type: "edit_image", label: "Bild" },
			{ id: "objectId", type: "string", label: "ID" },
			{ id: "title", type: "edit_string", label: "Name" },
			{
				id: "description",
				type: "edit_textfield",
				label: "Beschreibung"
			},
			{ id: "color", type: "edit_color", label: "Farbe" }
		],
		fields: currentModule.data_fields,
		className: "Category",
		refetch,
		categories: currentModule?.categories
	});

	const pageHeaderContent = useMemo(
		() =>
			activeState ? (
				<CreateCategory
					refetch={refetch}
					typeId={activeState?.id}
					typeLabel={activeState?.label}
					type={activeState?.value}
				/>
			) : null,
		[activeState]
	);

	return (
		<Page
			title={currentModule.name}
			pageHeaderContent={pageHeaderContent}
			// emptyContent={true}
			pageStates={pageStates}
			pageState={activeState}
			setPageState={setActiveState}
		>
			<Table columns={columns} data={categories || []} />
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
				<p>Sind sich Sicher, dass sie die Person löschen möchten?</p>
			</Modal>
		</Page>
	);
};

export default Categories;
