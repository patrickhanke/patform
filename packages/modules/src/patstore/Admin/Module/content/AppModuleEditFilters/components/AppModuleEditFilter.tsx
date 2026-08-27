import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { AppModuleEditFilterProps } from "../types";
import { Select, StatelessToggle } from "@repo/ui";
import { cloneDeep, set } from "lodash-es";
import filterOperators from "../constants/filterOperators";
import type { ModuleFilter, ModuleFilterPath } from "../types";
import { generateInitialFields } from "../../AppModuleEditFields";
import generateFieldTypes from "../functions/generateFieldTypes";
import { ModuleField, ModuleFilterType } from "@repo/types";
import CreateOptions from "./CreateOptions";

const AppModuleEditFilter: FC<AppModuleEditFilterProps> = ({
	filter,
	onChange,
	modulePath,
	modules,
	settingsFields,
	dataFields,
	additionnalFields
}) => {
	const [localFilter, setLocalFilter] = useState<ModuleFilter>(() =>
		cloneDeep(filter)
	);

	useEffect(() => {
		onChange(localFilter);
	}, [localFilter, onChange]);

	const changeHandler = useCallback(
		(keys: ModuleFilterPath[], value: unknown[]) => {
			setLocalFilter((current) => {
				const next = cloneDeep(current);
				keys.forEach((key, index) => {
					set(next, key, value[index]);
				});
				return next;
			});
		},
		[]
	);

	const filterSelectOptions = useMemo(() => {
		const fields: ModuleField[] = generateInitialFields([], modulePath);

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
		const options: NonNullable<
			AppModuleEditFilterProps["additionnalFields"]
		> = [];

		if (localFilter.field === "data") {
			dataFields.forEach((item) => {
				options.push({
					value: item.id,
					label: `${item.label} (Data)`,
					search_path: item.name,
					type: item.type
				});
			});
		} else if (localFilter.field === "settings") {
			settingsFields.forEach((item) => {
				options.push({
					value: item.id,
					label: `${item.label} (Settings)`,
					search_path: item.name,
					type: item.type
				});
			});
		}

		if (additionnalFields) {
			additionnalFields.forEach((item) => {
				options.push({
					value: item.value,
					label: item.label,
					search_path: item.search_path,
					type: item.type
				});
			});
		}

		return options;
	}, [localFilter.field, settingsFields, dataFields, additionnalFields]);

	return (
		<div>
			<h3>{localFilter.label || localFilter.field || "Neuer Filter"}</h3>
			<div>
				<label>Label</label>
				<input
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
							(item) => item.value === localFilter.field
						) || null
					}
					onChange={(e) => {
						changeHandler(["field", "type"], [e.value, e.type]);
					}}
				/>
			</div>
			<div>
				<Select
					key={localFilter.type}
					label="Operator"
					options={filterOperators(localFilter.type)}
					value={localFilter.operator}
					onChange={(e) => changeHandler(["operator"], [e.value])}
				/>
			</div>
			{localFilter.type === "pointer" ||
			localFilter.type === "id" ||
			localFilter.type === "ids" ? (
				<div>
					<Select
						label="Pointer Klasse"
						options={modules}
						value={
							modules.find(
								(item) =>
									item.connected_class ===
									localFilter.options?.class_name
							) || null
						}
						onChange={(e) =>
							changeHandler(
								["options"],
								[
									{
										...localFilter.options,
										class_name: e.connected_class
									}
								]
							)
						}
					/>
				</div>
			) : null}
			{localFilter.type === "search" && (
				<div>
					<label>Suchfeld</label>
					<Select
						key={localFilter.field}
						label="Operator-Template"
						options={operatorTemplateOptions}
						value={
							operatorTemplateOptions.find(
								(item) =>
									item.search_path ===
									localFilter.options?.search_path
							) || null
						}
						onChange={(e) =>
							changeHandler(
								["options"],
								[
									{
										...localFilter.options,
										search_path: e.search_path,
										type: e.type
									}
								]
							)
						}
					/>
					{localFilter.options?.type === "select" && (
						<div>
							<label>Select Optionen</label>
							<CreateOptions
								filter={localFilter}
								changeHandler={changeHandler}
							/>
						</div>
					)}
				</div>
			)}
			{localFilter.type === "string" && (
				<>
					<div>
						<label>Feste Werte</label>
						<StatelessToggle
							value={localFilter.options?.fixed || false}
							onChange={(e) =>
								changeHandler(["options.fixed"], [e])
							}
						/>
					</div>
					<div>
						{localFilter.options?.fixed && (
							<div>
								<label>Select Optionen</label>
								<CreateOptions
									filter={localFilter}
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
