"use client";

import { FC } from "react";
import { BooleanFilterProps } from "../types";

const BooleanFilter: FC<BooleanFilterProps> = ({
	label,
	value = false,
	onChange
}) => {
	return (
		<div className="filter-row-content">
			<label>{label}</label>
			<div className="boolean-toggle-container">
				<button
					className={`boolean-option ${value === true ? "selected" : ""}`}
					onClick={() => onChange(true)}
					type="button"
				>
					Ja
				</button>
				<button
					className={`boolean-option ${value === false ? "selected" : ""}`}
					onClick={() => onChange(false)}
					type="button"
				>
					Nein
				</button>
			</div>
		</div>
	);
};

export default BooleanFilter;
