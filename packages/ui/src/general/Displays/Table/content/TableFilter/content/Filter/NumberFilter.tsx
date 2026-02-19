"use client";

import { FC } from "react";
import { NumberFilterProps } from "./types";
import { Select } from "@repo/ui";
import "../../styles.scss";

const operatorOptions = [
	{ value: "equalTo", label: "ist gleich" },
	{ value: "greaterThan", label: "größer als" },
	{ value: "lessThan", label: "kleiner als" },
	{ value: "greaterThanOrEqualTo", label: "größer oder gleich" },
	{ value: "lessThanOrEqualTo", label: "kleiner oder gleich" }
];

const NumberFilter: FC<NumberFilterProps> = ({
	filter,
	onValueChange,
	onOperatorChange,
	hideOperator
}) => {
	return (
		<div className="filter-row-content">
			{!hideOperator && (
				<div className="select-wrapper">
					<Select
						id={`operator-${filter.id}`}
						value={filter.operator}
						onChange={(option) => onOperatorChange(option.value)}
						options={operatorOptions}
						placeholder="Operator"
						width={160}
					/>
				</div>
			)}
			<div className="input-wrapper">
				<input
					type="number"
					value={(filter.value as number) || ""}
					onChange={(e) =>
						onValueChange(
							e.target.value ? Number(e.target.value) : ""
						)
					}
					placeholder="Wert eingeben..."
				/>
			</div>
		</div>
	);
};

export default NumberFilter;
