"use client";

import { FC } from "react";
import { StringFilterProps } from "../types";
import { useDebounceCallback } from "usehooks-ts";

const StringFilter: FC<StringFilterProps> = ({ onValueChange }) => {
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
