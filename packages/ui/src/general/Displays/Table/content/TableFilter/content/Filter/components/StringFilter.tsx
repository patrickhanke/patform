"use client";

import { FC } from "react";
import { StringFilterProps } from "../types";
import { useDebounceCallback } from "usehooks-ts";

const StringFilter: FC<StringFilterProps> = ({
	onValueChange,
	value = "",
	label
}) => {
	const debouncedOnValueChange = useDebounceCallback(onValueChange, 1000);

	return (
		<div
			className="flex col gap-xs"
			style={{ paddingTop: label ? 0 : "12px" }}
		>
			{label ? <label>{label}</label> : null}
			<div className="input-wrapper">
				<input
					type="text"
					defaultValue={typeof value === "string" ? value : ""}
					onChange={(e) => debouncedOnValueChange(e.target.value)}
					placeholder="Wert eingeben..."
				/>
			</div>
		</div>
	);
};

export default StringFilter;
