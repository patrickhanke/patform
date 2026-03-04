import { FC, useCallback, useMemo } from "react";
import { FilterProps, OnValueChange } from "./types";
import { Check } from "lucide-react";
import { IdFilter, SearchFilter, StringFilter } from "./components";
import transformOperatorValueToObject from "./functions/transformOperatorValueToString";

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
			console.log({ value });
			const transformedValue = transformOperatorValueToObject({
				type,
				operator,
				value
			});
			if (transformedValue) {
				updateFilterValue(id, transformedValue);
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
		if (isActive && type === "string") {
			return <StringFilter onValueChange={onValueChange} />;
		}
		if (isActive && type === "id") {
			return (
				<IdFilter
					label={label || ""}
					className={options?.class_name}
					value={activeFilter.value as string | string[]}
					onValueChange={onValueChange}
					isMulti={operator === "in"}
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
				/>
			);
		}
		return null;
	}, [type, id, label, isActive, activeFilter, toggleFilter, options]);

	console.log({ options });

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
