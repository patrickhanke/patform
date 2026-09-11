export type StructuredContentEditorProps = {
	schema: WebpageStructuredSchema;
	savedValues: WebpageStructuredValueEntry[];
	onSave: (values: WebpageStructuredValueEntry[]) => void | Promise<void>;
};
