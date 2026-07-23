import { FC, useCallback, useMemo } from "react";
import { FilterProps, OnValueChange } from "./types";
import { Check } from "lucide-react";
import {
	BooleanFilter,
	IdFilter,
	SearchFilter,
	StringFilter
} from "./components";
import transformOperatorValueToObject from "./functions/transformOperatorValueToString";
import SelectFilter from "./components/SelectFilter";
import { StatelessToggle } from "@repo/ui";

const Filter: FC<FilterProps> = ({
	id,
	type,
	label,
	operator,
	isActive,
	activeFilter,
	toggleFilter,
	updateFilterValue,
	options
}) => {
	const onValueChange: OnValueChange = useCallback(
		(value) => {
			if (value) {
				updateFilterValue(id, value);
			} else {
				updateFilterValue(id, null);
			}
		},
		[updateFilterValue, id, type, operator]
	);

	const renderFilterInput = useMemo(() => {
		if (!activeFilter) {
			return null;
		}
		if (isActive && type === "string" && options?.fixed) {
			return (
				<SelectFilter
					label={label || ""}
					selectOptions={options?.select_options || []}
					value={activeFilter.value as string}
					onChange={onValueChange}
				/>
			);
		} else if (type === "string" && operator === "exists") {
			return (
				<StatelessToggle
					value={activeFilter.value as boolean}
					onChange={(value) => onValueChange(value as boolean)}
				/>
			);
		} else if (type === "string") {
			return <StringFilter onValueChange={onValueChange} />;
		}
		if (isActive && type === "boolean") {
			return (
				<BooleanFilter
					label={label || ""}
					value={activeFilter.value as boolean}
					onChange={onValueChange}
				/>
			);
		}

		if (
			isActive &&
			(type === "id" || type === "ids" || type === "pointer")
		) {
			return (
				<IdFilter
					label={label || ""}
					className={options?.class_name}
					value={activeFilter.value as string | string[]}
					onValueChange={onValueChange}
					type={type}
					isMulti={type === "pointer" ? false : operator === "in"}
				/>
			);
		}
		if (isActive && type === "search") {
			return (
				<SearchFilter
					label={label || ""}
					path={options?.search_path || ""}
					type={options?.type || "input"}
					value={activeFilter.value as string}
					onValueChange={onValueChange}
					selectOptions={options?.select_options || []}
				/>
			);
		}
		return null;
	}, [type, id, label, isActive, activeFilter, toggleFilter, options]);

	return (
		<div key={id} className="filter-select-item" data-selected={isActive}>
			<button
				type="button"
				className="filter-select-button"
				onClick={() => toggleFilter(id)}
				data-selected={isActive}
			>
				<div className="filter-select-checkbox">
					{isActive && <Check size={14} />}
				</div>
				<div className="filter-select-info">
					<span className="filter-select-label">{label}</span>
					<span className="filter-select-type">{type}</span>
				</div>
			</button>

			{isActive && activeFilter && (
				<div className="filter-input-section">{renderFilterInput}</div>
			)}
		</div>
	);
};

export default Filter;
