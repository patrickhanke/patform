import { FC, useCallback } from "react";
import { SearchFilterProps } from "../types";
import StringFilter from "./StringFilter";
import { StatelessToggle } from "../../../../../../../Buttons";

const SearchFilter: FC<SearchFilterProps> = ({
	label,
	path,
	type,
	onValueChange,
	value = ""
}) => {
	const valueChangeHandler = useCallback(
		(value: boolean | string) => {
			const returnValue = `${path}:${value}`;
			onValueChange(returnValue);
		},
		[onValueChange, path]
	);

	console.log({ path, type, value });

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
};

export default SearchFilter;
