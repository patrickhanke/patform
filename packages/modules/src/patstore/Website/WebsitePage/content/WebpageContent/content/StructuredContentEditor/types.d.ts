import {
	LanguageValue,
	WebpageStructuredNodeMap,
	WebpageStructuredValueEntry
} from "@repo/types";

export type StructuredContentEditorProps = {
	schema: WebpageStructuredNodeMap;
	savedValues: WebpageStructuredValueEntry[];
	onSave: (values: WebpageStructuredValueEntry[]) => void | Promise<void>;
	/** Path prefix for saved values. Omitted when entries are stored without a locale prefix. */
	language?: LanguageValue | string;
};
