import {
	LanguageValue,
	WebpageStructuredNodeMap,
	WebpageStructuredValueEntry
} from "@repo/types";

export type StructuredContentEditorProps = {
	schema: WebpageStructuredNodeMap;
	savedValues: WebpageStructuredValueEntry[];
	onSave: (values: WebpageStructuredValueEntry[]) => void | Promise<void>;
	/** Selected language. Omitted while editing the `default` schema (no path prefix). */
	language?: LanguageValue;
};
