import { WebpageComponents } from "@repo/types";

export type TableColumnEditWebpageComponentsProps = {
	type: "table" | "faq";
	initialData: WebpageComponentTable;
	onChange: (value: WebpageComponents) => void;
};