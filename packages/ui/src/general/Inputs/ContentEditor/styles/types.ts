import type { ColorValues } from "../../ColorSelect/types";

/** Spacing scale shared with `@repo/styles` sizes (xxs–xxl). */
export type SpacingScale = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export type FlexAlignItems =
	| "flex-start"
	| "center"
	| "flex-end"
	| "stretch"
	| "baseline";

export type FlexJustifyContent =
	| "flex-start"
	| "center"
	| "flex-end"
	| "space-between"
	| "space-around"
	| "space-evenly";

export type ContentBlockFlexStyle = {
	alignItems?: FlexAlignItems;
	justifyContent?: FlexJustifyContent;
	gap?: SpacingScale;
	wrap?: boolean;
	/** Switch flex-direction to column below the md breakpoint. */
	changeToColumn?: boolean;
};

/**
 * Declarative style key on every content block.
 * - padding / margin: text, button, image, section
 * - backgroundColor / color: all content elements (ColorSelect tokens)
 * - flex: layout blocks
 */
export type ContentBlockStyle = {
	padding?: SpacingScale;
	margin?: SpacingScale;
	backgroundColor?: ColorValues;
	color?: ColorValues;
	flex?: ContentBlockFlexStyle;
};
