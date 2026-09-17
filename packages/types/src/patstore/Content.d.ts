import { ContentBlock } from "@repo/ui";
import { ClassProperties } from "./Classes";

export type WebpageComponentSettings = {
	title: string;
	description: string;
	footer: string;
	showHeader: boolean;
};

export type EmailContentComponent = {
	content: ContentBlock[];
};

export type WebpageComponentText = {
	html: string;
};

export type WebpageComponentImage = {
	src: string;
	alt: string;
	caption: string;
};

export type WebpageComponentVideo = {
	src: string;
};

export type WebpageComponentTable = {
	columns: { name: string; id: string; textAlign: string }[];
	rows: { data: { [key: number]: string }; id: string }[];
	settings: WebpageComponentSettings;
};

export type WebpageComponentFaq = {
	settings: WebpageComponentSettings;
	elements: {
		id: string;
		header: string;
		content: string;
	}[];
};

export type WebpageComponents =
	| WebpageComponentText
	| WebpageComponentImage
	| WebpageComponentVideo
	| WebpageComponentTable
	| WebpageComponentFaq
	| EmailContentComponent;

export type ContentType =
	| "text"
	| "image"
	| "video"
	| "table"
	| "faq"
	| "email";

export type ContentClass = ClassProperties & {
	type: ContentType;
	title: string;
	active: boolean;
	content_id: string;
	/** Structured component data (text, image, video, table, faq, …) */
	data?: WebpageComponents | Record<string, unknown>;
};
