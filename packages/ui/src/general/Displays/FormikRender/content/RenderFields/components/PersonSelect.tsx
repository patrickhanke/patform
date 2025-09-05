import React from "react";
import { PersonsSelect } from "@repo/modules";

interface PersonSelectProps {
	name: string;
	label?: string;
	onChange: (value: string) => void;
	values: { [key: string]: any };
	placeholder?: string;
	isHorizontal?: boolean;
}

const PersonSelect: React.FC<PersonSelectProps> = ({
	name,
	label,
	onChange,
	values,
	placeholder,
	isHorizontal
}) => {
	return (
		<div className={isHorizontal ? "form_horizontal_container" : ""}>
			<label htmlFor={name}>{label || name} </label>
			<PersonsSelect
				persons={values[name] || []}
				isMulti={true}
				onChange={onChange}
			/>
		</div>
	);
};

export default PersonSelect;
