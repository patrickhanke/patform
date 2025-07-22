export type SelectElement = {
	value: string;
	label: string;
	element?: ReactNode;
	selected?: boolean;
	single?: boolean;
	disabled?: boolean;
	[key: string]: object | Array<> | string | number | boolean;
};

export type ElementSelectInterfaceProps = {
	title?: string;
	elements: SelectElement[];
	selectedElements: SelectElement[];
	onSelect: (elements: SelectElement[]) => void;
	max?: number;
	isSearchable?: boolean;
	selectProperty?: boolean;
	useTiles?: boolean;
	selectAll?: boolean;
};

export type ListElementProps = {
	element: SelectElement;
	isSelected: boolean;
	onSelect: (element: SelectElement) => void;
	useTiles?: boolean;
};
