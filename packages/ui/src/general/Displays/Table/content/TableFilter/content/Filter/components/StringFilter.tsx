"use client";

import { FC } from "react";
import { StringFilterProps } from "../types";
import { Select } from "@repo/ui";
import { Input } from "@chakra-ui/react";
import { useDebounceCallback, useDebounceValue } from "usehooks-ts";

const operatorOptions = [
	{ value: "equalTo", label: "ist gleich" },
	{ value: "matchesRegex", label: "enthält" },
	{ value: "notEqualTo", label: "ist nicht" }
];

const StringFilter: FC<StringFilterProps> = ({
	id,
	operator,
	value,
	onValueChange
}) => {
	const debouncedOnValueChange = useDebounceCallback(onValueChange, 1000);
	return (
		<div className="flex col gap-xs" style={{ paddingTop: "12px" }}>
			<div className="input-wrapper">
				<input
					type="text"
					onChange={(e) => debouncedOnValueChange(e.target.value)}
					placeholder="Wert eingeben..."
				/>
			</div>
		</div>
	);
};

export default StringFilter;
