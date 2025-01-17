export type SelectElement = {
    value: string;
    label: string;
    element?: ReactNode
} & any

export type ElementSelectInterfaceProps = {
    elements: SelectElement[],
    selectedElements: SelectElement[],
    onSelect: (elements: SelectElement[]) => void,
    min?: number,
    max?: number

};

export type ListElementProps = {
    element : SelectElement,
    isSelected: boolean,
    onSelect: (element: SelectElement) => void
};