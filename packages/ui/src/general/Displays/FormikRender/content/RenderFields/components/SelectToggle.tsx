import { FC } from "react";
import { SelectToggleProps } from "../types";
import { Switch } from "@chakra-ui/react";

const SelectToggle: FC<SelectToggleProps> = ({
	value,
	valueChangeHandler,
	disabled
}) => {
	return (
		<Switch.Root
			checked={value}
			onCheckedChange={({ checked }) => {
				valueChangeHandler(checked);
			}}
			disabled={disabled}
			size={"sm"}
			colorPalette={"green"}
		>
			<Switch.HiddenInput />
			<Switch.Control>
				<Switch.Thumb />
			</Switch.Control>
			<Switch.Label />
		</Switch.Root>
	);
};

export default SelectToggle;
