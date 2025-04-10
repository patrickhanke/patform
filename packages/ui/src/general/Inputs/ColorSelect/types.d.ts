import colors from "./constants/colors";

export type ColorValues = (typeof colors)[number]["value"];

export type ColorSelectProps = {
	value: ColorValues;
	onChange: (color: ColorValues) => void;
};
