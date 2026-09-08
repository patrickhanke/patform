export type TableColumnDeleteFieldProps = {
	objectId: string;
	className: string;
	refetch: () => void;
	useMasterKey?: boolean;
	disabled?: boolean;
};

export type TableColumnDeleteFieldComponent = (
	params: TableColumnDeleteFieldProps
) => ReactElement;
