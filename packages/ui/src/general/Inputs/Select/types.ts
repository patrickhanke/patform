import { ErrorMessage } from "@repo/types";

export type SelectOption = {
	value: string | number | boolean | object | null;
	label: string;
	isDisabled?: boolean;
	[key: string]: unknown;
};

export type SelectOptionGroup = {
	label: string;
	options: SelectOption[];
};

export type SelectType = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onChange: (values: any) => void;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	value?: any;
	placeholder?: string;
	options: ReadonlyArray<SelectOption | SelectOptionGroup> | undefined;
	isMulti?: boolean;
	isDisabled?: boolean;
	isClearable?: boolean;
	menuPosition?: "fixed" | "absolute";
	label?: string;
	errors?: ErrorMessage[];
	id?: string;
	width?: number | string;
};
