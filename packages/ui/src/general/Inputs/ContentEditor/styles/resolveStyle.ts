import type { CSSProperties } from "react";
import type { ContentBlockStyle } from "./types";
import { resolveColor, resolveSpacing } from "./tokens";

export type ResolvedBlockStyle = {
	style: CSSProperties;
	className: string;
};

const SIZING_TYPES = new Set(["text", "button", "image", "section"]);

/**
 * Resolve declarative `block.style` into inline CSS + helper class names.
 * @param options.includeSizing — padding/margin (text, button, image, section)
 * @param options.includeFlex — flex layout props (layout blocks)
 */
export const resolveBlockStyle = (
	blockStyle: ContentBlockStyle | undefined,
	options: {
		includeSizing?: boolean;
		includeFlex?: boolean;
		includeColors?: boolean;
	} = {}
): ResolvedBlockStyle => {
	const {
		includeSizing = true,
		includeFlex = false,
		includeColors = true
	} = options;

	const style: CSSProperties = {};
	const classNames: string[] = [];

	if (!blockStyle) {
		return { style, className: "" };
	}

	if (includeColors) {
		const backgroundColor = resolveColor(blockStyle.backgroundColor);
		const color = resolveColor(blockStyle.color);
		if (backgroundColor) style.backgroundColor = backgroundColor;
		if (color) style.color = color;
	}

	if (includeSizing) {
		const padding = resolveSpacing(blockStyle.padding);
		const margin = resolveSpacing(blockStyle.margin);
		if (padding) style.padding = padding;
		if (margin) style.margin = margin;
	}

	if (includeFlex) {
		style.display = "flex";
		const flex = blockStyle.flex;
		if (flex?.alignItems) style.alignItems = flex.alignItems;
		if (flex?.justifyContent) style.justifyContent = flex.justifyContent;
		if (flex?.gap) style.gap = resolveSpacing(flex.gap);
		if (flex?.wrap) style.flexWrap = "wrap";
		if (flex?.changeToColumn) {
			classNames.push("ce-flex--column-mobile");
		}
		classNames.push("ce-flex");
	}

	return { style, className: classNames.filter(Boolean).join(" ") };
};

export const blockSupportsSizing = (type: string) => SIZING_TYPES.has(type);

/** Inline style string for email HTML (no class-based mobile flex). */
export const resolveBlockStyleString = (
	blockStyle: ContentBlockStyle | undefined,
	options: {
		includeSizing?: boolean;
		includeFlex?: boolean;
		includeColors?: boolean;
	} = {}
): string => {
	const { style } = resolveBlockStyle(blockStyle, options);
	return Object.entries(style)
		.map(([key, value]) => {
			if (value === undefined || value === null || value === "") return "";
			const cssKey = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
			return `${cssKey}: ${value}`;
		})
		.filter(Boolean)
		.join("; ");
};
