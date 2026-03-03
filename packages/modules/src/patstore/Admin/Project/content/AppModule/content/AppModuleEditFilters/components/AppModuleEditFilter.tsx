import { FC, useCallback, useMemo } from "react";
import { AppModuleEditFilterProps } from "../types";
import { InfoBox, Select } from "@repo/ui";
import { useDebounceCallback } from "usehooks-ts";
import { cloneDeep, set } from "lodash-es";
import filterOperators from "../constants/filterOperators";
import type { ModuleFilter } from "../types";
import { generateInitialFields } from "../../AppModuleEditFields";
import generateFieldTypes from "../functions/generateFieldTypes";
import { ModuleField, ModuleFilterType } from "@repo/types";

const AppModuleEditFilter: FC<AppModuleEditFilterProps> = ({
	filter,
	setFilters,
	modulePath,
	modules,
	settingsFields,
	dataFields,
	additionnalFields
}) => {
	if (!filter) {
		return null;
	}

	const filterChangeHandler = useCallback(
		(
			keys: (keyof ModuleFilter)[],
			value: ModuleFilter[keyof ModuleFilter][]
		) => {
			setFilters((draft) => {
				const index = draft.findIndex((f) => f.id === filter.id);
				const filterCopy: ModuleFilter = cloneDeep(filter);
				if (index !== -1) {
					keys.forEach((key, index) => {
						set(filterCopy, key, value[index]);
					});
					draft[index] = { ...filterCopy };
				}
			});
		},
		[filter, setFilters]
	);

	const filterSelectOptions = useMemo(() => {
		const fields: ModuleField[] = generateInitialFields([], modulePath);
		// return type from field, when Field has no filter type, ignore it

		console.log({ fields });
		const fieldArray: {
			value: string;
			label: string;
			type: ModuleFilterType;
		}[] = [
			{
				value: "label",
				label: "Label",
				type: "string"
			},
			{
				value: "data",
				label: "Data",
				type: "search"
			},
			{
				value: "settings",
				label: "Settings",
				type: "search"
			}
		];
		fields.forEach((field) => {
			const type = generateFieldTypes(field.type);
			if (type) {
				fieldArray.push({
					value: field.id,
					label: field.label,
					type: type
				});
			}
		});
		return fieldArray;
	}, [modulePath]);

	const operatorTemplateOptions = useMemo(() => {
		const options: {
			value: string;
			label: string;
			search_path: string;
		}[] = additionnalFields || [];

		if (filter.type === "search") {
			settingsFields.forEach((f) => {
				options.push({
					value: f.id,
					label: `${f.label} (Settings)`,
					search_path: f.name
				});
			});
			dataFields.forEach((f) => {
				options.push({
					value: f.id,
					label: `${f.label} (Data)`,
					search_path: f.name
				});
			});
		}

		return options;
	}, [filter.operator, settingsFields]);

	const changeHandler = useDebounceCallback(filterChangeHandler, 500);

	console.log({ filterSelectOptions });
	console.log({ filter });
	return (
		<div>
			<h3>{filter.label || filter.field || "Neuer Filter"}</h3>
			<div>
				<label>Label</label>
				<input
					key={filter.label}
					type="text"
					defaultValue={filter.label}
					placeholder="Anzeigename für den Filter"
					onChange={(e) => changeHandler(["label"], [e.target.value])}
				/>
			</div>
			<div>
				<Select
					label="Feld"
					options={filterSelectOptions}
					value={
						filterSelectOptions.find(
							(f) => f.value === filter.field
						) || null
					}
					onChange={(e) => {
						console.log({ e });
						changeHandler(["field", "type"], [e.value, e.type]);
					}}
				/>
			</div>
			<div>
				<Select
					label="Operator"
					options={filterOperators(filter.type)}
					value={filter.operator}
					onChange={(e) => changeHandler(["operator"], [e.value])}
				/>
			</div>
			{filter.type === "pointer" ||
				filter.type === "id" ||
				(filter.type === "ids" && (
					<div>
						<label>Pointer Klasse</label>
						<Select
							label="Pointer Klasse"
							options={modules}
							value={
								modules.find(
									(m) =>
										m.connected_class ===
										filter.options?.class_name
								) || null
							}
							onChange={(e) =>
								changeHandler(
									["options"],
									[{ ...filter.options, class_name: e.value }]
								)
							}
						/>
					</div>
				))}
			{filter.type === "search" && (
				<div>
					<label>Suchfeld</label>
					<Select
						label="Operator-Template"
						options={operatorTemplateOptions}
						value={
							operatorTemplateOptions.find(
								(o) =>
									o.search_path ===
									filter.options?.search_path
							) || null
						}
						onChange={(e) =>
							changeHandler(
								["options"],
								[{ ...filter.options, search_path: e.value }]
							)
						}
					/>
				</div>
			)}
		</div>
	);
};

export default AppModuleEditFilter;
