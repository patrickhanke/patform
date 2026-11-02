import { ModuleSettingsCategory } from "@repo/types";
import { AppModuleEditSettingsCategoriesProps } from "../types";
import { CreateButton, IconButton } from "@repo/ui";
import { useCallback } from "react";
import { v4 } from "uuid";
import { slugify } from "@repo/provider";

const AppModuleEditSettingsCategories = ({
	categories,
	setData
}: AppModuleEditSettingsCategoriesProps) => {
	const changeHandler = useCallback(
		(value: ModuleSettingsCategory) => {
			const categoryIndex = (categories || []).findIndex(
				(category) => category.id === value.id
			);
			if (categoryIndex === -1) return;

			setData(`settings.categories.${categoryIndex}`, value);
		},
		[categories, setData]
	);

	const deleteHandler = useCallback(
		(id: string) => {
			setData(
				"settings.categories",
				(categories || []).filter((category) => category.id !== id)
			);
		},
		[categories, setData]
	);

	return (
		<div className="vertical_container">
			{(categories || []).map((category: ModuleSettingsCategory) => {
				return (
					<div key={category.id} className="content_element">
						<div className="flex row a-ce j-sb gap-sm">
							<h3>{category.label}</h3>
							<IconButton
								icon="delete"
								onClick={() => deleteHandler(category.id)}
							/>
						</div>
						<div>
							<label>Label</label>
							<input
								type="text"
								defaultValue={category.label}
								onChange={(e) =>
									changeHandler({
										...category,
										label: e.target.value,
										value: slugify(e.target.value)
									})
								}
							/>
						</div>
					</div>
				);
			})}
			<div>
				<CreateButton
					text="Kategorie hinzufügen"
					size="medium"
					onClick={() => {
						setData("settings.categories", [
							...(categories || []),
							{
								label: "",
								value: v4(),
								position: (categories || []).length + 1,
								id: v4()
							}
						]);
					}}
				/>
			</div>
		</div>
	);
};

export default AppModuleEditSettingsCategories;
