"use client";

import { FC } from "react";
import { StringFilterProps } from "./types";
import { Select } from "@repo/ui";
import "../../styles.scss";
import { Input } from "@chakra-ui/react";

const operatorOptions = [
	{ value: "equalTo", label: "ist gleich" },
	{ value: "matchesRegex", label: "enthält" },
	{ value: "notEqualTo", label: "ist nicht" }
];

const StringFilter: FC<StringFilterProps> = ({
	filter,
	onValueChange,
	onOperatorChange,
	hideOperator
}) => {
	return (
		<div className="flex col gap-xs" style={{ paddingTop: "12px" }}>
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
				<Input
					type="text"
					value={(filter.value as string) || ""}
					onChange={(e) => onValueChange(e.target.value)}
					placeholder="Wert eingeben..."
					size="xs"
				/>
			</div>
		</div>
	);
};

export default StringFilter;
