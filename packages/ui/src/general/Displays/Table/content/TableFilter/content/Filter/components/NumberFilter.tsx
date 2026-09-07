"use client";

import { FC } from "react";
import { NumberFilterProps } from "../types";
import { useDebounceCallback } from "usehooks-ts";

const NumberFilter: FC<NumberFilterProps> = ({
	onValueChange,
	value = "",
	label
}) => {
	const debouncedOnValueChange = useDebounceCallback(onValueChange, 400);

	return (
		<div className="flex col gap-xs">
			{label ? <label>{label}</label> : null}
			<div className="input-wrapper">
				<input
					type="number"
					defaultValue={
						value === null || value === undefined
							? ""
							: String(value)
					}
					onChange={(e) => {
						const nextValue = e.target.value;
						debouncedOnValueChange(
							nextValue === "" ? "" : Number(nextValue)
						);
					}}
					placeholder="Zahl eingeben..."
				/>
			</div>
		</div>
	);
};

export default NumberFilter;
