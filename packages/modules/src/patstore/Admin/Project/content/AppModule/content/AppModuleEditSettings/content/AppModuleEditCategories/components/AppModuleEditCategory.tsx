import { ModuleSettings, ModuleSettingsCategory } from "@repo/types";
import { AppModuleEditSettingsCategoriesProps } from "../types";
import { CreateButton, IconButton } from "@repo/ui";
import { useCallback } from "react";
import { v4 } from "uuid";
import { slugify } from "@repo/provider";

const AppModuleEditSettingsCategories = ({
	categories,
	setSettings
}: AppModuleEditSettingsCategoriesProps) => {
	const changeHandler = useCallback(
		(value: ModuleSettingsCategory) => {
			setSettings((draft: ModuleSettings) => {
				if (!draft.categories) return;

				const categoryIndex = draft.categories.findIndex(
					(category) => category.id === value.id
				);
				if (categoryIndex === -1) return;

				draft.categories[categoryIndex] = value;
			});
		},
		[setSettings]
	);

	const deleteHandler = useCallback(
		(id: string) => {
			setSettings((draft: ModuleSettings) => {
				if (!draft.categories) return;

				draft.categories = draft.categories.filter(
					(category) => category.id !== id
				);
			});
		},
		[setSettings]
	);

	if (categories === undefined) {
		return null;
	}

	return (
		<div className="vertical_container">
			{categories.map((category: ModuleSettingsCategory) => {
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
						setSettings((draft: ModuleSettings) => {
							if (!draft.categories) {
								draft.categories = [];
							}

							draft.categories.push({
								label: "",
								value: v4() as string,
								position: draft.categories.length + 1,
								id: v4() as string
							});
						});
					}}
				/>
			</div>
		</div>
	);
};

export default AppModuleEditSettingsCategories;
