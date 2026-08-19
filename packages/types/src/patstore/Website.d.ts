import { ClassProperties } from "./Classes";

export type WebpageStructuredFieldType =
	| "text"
	| "richtext"
	| "image"
	| "link"
	| "collection"
	| "file";

export type WebpageStructuredLinkValue = {
	text: string;
	href: string;
};

export type WebpageStructuredFieldSchema = {
	type: WebpageStructuredFieldType;
	label: string;
	default?: unknown;
	/**
	 * Collection item schema (`type === "collection"`).
	 * Matches @patstore/cms-content-plugin: `{ fields, default: [...] }`.
	 */
	fields?: WebpageStructuredSchema;
	/** @deprecated Prefer `fields` for collections; kept for older schemas. */
	content?: WebpageStructuredSchema;
};

export type WebpageStructuredContainerSchema = {
	type: WebpageStructuredContainerType;
	label: string;
	content: WebpageStructuredSchema;
};

export type WebpageStructuredContainerType =
	| "section"
	| "header"
	| "article"
	| "aside"
	| "nav"
	| "footer"
	| "main"
	| "div"
	| (string & {});

export type WebpageStructuredSchemaNode =
	| WebpageStructuredFieldSchema
	| WebpageStructuredContainerSchema;

export type WebpageStructuredSchema = Record<
	string,
	WebpageStructuredSchemaNode
>;

export type WebpageStructuredValueEntry = {
	path: string;
	value: unknown;
};

export type WebpageClass = ClassProperties & {
	path: string;
	title: string;
	type: string;
	subtitle: string;
	content: WebpageContent[] | WebpageStructuredValueEntry[];
	page_content?: WebpageStructuredSchema;
	page_data?: WebpageStructuredValueEntry[];
	active: boolean;
	image: string;
	documents: string[];
};

export type WebpageContentText = {
	name: string;
	id: string;
	type: "text";
	position: number;
	active: boolean;
	value?: string;
};

export type WebpageContentImage = {
	name: string;
	id: string;
	type: "image";
	position: number;
	active: boolean;
	value?: string;
};

export type WebpageContentVideo = {
	name: string;
	id: string;
	type: "video";
	position: number;
	active: boolean;
	value?: string;
};

export type WebpageContentTable = {
	name: string;
	id: string;
	type: "table";
	position: number;
	active: boolean;
	value?: string;
};

export type WebpageContentDivider = {
	name: string;
	id: string;
	type: "divider";
	position: number;
	active: boolean;
	value?: {
		size: "small" | "medium" | "large";
		showLine: boolean;
	};
};

export type WebpageSectionHtmlTag =
	| "section"
	| "article"
	| "aside"
	| "nav"
	| "header"
	| "footer"
	| "main"
	| "div";

export type WebpageSpacingScale =
	| "xxs"
	| "xs"
	| "sm"
	| "md"
	| "lg"
	| "xl"
	| "xxl";

export type WebpageContentStyle = {
	padding?: WebpageSpacingScale;
	margin?: WebpageSpacingScale;
	backgroundColor?: string;
	color?: string;
	flex?: {
		alignItems?: string;
		justifyContent?: string;
		gap?: WebpageSpacingScale;
		wrap?: boolean;
		changeToColumn?: boolean;
	};
};

export type WebpageContentSection = {
	name: string;
	id: string;
	type: "section";
	position: number;
	active: boolean;
	value?: string;
	children?: WebpageContent[][];
	style?: WebpageContentStyle;
	config?: {
		htmlTag?: WebpageSectionHtmlTag;
	};
};

/** Reference to a reusable Content class row (loaded by objectId on the website). */
export type WebpageContentReference = {
	name: string;
	id: string;
	type: "content";
	position: number;
	active: boolean;
	/** Content.objectId */
	value: string;
	style?: WebpageContentStyle;
	config?: {
		contentTitle?: string;
		contentType?: string;
		contentId?: string;
	};
};

export type WebpageContent =
	| WebpageContentText
	| WebpageContentImage
	| WebpageContentVideo
	| WebpageContentTable
	| WebpageContentDivider
	| WebpageContentSection
	| WebpageContentReference;
