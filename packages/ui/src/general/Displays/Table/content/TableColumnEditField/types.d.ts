import { Field } from "@repo/types";

export type TableColumnEditFieldProps = {
	objectId: string;
	className: string;
	dataFields: Field[];
	type?: "data" | "setting";
};

export type TableColumnEditFieldComponent = (
	params: TableColumnEditFieldProps
) => React.JSX.Element;
