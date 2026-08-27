"use client";

import { useCallback, useRef, useState } from "react";
import {
	CreateButton,
	Divider,
	DnDDisplay,
	SlideIn,
	sortItemsByPosition,
	usePageData
} from "@repo/ui";
import { cloneDeep } from "lodash-es";
import { v4 } from "uuid";
import { useDataHandlerSecure } from "@repo/provider";
import { ErrorMessage, ModuleCategory } from "@repo/types";
import AppModuleField from "./components/AppModuleCategory";
import initialFieldValues from "./constants/initialCategoryValues";
import AppModuleEditCategory from "./components/AppModuleEditCategory";
import { AppModuleEditCategorysProps, ModuleCategoriesPageData } from "./types";

const AppModuleEditCategories = ({
	objectId,
	initialCategories,
	projectId,
	updateOptions,
	refetch
}: AppModuleEditCategorysProps) => {
	const { data, setData } = usePageData<ModuleCategoriesPageData>(
		{ initialData: { categories: initialCategories || [] }, objectId },
		updateOptions
	);
	const { updateData } = useDataHandlerSecure();
	const [activeCategory, setActiveCategory] = useState("");
	const [saving, setSaving] = useState(false);
	const [errors, setErrors] = useState<ErrorMessage[]>([]);
	const draftRef = useRef<ModuleCategory | null>(null);

	const categories = data?.categories ?? [];

	const findActiveCategory = useCallback(
		(id: string) => categories.find((category) => category.id === id),
		[categories]
	);

	const openEditor = useCallback(
		(id: string) => {
			const found = categories.find((item) => item.id === id);
			draftRef.current = found ? cloneDeep(found) : null;
			setActiveCategory(id);
		},
		[categories]
	);

	const deleteCategory = useCallback(
		(id: string) => {
			setData(
				"categories",
				categories.filter((category) => category.id !== id)
			);
			if (activeCategory === id) {
				setActiveCategory("");
			}
		},
		[activeCategory, categories, setData]
	);

	const handleLocalChange = useCallback((draft: ModuleCategory) => {
		draftRef.current = draft;
	}, []);

	const closeEditor = useCallback(() => {
		draftRef.current = null;
		setErrors([]);
		setActiveCategory("");
	}, []);

	const confirmEditor = useCallback(async () => {
		const draft = draftRef.current;
		if (!draft) {
			closeEditor();
			return;
		}

		const nextCategories = categories.map((item) =>
			item.id === draft.id ? draft : item
		);

		setSaving(true);
		setErrors([]);

		let failed = false;
		await updateData({
			className: "Module",
			objectId,
			updateObject: {
				categories: nextCategories
			},
			feedback: "Kategorien gespeichert",
			onError: (message) => {
				failed = true;
				setErrors([
					{
						id: "save",
						key: "save",
						message
					}
				]);
			}
		});

		setSaving(false);
		if (failed) return;

		await refetch();
		closeEditor();
	}, [categories, closeEditor, objectId, refetch, updateData]);

	const activeCategoryData = findActiveCategory(activeCategory);

	if (!data) return null;

	return (
		<div className="content_element">
			<CreateButton
				text="Kategorie hinzufügen"
				size="small"
				onClick={() => {
					setData("categories", [
						...categories,
						{
							...initialFieldValues,
							position: categories.length + 1,
							id: v4(),
							category_ids: []
						}
					]);
				}}
			/>
			<Divider size="small" showLine={false} />
			<DnDDisplay<ModuleCategory[]>
				items={sortItemsByPosition(categories) || []}
				ItemComponent={({ item }) => (
					<AppModuleField
						category={item as ModuleCategory}
						setActiveCategory={openEditor}
						deleteCategory={deleteCategory}
					/>
				)}
				onChange={(newCategories) => {
					setData(
						"categories",
						newCategories.map((category, index) => ({
							...category,
							position: index + 1
						}))
					);
				}}
			/>
			<SlideIn
				isOpen={!!activeCategoryData}
				header="Kategorie bearbeiten"
				cancel={closeEditor}
				confirm={confirmEditor}
				loading={saving}
				disabled={[saving, saving]}
				errors={errors}
			>
				{activeCategoryData ? (
					<AppModuleEditCategory
						key={activeCategoryData.id}
						category={cloneDeep(activeCategoryData)}
						onChange={handleLocalChange}
						projectId={projectId}
					/>
				) : null}
			</SlideIn>
		</div>
	);
};

export default AppModuleEditCategories;
