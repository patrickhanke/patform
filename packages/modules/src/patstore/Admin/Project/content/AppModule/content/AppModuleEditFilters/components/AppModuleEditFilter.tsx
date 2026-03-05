import { FC, useCallback, useMemo } from "react";
import { AppModuleEditFilterProps } from "../types";
import { Select, StatelessToggle } from "@repo/ui";
import { useDebounceCallback } from "usehooks-ts";
import { cloneDeep, set } from "lodash-es";
import filterOperators from "../constants/filterOperators";
import type { ModuleFilter, ModuleFilterPath } from "../types";
import { generateInitialFields } from "../../AppModuleEditFields";
import generateFieldTypes from "../functions/generateFieldTypes";
import { ModuleField, ModuleFilterType } from "@repo/types";
import CreateOptions from "./CreateOptions";

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

	console.log({ modules });

	const filterChangeHandler = useCallback(
		(
			keys: ModuleFilterPath[],
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

	const operatorTemplateOptions = useCallback(() => {
		const options: AppModuleEditFilterProps["additionnalFields"] =
			cloneDeep(additionnalFields) || [];

		if (filter.field === "data") {
			dataFields.forEach((f) => {
				options.push({
					value: f.id,
					label: `${f.label} (Settings)`,
					search_path: f.name,
					type: f.type
				});
			});
		} else if (filter.field === "settings") {
			settingsFields.forEach((f) => {
				options.push({
					value: f.id,
					label: `${f.label} (Data)`,
					search_path: f.name,
					type: f.type
				});
			});
		}

		return options;
	}, [filter.field, settingsFields]);

	const changeHandler = useDebounceCallback(filterChangeHandler, 500);

	console.log({ operatorTemplateOptions: operatorTemplateOptions() });

	console.log({ filterSelectOptions });
	console.log({ filter });
	console.log({ settingsFields });
	console.log({ additionnalFields });
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
			filter.type === "ids" ? (
				<div>
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
								[
									{
										...filter.options,
										class_name: e.connected_class
									}
								]
							)
						}
					/>
				</div>
			) : null}
			{filter.type === "search" && (
				<div>
					<label>Suchfeld</label>
					<Select
						label="Operator-Template"
						options={operatorTemplateOptions()}
						value={
							operatorTemplateOptions().find(
								(o) =>
									o.search_path ===
									filter.options?.search_path
							) || null
						}
						onChange={(e) =>
							changeHandler(
								["options"],
								[
									{
										...filter.options,
										search_path: e.search_path,
										type: e.type
									}
								]
							)
						}
					/>
				</div>
			)}
			{filter.type === "string" && (
				<>
					<div>
						<label>Operator</label>
						<StatelessToggle
							value={filter.options?.fixed || false}
							onChange={(e) =>
								changeHandler(["options.fixed"], [e])
							}
						/>
					</div>
					<div>
						{filter.options?.fixed && (
							<div>
								<label>Select Optionen</label>
								<CreateOptions
									filter={filter}
									changeHandler={changeHandler}
								/>
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default AppModuleEditFilter;
