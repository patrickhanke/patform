export type TableColumnDeleteFieldProps = {
	objectId: string;
	className: string;
	refetch: () => void;
	useMasterKey?: boolean;
};

export type TableColumnDeleteFieldComponent = (
	params: TableColumnDeleteFieldProps
) => ReactElement;
