"use client";

import { FC } from "react";
import { FilterInputProps } from "./types";
import { Select } from "@repo/ui";
import "../../styles.scss";

const operatorOptions = [
	{ value: "notEqualTo", label: "existiert" },
	{ value: "equalTo", label: "existiert nicht" }
];

const ImageFilter: FC<FilterInputProps> = ({
	filter,
	onValueChange,
	onOperatorChange
}) => {
	// For image/file existence checks, value is empty string for "exists" check
	// The operator determines the logic: _ne (not equal to empty) = exists
	return (
		<div className="filter-row-content">
			<div className="select-wrapper">
				<Select
					id={`operator-${filter.key}`}
					value={filter.operator}
					onChange={(option) => {
						onOperatorChange(option.value);
						onValueChange("");
					}}
					options={operatorOptions}
					placeholder="Operator"
					width={160}
				/>
			</div>
		</div>
	);
};

export default ImageFilter;
