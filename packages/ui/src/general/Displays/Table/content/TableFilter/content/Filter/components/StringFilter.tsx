"use client";

import { FC } from "react";
import { StringFilterProps } from "../types";
import { useDebounceCallback } from "usehooks-ts";
import { Select } from "@repo/ui";

const StringFilter: FC<StringFilterProps> = ({ onValueChange, options }) => {
	const debouncedOnValueChange = useDebounceCallback(onValueChange, 1000);

	if (
		options?.fixed &&
		options?.select_options?.length &&
		options?.select_options?.length > 0
	) {
		return (
			<div className="flex col gap-xs" style={{ paddingTop: "12px" }}>
				<Select
					options={options.select_options}
					onChange={(option) => onValueChange(option.value)}
				/>
			</div>
		);
	}
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
