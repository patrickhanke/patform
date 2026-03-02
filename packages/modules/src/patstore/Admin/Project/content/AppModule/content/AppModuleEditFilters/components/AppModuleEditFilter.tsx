import { FC, useCallback, useMemo } from "react";
import { AppModuleEditFilterProps } from "../types";
import { InfoBox, Select } from "@repo/ui";
import { useDebounceCallback } from "usehooks-ts";
import { cloneDeep, set } from "lodash-es";
import filterFieldTypes from "../constants/filterFieldTypes";
import filterOperators from "../constants/filterOperators";
import type { ModuleFilter } from "../types";
import { generateInitialFields } from "../../AppModuleEditFields";

const AppModuleEditFilter: FC<AppModuleEditFilterProps> = ({
	filter,
	setFilters,
	modulePath
}) => {
	if (!filter) {
		return null;
	}

	const filterChangeHandler = useCallback(
		(key: keyof ModuleFilter, value: ModuleFilter[keyof ModuleFilter]) => {
			setFilters((draft) => {
				const index = draft.findIndex((f) => f.id === filter.id);
				const filterCopy: ModuleFilter = cloneDeep(filter);
				if (index !== -1) {
					set(filterCopy, key, value);
					draft[index] = { ...filterCopy };
				}
			});
		},
		[filter, setFilters]
	);

	const filterSelectOptions = useMemo(() => {
		const fields = generateInitialFields([], modulePath);
		// return type from field, when Field has no filter type, ignore it

		console.log({ fields });
		return fields.map((field) => ({
			value: field.id,
			label: field.label,
			type: field.type
		}));
	}, [modulePath]);

	const changeHandler = useDebounceCallback(filterChangeHandler, 500);

	console.log({ filterSelectOptions });
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
					onChange={(e) => changeHandler("label", e.target.value)}
				/>
			</div>
			<div>
				<Select
					label="Feld"
					options={filterSelectOptions}
					value={filter.field}
					onChange={(e) => {
						changeHandler("field", e.value);
						changeHandler("type", e.type);
					}}
				/>
			</div>
			<div>
				<Select
					label="Operator"
					options={filterOperators(filter.type)}
					value={filter.operator}
					onChange={(e) => changeHandler("operator", e.value)}
				/>
			</div>
			{filter.operator === "template" && (
				<div>
					<label>Operator-Template (optional)</label>
					<textarea
						key={filter.operatorTemplate}
						defaultValue={filter.operatorTemplate}
						placeholder='{"equalTo": "{{value}}"}'
						rows={4}
						onChange={(e) =>
							changeHandler("operatorTemplate", e.target.value)
						}
					/>
					<InfoBox text="JSON-Struktur mit {{value}} als Platzhalter. Für Pointer: {\have\:{\objectId\:{\equalTo\:\{{value}}\}}}" />
				</div>
			)}
		</div>
	);
};

export default AppModuleEditFilter;
