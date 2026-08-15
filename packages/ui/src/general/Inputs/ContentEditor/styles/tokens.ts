import type { ColorValues } from "../../ColorSelect/types";
import type { SpacingScale } from "./types";

/** Pixel values aligned with `packages/styles/src/constants/sizes.scss`. */
export const SPACING_PX: Record<SpacingScale, string> = {
	xxs: "4px",
	xs: "8px",
	sm: "12px",
	md: "14px",
	lg: "18px",
	xl: "24px",
	xxl: "36px"
};

export const SPACING_OPTIONS: { value: SpacingScale; label: string }[] = [
	{ value: "xxs", label: "XXS (4px)" },
	{ value: "xs", label: "XS (8px)" },
	{ value: "sm", label: "SM (12px)" },
	{ value: "md", label: "MD (14px)" },
	{ value: "lg", label: "LG (18px)" },
	{ value: "xl", label: "XL (24px)" },
	{ value: "xxl", label: "XXL (36px)" }
];

/**
 * Resolves ColorSelect `value` tokens to CSS hex.
 * Brand colors follow `@repo/styles` constants; remaining hues use Chakra-equivalent palette shades.
 */
export const COLOR_HEX: Record<ColorValues, string> = {
	blue: "#0D6A87",
	blue_shaded: "#0d3a7f",
	blue_tintend: "#ddeffd",
	green: "#7cc38d",
	green_shaded: "#155724",
	green_tintend: "#d4edda",
	grey: "#cdcdcd",
	grey_shaded: "#999999",
	grey_tintend: "#f0f0f0",
	pink: "#D53F8C",
	pink_shaded: "#97266D",
	pink_tintend: "#FBB6CE",
	red: "#c62a32",
	red_shaded: "#812323",
	red_tintend: "#ffdcd9",
	violet: "#805AD5",
	violet_shaded: "#512da8",
	violet_tintend: "#ede7f6",
	yellow: "#d5b61d",
	yellow_shaded: "#b99e19",
	yellow_tintend: "#f9d729",
	orange: "#DD6B20",
	orange_shaded: "#9C4221",
	orange_tintend: "#FBD38D",
	teal: "#319795",
	teal_shaded: "#285E61",
	teal_tintend: "#81E6D9",
	cyan: "#00B5D8",
	cyan_shaded: "#0987A0",
	cyan_tintend: "#9DECF9"
};

export const resolveSpacing = (
	scale?: SpacingScale
): string | undefined => (scale ? SPACING_PX[scale] : undefined);

export const resolveColor = (
	token?: ColorValues
): string | undefined => (token ? COLOR_HEX[token] : undefined);
