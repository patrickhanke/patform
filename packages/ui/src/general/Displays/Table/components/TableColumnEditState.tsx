import { StateSelect } from "@repo/ui";
import { TableColumnEditStateProps } from "../types";
import { isArray } from "lodash-es";

const TableColumnEditState = ({
	value,
	isEditable,
	onChange,
	options = []
}: TableColumnEditStateProps) => {
	return (
		<div>
			{isEditable ? (
				<StateSelect
					type="state"
					state={value}
					stateOptions={options}
					stateSelectHandler={(state) => {
						onChange(state);
					}}
					isDisabled={!isEditable}
				/>
			) : (
				<div>
					{isArray(options) &&
						options.find((option) => option.value === value)?.label}
				</div>
			)}
		</div>
	);
};

export default TableColumnEditState;
