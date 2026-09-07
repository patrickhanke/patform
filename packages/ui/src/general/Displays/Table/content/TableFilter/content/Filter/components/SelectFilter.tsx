import { FC } from "react";
import { SelectFilterProps } from "../types";
import { Select } from "@repo/ui";

const SelectFilter: FC<SelectFilterProps> = ({
	label,
	selectOptions,
	value,
	onChange,
	isMulti = false
}) => {
	const selectedValue = isMulti
		? selectOptions.filter((option) =>
				Array.isArray(value) ? value.includes(option.value) : false
			)
		: selectOptions.find((option) => option.value === value) || null;

	return (
		<div>
			<Select
				label={label}
				options={selectOptions}
				value={selectedValue}
				isMulti={isMulti}
				width="100%"
				onChange={(option) => {
					if (isMulti) {
						const selected = Array.isArray(option)
							? option
							: option
								? [option]
								: [];
						onChange(selected.map((item) => String(item.value)));
						return;
					}

					onChange(option?.value ? String(option.value) : "");
				}}
			/>
		</div>
	);
};

export default SelectFilter;
