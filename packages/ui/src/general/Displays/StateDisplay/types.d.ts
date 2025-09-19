import { IconTypes } from "../Icon";

export type StateDisplayProps = {
	label: string;
	color: string;
	icon?: IconTypes;
	onClick?: () => void;
	width?: string;
};
