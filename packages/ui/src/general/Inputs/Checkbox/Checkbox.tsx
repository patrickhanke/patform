import React from "react";
import { Checkbox as ChakraCheckbox } from "@chakra-ui/react";
import { CheckboxProps } from "./types";

const Checkbox: React.FC<CheckboxProps> = ({
	checked,
	onChange,
	label,
	name,
	required = false
}) => {
	const handleChange = (details: boolean | string) => {
		if (typeof details === "string") {
			onChange(details === "true");
		} else {
			onChange(details);
		}
	};

	return (
		<ChakraCheckbox.Root
			checked={checked}
			onCheckedChange={(event) => handleChange(event.checked)}
			className="button_container"
		>
			<ChakraCheckbox.HiddenInput name={name} />
			<ChakraCheckbox.Control>
				<ChakraCheckbox.Indicator />
			</ChakraCheckbox.Control>
			<label htmlFor={name}>
				{label}
				{!!required && <span>*</span>}
			</label>
		</ChakraCheckbox.Root>
	);
};
export default Checkbox;
