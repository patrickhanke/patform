import { ClassProperties } from "./Classes";
import type { WebpageComponents } from "./Website";

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
