export type CheckboxProps = {
	checked: boolean;
	onChange: (checked: boolean) => void;
	label?: string | React.ReactNode;
	name: string;
	required?: string;
};

export type CheckboxGroupProps = {
	items: {
		value: string;
		label: string;
	}[];
	onChange: (value: string[]) => void | Promise<void>;
	defaultValue?: string[];
};
