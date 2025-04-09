import { useCallback, useMemo } from "react";
import { generateGraphQLQuery, paramsHandler } from "@repo/provider";
import { Select, StatelessToggle } from "@repo/ui";
import { Module, ModuleCategory, ModuleSettingsCategory } from "@repo/types";
import { AppModuleEditCategoryProps } from "../types";
import { useQuery } from "@apollo/client";
import { isArray } from "lodash-es";

const AppModuleEditCategory = ({
	category,
	setCategory,
	projectId
}: AppModuleEditCategoryProps) => {
	const { data } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: "Module",
			fields: [
				"objectId",
				"name",
				"position",
				"categories",
				"connected_class",
				"settings"
			]
		}),
		{
			variables: { params: paramsHandler({ projectId }) }
		}
	);

	const changeHandler = useCallback(
		(value: { [key: string]: any }) => {
			if (category) {
				setCategory((draft: ModuleCategory[]) => {
					const index: number = draft.findIndex(
						(categoryToFind) => categoryToFind.id === category.id
					);
					const fieldCopy: typeof category = { ...category };
					if (index !== -1) {
						draft[index] = { ...fieldCopy, ...value };
					}
				});
			}
		},
		[category, setCategory]
	);

	const categorySelectOptions = useMemo(() => {
		const selectOptions: {
			value: string;
			label: string;
			connected_class: string;
		}[] = [];
		if (data) {
			data.objects.findModule.results.forEach((module: Module) => {
				if (module.connected_class) {
					selectOptions.push({
						label: module.name,
						value: module?.objectId,
						connected_class: module.connected_class
					});
				}
			});
		}

		return selectOptions;
	}, [data]);

	const subGroupSelectOptions = useMemo(() => {
		if (category?.connected_class === "Category") {
			const module = data?.objects.findModule.results.find(
				(module: Module) => module.objectId === category.moduleId
			);

			if (module && module.settings?.categories.length > 0) {
				return module.settings.categories.map(
					(category: ModuleSettingsCategory) => ({
						label: category.label,
						value: category.id
					})
				);
			}

			return [];
		}
		return [];
	}, [category, data]);

	if (!category) {
		return null;
	}

	return (
		<div className="flex col gap-sm">
			<h3>{category.label}</h3>
			<div>
				<label>Label</label>
				<input
					type="text"
					defaultValue={category.label}
					onChange={(e) => changeHandler({ label: e.target.value })}
				/>
			</div>
			<div>
				<Select
					label="Typ auswählen"
					options={categorySelectOptions}
					value={category.moduleId}
					onChange={(e) => {
						changeHandler({
							moduleId: e.value as string,
							connected_class: e.connected_class
						});
					}}
				/>
			</div>
			<div>
				<Select
					label="Untergruppierung auswählen"
					options={subGroupSelectOptions}
					value={category.category_ids}
					onChange={(e) => {
						if (isArray(e)) {
							changeHandler({
								category_ids: e.map(
									(e: { value: string }) => e.value
								)
							});
						} else {
							changeHandler({
								category_ids: []
							});
						}
					}}
					isDisabled={
						!category.connected_class ||
						subGroupSelectOptions.length === 0
					}
					isMulti
					isClearable
				/>
			</div>
			<div>
				<StatelessToggle
					label="Mehrfachangaben zulassen"
					value={category.is_multi}
					onChange={(e) => changeHandler({ is_multi: e })}
				/>
			</div>
		</div>
	);
};

export default AppModuleEditCategory;
