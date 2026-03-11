import { FC, useCallback } from "react";
import { SearchFilterProps } from "../types";
import StringFilter from "./StringFilter";
import { StatelessToggle } from "../../../../../../../Buttons";
import SelectFilter from "./SelectFilter";

const SearchFilter: FC<SearchFilterProps> = ({
	label,
	path,
	type,
	onValueChange,
	value = "",
	selectOptions = []
}) => {
	const valueChangeHandler = useCallback(
		(value: boolean | string) => {
			const returnValue = `${path}:${value}`;
			onValueChange(returnValue);
		},
		[onValueChange, path]
	);


	if (!type) {
		return null;
	}
	if (type === "input") {
		return <StringFilter onValueChange={valueChangeHandler} />;
	}
	if (type === "toggle") {
		const toggleValue =
			value?.length > 5 ? value?.slice(-4) === "true" : false;

		console.log({ toggleValue });
		return (
			<div className="flex row a-ce j-sb gap-xs">
				<label>{label}</label>
				<StatelessToggle
					value={toggleValue}
					onChange={valueChangeHandler}
				/>
			</div>
		);
	}
	if (type === "select" && selectOptions?.length > 0) {
		return (
			<SelectFilter
				label={label}
				selectOptions={selectOptions}
				value={value}
				onChange={valueChangeHandler}
			/>
		);
	}
};

export default SearchFilter;
