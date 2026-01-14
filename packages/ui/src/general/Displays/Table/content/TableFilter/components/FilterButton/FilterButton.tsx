"use client";

import { FC } from "react";
import { FilterButtonProps } from "./types";
import { Filter } from "lucide-react";
import "../../styles.scss";

const FilterButton: FC<FilterButtonProps> = ({
	activeFilterCount,
	onClick
}) => {
	return (
		<button
			className="filter-button-trigger"
			onClick={onClick}
			data-active={activeFilterCount > 0}
			type="button"
		>
			<Filter size={14} />
			<span>Filter</span>
			{activeFilterCount > 0 && (
				<span className="active-filter-count">{activeFilterCount}</span>
			)}
		</button>
	);
};

export default FilterButton;
