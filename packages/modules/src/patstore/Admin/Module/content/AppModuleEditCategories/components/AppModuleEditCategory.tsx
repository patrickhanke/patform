import { useCallback, useEffect, useMemo, useState } from "react";
import { useFindData } from "@repo/provider";
import { Select, StatelessToggle } from "@repo/ui";
import { Module, ModuleCategory, ModuleSettingsCategory } from "@repo/types";
import { AppModuleEditCategoryProps } from "../types";
import { cloneDeep, isArray } from "lodash-es";

const AppModuleEditCategory = ({
	category,
	onChange,
	projectId
}: AppModuleEditCategoryProps) => {
	const [localCategory, setLocalCategory] = useState<ModuleCategory>(() =>
		cloneDeep(category)
	);

	useEffect(() => {
		onChange(localCategory);
	}, [localCategory, onChange]);

	const { data } = useFindData({
		objectName: "Module",
		fields: [
			"objectId",
			"name",
			"position",
			"categories",
			"connected_class",
			"settings"
		],
		projectId
	});

	const changeHandler = useCallback((value: Partial<ModuleCategory>) => {
		setLocalCategory((current) => ({
			...current,
			...value
		}));
	}, []);

	const categorySelectOptions = useMemo(() => {
		const selectOptions: {
			value: string;
			label: string;
			connected_class: string;
		}[] = [];
		if (data) {
			(data as Module[]).forEach((module) => {
				if (module.connected_class) {
					selectOptions.push({
						label: module.name,
						value: module.objectId,
						connected_class: module.connected_class
					});
				}
			});
		}

		return selectOptions;
	}, [data]);

	const subGroupSelectOptions = useMemo(() => {
		if (localCategory.connected_class === "Category") {
			const module = (data as Module[] | undefined)?.find(
				(item) => item.objectId === localCategory.moduleId
			);

			if (
				module &&
				module.settings?.categories &&
				module.settings.categories.length > 0
			) {
				return module.settings.categories.map(
					(item: ModuleSettingsCategory) => ({
						label: item.label,
						value: item.id
					})
				);
			}

			return [];
		}
		return [];
	}, [localCategory, data]);

	return (
		<div className="flex col gap-sm">
			<h3>{localCategory.label}</h3>
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
					value={localCategory.moduleId}
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
					key={localCategory.moduleId}
					label="Untergruppierung auswählen"
					options={subGroupSelectOptions}
					value={localCategory.category_ids}
					onChange={(e) => {
						if (isArray(e)) {
							changeHandler({
								category_ids: e.map(
									(item: { value: string }) => item.value
								)
							});
						} else {
							changeHandler({
								category_ids: []
							});
						}
					}}
					isDisabled={
						!localCategory.connected_class ||
						subGroupSelectOptions.length === 0
					}
					isMulti
					isClearable
				/>
			</div>
			<div>
				<StatelessToggle
					label="Mehrfachangaben zulassen"
					value={localCategory.is_multi}
					onChange={(e) => changeHandler({ is_multi: e })}
				/>
			</div>
		</div>
	);
};

export default AppModuleEditCategory;
