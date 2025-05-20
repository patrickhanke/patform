"use client";

import ReactSelect from "react-select";
import { SelectType } from "./types";
import "./styles.scss";
import customStyles from "./constants/styles";
import { ErrorDisplay } from "../../Displays";
import { isArray } from "lodash-es";

const Select = ({
	onChange,
	value,
	placeholder,
	options,
	isMulti = false,
	isDisabled = false,
	isClearable = false,
	label,
	id,
	errors,
	width = 150
}: SelectType) => {
	const valueBoundryHandler = (value: object | string | null) => {
		if (isArray(value)) {
			return value.map(
				(val: string) =>
					options?.find((option) => option.value === val) || null
			);
		} else {
			if (typeof value === "object" && value !== null) {
				return value;
			} else if (typeof value === "string") {
				return (
					options?.find((option) => option.value === value) || null
				);
			}
		}
		return value;
	};

	return (
		<div style={{ position: "relative" }}>
			{label && <label htmlFor={id}>{label}</label>}
			<ReactSelect
				id={id}
				value={valueBoundryHandler(value)}
				onChange={(inputValue, action) => onChange(inputValue, action)}
				options={options}
				isMulti={isMulti}
				isDisabled={isDisabled}
				isClearable={isClearable}
				placeholder={placeholder}
				className={"react_select_container"}
				classNamePrefix="react-select"
				styles={customStyles({ width })}
				menuPortalTarget={
					typeof window !== "undefined" ? document.body : undefined
				}
				menuPosition="fixed"
				menuPlacement="auto"
			/>
			<ErrorDisplay errors={errors} id={id} />
		</div>
	);
};

export default Select;
