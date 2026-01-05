"use client";

import { FC } from "react";
import { BooleanFilterProps } from "./types";
import "../../styles.scss";

const BooleanFilter: FC<BooleanFilterProps> = ({ filter, onValueChange }) => {
	return (
		<div className="filter-row-content">
			<div className="boolean-toggle-container">
				<button
					className={`boolean-option ${filter.value === true ? "selected" : ""}`}
					onClick={() => onValueChange(true)}
					type="button"
				>
					Ja
				</button>
				<button
					className={`boolean-option ${filter.value === false ? "selected" : ""}`}
					onClick={() => onValueChange(false)}
					type="button"
				>
					Nein
				</button>
			</div>
		</div>
	);
};

export default BooleanFilter;
