import { ClassProperties } from "./Classes";

export type WebpageComponentTable = {
	columns: { name: string; id: string; textAlign: string }[];
	rows: { data: { [key: number]: string }; id: string }[];
	settings: {
		title: string;
		description: string;
		footer: string;
		showHeader: boolean;
	};
};

export type WebpageComponentFaq = {
	settings: {
		title: string;
		description: string;
		footer: string;
		showHeader: boolean;
	};
	elements: {
		header: string;
		content: string;
	}[];
};

export type WebpageComponents = WebpageComponentTable | WebpageComponentFaq;

export type ContentType = "text" | "image" | "video" | "table" | "faq";

export type ContentClass = ClassProperties & {
	type: ContentType;
	/** Inline / simple content payload when applicable */
	content?: string;
	title: string;
	active: boolean;
	content_id: string;
	/** Structured component data (table, faq, …) */
	data?: WebpageComponents | Record<string, unknown>;
};
