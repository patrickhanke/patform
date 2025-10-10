import React, { useCallback, useState } from "react";
import {
	CreateButton,
	Divider,
	DnDDisplay,
	Field,
	SlideIn,
	sortItemsByPosition
} from "@repo/ui";
import { useImmer } from "use-immer";
import AppModuleField from "./components/AppModuleCategory";
import initialFieldValues from "./constants/initialCategoryValues";
import { ModuleCategory } from "@repo/types";
import { v4 } from "uuid";
import { useDataHandler } from "@repo/provider";
import AppModuleEditCategory from "./components/AppModuleEditCategory";
import { AppModuleEditCategorysProps } from "./types";

const AppModuleEditCategories = ({
	moduleId,
	initialCategories,
	projectId
}: AppModuleEditCategorysProps) => {
	const { updateData } = useDataHandler(true, false);;
	const [editCategories, setEditCategories] = React.useState(false);
	const [loading, setLoading] = useState(false);
	const [categories, setCategories] = useImmer<ModuleCategory[]>(
		initialCategories || []
	);
	const [activeCategory, setActiveCategory] = React.useState("");

	const slideInConfirmHandler = useCallback(async () => {
		setLoading(true);
		await updateData({
			className: "Module",
			objectId: moduleId,
			updateObject: {
				categories: categories
			}
		});

		setEditCategories(false);
		setLoading(false);
	}, [categories]);

	const findactiveCategory = useCallback(
		(id: string) => {
			return categories.find((field) => field.id === id);
		},
		[categories]
	);

	return (
		<>
			<button
				className="full_button sm green"
				onClick={() => setEditCategories(true)}
			>
				Kategorien bearbeiten
			</button>
			<SlideIn
				cancel={() => setEditCategories(false)}
				confirm={() => slideInConfirmHandler()}
				isOpen={editCategories}
				header="Felder bearbeiten"
				showSecondaryContent={!!activeCategory}
				secondaryContent={
					<AppModuleEditCategory
						category={findactiveCategory(activeCategory)}
						setCategory={setCategories}
						projectId={projectId}
					/>
				}
				disabled={[loading, loading]}
			>
				<div>
					<CreateButton
						text="Kategorie hinzufügen"
						size="small"
						onClick={() => {
							setCategories((draft) => {
								draft.push({
									...initialFieldValues,
									position: draft.length + 1,
									id: v4() as string
								});
							});
						}}
					/>
					<Divider size="small" showLine={false} />
					<DnDDisplay<Field[]>
						items={
							(sortItemsByPosition(categories) as Field[]) || []
						}
						ItemComponent={({ item }) => (
							<AppModuleField
								category={item as ModuleCategory}
								setActiveCategory={setActiveCategory}
							/>
						)}
						objectClass="Module"
						subField={{ id: moduleId, field: "categories" }}
					/>
				</div>
			</SlideIn>
		</>
	);
};

export default AppModuleEditCategories;
