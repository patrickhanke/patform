import type { CSSProperties } from "react";
import type { ContentBlock } from "../ContentEditor";

export type TextBlockKind = "heading" | "paragraph" | "list";
export type TextAlign = "left" | "center" | "right" | "justify";
export type TextDirection = "ltr" | "rtl";
export type ListType = "ul" | "ol";

export const FONT_SIZE_OPTIONS: { value: string; label: string }[] = [
	{ value: "", label: "Standard" },
	{ value: "12px", label: "12 px" },
	{ value: "14px", label: "14 px" },
	{ value: "16px", label: "16 px" },
	{ value: "18px", label: "18 px" },
	{ value: "20px", label: "20 px" },
	{ value: "24px", label: "24 px" },
	{ value: "28px", label: "28 px" },
	{ value: "32px", label: "32 px" },
	{ value: "40px", label: "40 px" },
	{ value: "48px", label: "48 px" }
];

export const TEXT_ALIGN_OPTIONS: { value: TextAlign; label: string }[] = [
	{ value: "left", label: "Links" },
	{ value: "center", label: "Zentriert" },
	{ value: "right", label: "Rechts" },
	{ value: "justify", label: "Blocksatz" }
];

export const TEXT_DIRECTION_OPTIONS: {
	value: TextDirection;
	label: string;
}[] = [
	{ value: "ltr", label: "Links nach rechts" },
	{ value: "rtl", label: "Rechts nach links" }
];

export const HEADING_LEVEL_OPTIONS: {
	value: NonNullable<ContentBlock["config"]>["headingLevel"];
	label: string;
}[] = [
	{ value: "h1", label: "Überschrift 1" },
	{ value: "h2", label: "Überschrift 2" },
	{ value: "h3", label: "Überschrift 3" },
	{ value: "h4", label: "Überschrift 4" },
	{ value: "h5", label: "Überschrift 5" },
	{ value: "h6", label: "Überschrift 6" }
];

export const getTextKind = (block: ContentBlock): TextBlockKind => {
	const kind = block.config?.textType;
	if (kind === "heading" || kind === "list") return kind;
	return "paragraph";
};

export const unwrapTextHtml = (html: string): string => {
	const trimmed = (html || "").trim();
	const match = trimmed.match(
		/^<(h[1-6]|p|ul|ol)(?:\s[^>]*)?>([\s\S]*)<\/\1>$/i
	);
	if (match) return match[2] ?? "";
	return trimmed;
};

export const wrapTextHtml = (
	html: string,
	kind: TextBlockKind,
	options?: {
		headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
		listType?: ListType;
	}
): string => {
	const inner = unwrapTextHtml(html);
	if (kind === "heading") {
		const tag = options?.headingLevel || "h2";
		return `<${tag}>${inner || "Titel"}</${tag}>`;
	}
	if (kind === "list") {
		const tag = options?.listType || "ul";
		const listInner = /<li[\s>]/i.test(inner)
			? inner
			: `<li>${inner || "Listeneintrag"}</li>`;
		return `<${tag}>${listInner}</${tag}>`;
	}
	return `<p>${inner || "Text eingeben…"}</p>`;
};

export const getTextTypographyStyle = (
	config: ContentBlock["config"] | undefined
): CSSProperties => ({
	fontSize: config?.fontSize || undefined,
	textAlign: (config?.textAlign as CSSProperties["textAlign"]) || undefined,
	direction: config?.textDirection || undefined
});

export const getTextTypographyStyleString = (
	config: ContentBlock["config"] | undefined
): string => {
	const parts: string[] = [];
	if (config?.fontSize) parts.push(`font-size: ${config.fontSize}`);
	if (config?.textAlign) parts.push(`text-align: ${config.textAlign}`);
	if (config?.textDirection) parts.push(`direction: ${config.textDirection}`);
	return parts.join("; ");
};

/** Keep existing markup; wrap legacy plain values in the matching tag. */
export const ensureTextMarkup = (block: ContentBlock): string => {
	const kind = getTextKind(block);
	const raw = String(block.value || "");
	const trimmed = raw.trim();

	if (kind === "heading") {
		if (/^<h[1-6][\s>]/i.test(trimmed)) return raw;
		const tag = block.config?.headingLevel || "h2";
		return `<${tag}>${raw}</${tag}>`;
	}

	if (kind === "list") {
		if (/^<(ul|ol)[\s>]/i.test(trimmed)) return raw;
		const tag = block.config?.listType || "ul";
		const inner = trimmed ? raw : "<li>Listeneintrag</li>";
		return `<${tag}>${inner}</${tag}>`;
	}

	if (/^<(p|div|h[1-6]|ul|ol)[\s>]/i.test(trimmed)) return raw;
	return trimmed ? `<p>${raw}</p>` : "";
};
