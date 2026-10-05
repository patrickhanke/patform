import { parseColor } from "@chakra-ui/react";

export type ColorPickerProps = {
	value: string;
	onChange: (value: string) => void;
	isOverlay?: boolean;
};

export type ProjectColorSwatch = {
	id: string;
	label: string;
	color: ReturnType<typeof parseColor>;
};
