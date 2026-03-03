import { FC, useCallback, useMemo } from "react";
import { FilterProps } from "./types";
import { Check } from "lucide-react";
import { StringFilter } from "./components";
import transformOperatorValueToObject from "./functions/transformOperatorValueToString";

const Filter: FC<FilterProps> = ({
	id,
	type,
	label,
	operator,
	isActive,
	activeFilter,
	toggleFilter,
	updateFilterValue
}) => {
	const onValueChange = useCallback(
		(value: string) => {
			const transformedValue = transformOperatorValueToObject({
				type,
				operator,
				value
			});
			if (transformedValue) {
				updateFilterValue(id, transformedValue);
			}
		},
		[updateFilterValue, id, type, operator]
	);

	const renderFilterInput = useMemo(() => {
		if (type === "string") {
			return (
				<StringFilter
					id={id}
					operator={operator}
					isActive={isActive}
					activeFilter={activeFilter}
					toggleFilter={toggleFilter}
					onValueChange={onValueChange}
				/>
			);
		}
	}, [type, id, label, isActive, activeFilter, toggleFilter]);
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
