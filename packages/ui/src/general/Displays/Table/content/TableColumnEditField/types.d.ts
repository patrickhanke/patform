import { Field } from "@repo/ui";

export type TableColumnEditFieldProps = {
	objectId: string;
	className: string;
	dataFields: Field[];
	type?: "data" | "setting";
};

export type TableColumnEditFieldComponent = (
	params: TableColumnEditFieldProps
) => React.JSX.Element;
