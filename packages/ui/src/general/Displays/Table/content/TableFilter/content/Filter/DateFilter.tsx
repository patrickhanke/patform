"use client";

import { FC } from "react";
import { DateFilterProps } from "./types";
import { Select } from "@repo/ui";
import "../../styles.scss";

const operatorOptions = [
	{ value: "equalTo", label: "ist gleich" },
	{ value: "greaterThan", label: "nach" },
	{ value: "lessThan", label: "vor" },
	{ value: "greaterThanOrEqualTo", label: "ab" },
	{ value: "lessThanOrEqualTo", label: "bis" }
];

const DateFilter: FC<DateFilterProps> = ({
	filter,
	onValueChange,
	onOperatorChange,
	hideOperator
}) => {
	const formatDateValue = (value: unknown): string => {
		if (!value) return "";
		if (value instanceof Date) {
			return value.toISOString().split("T")[0] || "";
		}
		if (typeof value === "string") {
			return value.split("T")[0] || "";
		}
		return "";
	};

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
						width={140}
					/>
				</div>
			)}
			<div className="input-wrapper">
				<input
					type="date"
					value={formatDateValue(filter.value)}
					onChange={(e) => onValueChange(e.target.value)}
				/>
			</div>
		</div>
	);
};

export default DateFilter;
