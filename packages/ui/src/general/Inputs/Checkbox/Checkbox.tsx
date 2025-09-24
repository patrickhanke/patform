import React from "react";
import { Checkbox as ChakraCheckbox } from "@chakra-ui/react";
import { CheckboxProps } from "./types";

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label }) => {
	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		onChange(event.target.checked);
	};

	return (
		<ChakraCheckbox.Root>
			<ChakraCheckbox.HiddenInput />
			<ChakraCheckbox.Control>
				<ChakraCheckbox.Indicator />
			</ChakraCheckbox.Control>
			<ChakraCheckbox.Label />
		</ChakraCheckbox.Root>
	);
};
export default Checkbox;
