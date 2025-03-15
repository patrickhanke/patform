export type SelectElement = {
  value: string;
  label: string;
  element?: ReactNode;
  selected?: boolean;
  single?: boolean;
  disabled?: boolean;
  [key: string]: any;
};

export type ElementSelectInterfaceProps = {
  title?: string;
  elements: SelectElement[];
  selectedElements: SelectElement[];
  onSelect: (elements: SelectElement[]) => void;
  min?: number;
  max?: number;
  isSearchable?: boolean;
  selectProperty?: boolean;
};

export type ListElementProps = {
  element: SelectElement;
  isSelected: boolean;
  onSelect: (element: SelectElement) => void;
};
