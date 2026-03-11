import { FC } from "react";
import { SelectFilterProps } from "../types";
import { Select } from "@repo/ui";

const SelectFilter: FC<SelectFilterProps> = ({
	label,
	selectOptions,
	value,
	onChange
}) => {
	return (
		<div>
			<Select
				label={label}
				options={selectOptions}
				value={selectOptions.find((option) => option.value === value)}
				onChange={(option) => onChange(option.value)}
			/>
		</div>
	);
};

export default SelectFilter;
