import { useCallback } from "react";
import { AppModuleEditFilterProps } from "../types";
import { InfoBox, Select } from "@repo/ui";
import { useDebounceCallback } from "usehooks-ts";
import { cloneDeep, set } from "lodash-es";
import filterFieldTypes from "../constants/filterFieldTypes";
import filterOperators from "../constants/filterOperators";
import type { ModuleFilter } from "../types";

const AppModuleEditFilter = ({
	filter,
	setFilters
}: AppModuleEditFilterProps) => {
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

	const changeHandler = useDebounceCallback(filterChangeHandler, 500);

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
				<label>Feld</label>
				<input
					key={filter.field}
					type="text"
					defaultValue={filter.field}
					placeholder="title, location, categories, ..."
					onChange={(e) => changeHandler("field", e.target.value)}
				/>
				<InfoBox text="GraphQL-Feldname (z.B. title, location, module)" />
			</div>
			<div>
				<Select
					label="Feldtyp"
					options={filterFieldTypes}
					value={filter.type}
					onChange={(e) => changeHandler("type", e.value)}
				/>
				<InfoBox text="Schema-Typ des Felds (String, Pointer, Array, etc.)" />
			</div>
			<div>
				<Select
					label="Operator"
					options={filterOperators}
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
