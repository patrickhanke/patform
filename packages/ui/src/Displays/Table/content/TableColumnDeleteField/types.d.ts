export type TableColumnDeleteFieldProps = {
    objectId: string;
    className: string;
    refetch: () => void;
}

export type TableColumnDeleteFieldComponent = (params: TableColumnDeleteFieldProps) => ReactElement;
