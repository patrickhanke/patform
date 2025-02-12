export type SelectElement = {
    value: string;
    label: string;
    element?: ReactNode
} & any

export type ElementSelectInterfaceProps = {
    title?: string,
    elements: SelectElement[],
    selectedElements: SelectElement[],
    onSelect: (elements: SelectElement[]) => void,
    min?: number,
    max?: number,
    isSearchable?: boolean 
};

export type ListElementProps = {
    element : SelectElement,
    isSelected: boolean,
    onSelect: (element: SelectElement) => void
};