export type TableColumnEditWebpageComponentsProps = {
	type: "table" | "faq";
	initialData: WebpageComponents;
	onChange: (value: WebpageContent[]) => void;
};