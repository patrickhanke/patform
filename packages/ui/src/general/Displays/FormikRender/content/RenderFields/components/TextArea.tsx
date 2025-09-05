import React from "react";

interface TextAreaProps {
	name: string;
	label?: string;
	id?: string;
	handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
	values: { [key: string]: any };
	handleBlur: (value: string) => void;
	placeholder?: string;
	isHorizontal?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
	name,
	label,
	id,
	handleChange,
	values,
	handleBlur,
	placeholder,
	isHorizontal
}) => {
	return (
		<div className={isHorizontal ? "form_horizontal_container" : ""}>
			<label htmlFor={name}>{label || name} </label>
			<textarea
				id={id}
				name={name}
				onChange={handleChange}
				defaultValue={values[name] || ""}
				onBlur={(e) => handleBlur(e.target.value)}
				placeholder={placeholder}
				key={name}
				style={{ minWidth: "240px", minHeight: "80px" }}
			/>
		</div>
	);
};

export default TextArea;
