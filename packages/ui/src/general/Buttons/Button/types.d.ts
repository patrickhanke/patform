import { ButtonProps } from "@chakra-ui/react";

export type ButtonProps = {
	maxWidth?: number;
	minWidth?: number;
	isLink?: boolean;
	isDarkButton?: boolean;
	onClick?: () => void;
	disabled?: boolean;
	link?: string;
	isBlank?: boolean;
	text?: string;
	noBorder?: boolean;
	size?: number;
	color?: ButtonProps["color"];
	loading?: boolean;
	type?: "button" | "submit" | "reset";
};
