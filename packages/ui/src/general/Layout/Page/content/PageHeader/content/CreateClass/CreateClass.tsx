"use client";

import { useCallback, useContext, useMemo, useState } from "react";
import { getDatabaseDefaultFields, SlideInForm } from "@repo/ui";
import {
	PatstoreAppContext,
	useDataHandler,
	useFindData
} from "@repo/provider";
import { CreateClassProps } from "./types";
import { CategoryClass, Classes } from "@repo/types";
import { FormikValues } from "formik";

type CategoryRecord = CategoryClass & {
	category_id?: string;
};

const CreateClass = <T extends Classes>({
	initialData,
	fields,
	text,
	className,
	refetch,
	initialState = "published"
}: CreateClassProps<T>) => {
	const { createData } = useDataHandler();
	const { currentModule, user } = useContext(PatstoreAppContext);
	const [isOpen, setIsOpen] = useState(false);
	const requiredCategories = useMemo(
		() =>
			(currentModule?.categories || []).filter(
				(category) => category.is_required === true
			),
		[currentModule]
	);
	const categoryModuleId = requiredCategories.find(
		(category) => category.connected_class === "Category"
	)?.moduleId;
	const { data: categoryRecords } = useFindData<CategoryRecord>({
		objectName: "Category",
		fields: ["objectId", "label", "title", "category_id"],
		moduleId: categoryModuleId,
		limit: 300,
		skipQuery: !categoryModuleId
	});

	const dataHandler = useCallback(
		async (data: FormikValues) => {
			const updateObject: FormikValues = { ...data };
			const selectedCategoryIds: string[] = [];

			requiredCategories.forEach((category) => {
				const value = updateObject[category.id];
				delete updateObject[category.id];

				if (Array.isArray(value)) {
					value.forEach((item) => {
						if (typeof item === "string" && item) {
							selectedCategoryIds.push(item);
						}
					});
				} else if (typeof value === "string" && value) {
					selectedCategoryIds.push(value);
				}
			});

			if (requiredCategories.length > 0) {
				const existing = Array.isArray(updateObject.categories)
					? updateObject.categories.filter(
							(item): item is string => typeof item === "string"
						)
					: [];
				updateObject.categories = [
					...new Set([...existing, ...selectedCategoryIds])
				];
			}

			await createData({
				className: className,
				updateObject: {
					module: {
						__type: "Pointer",
						className: "Module",
						objectId: currentModule.objectId
					},
					...updateObject,
					state: initialState
				},
				feedback: "Neue Daten erstellt",
				userId: user?.objectId
			});
			if (refetch) {
				await refetch();
			}
		},
		[
			user,
			currentModule,
			requiredCategories,
			className,
			initialState,
			refetch
		]
	);

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				disabled={false}
				className="full_button md primary"
			>
				{text}
			</button>
			<SlideInForm
				isOpen={isOpen}
				title={text}
				setIsOpen={setIsOpen}
				fields={getDatabaseDefaultFields(
					fields,
					undefined,
					requiredCategories,
					categoryRecords || []
				)}
				data={initialData}
				dataHandler={(values) => dataHandler(values)}
			/>
		</>
	);
};

export default CreateClass;
