import type { ButtonProps } from "@chakra-ui/react";
import type { IconButtonColor } from "./types";

const palette = {
	dark: "#333333",
	darkTinted: "#444444",
	light: "#f4f4f6",
	white: "#ffffff"
} as const;

const cssColorPattern = /^(#|rgb|hsl)/i;

export type IconButtonColorProps = Pick<
	ButtonProps,
	"variant" | "colorPalette" | "color" | "bg" | "_hover"
>;

export const getIconButtonColorProps = (
	color?: IconButtonColor
): IconButtonColorProps => {
	if (!color || color === "default") {
		return {
			variant: "subtle",
			colorPalette: "gray"
		};
	}

	switch (color) {
		case "active":
		case "whiteAlpha.900":
			return {
				variant: "solid",
				bg: palette.dark,
				color: palette.white,
				_hover: { bg: palette.darkTinted }
			};
		case "light":
			return {
				variant: "ghost",
				color: palette.dark,
				_hover: { bg: palette.light }
			};
		case "dark":
			return {
				variant: "solid",
				bg: palette.dark,
				color: palette.white,
				_hover: { bg: palette.darkTinted }
			};
		case "primary":
			return {
				variant: "solid",
				bg: palette.dark,
				color: palette.white,
				_hover: { bg: palette.darkTinted }
			};
		case "secondary":
			return {
				variant: "subtle",
				colorPalette: "blue"
			};
		case "danger":
			return {
				variant: "subtle",
				colorPalette: "red"
			};
		default:
			if (cssColorPattern.test(color)) {
				return {
					variant: "ghost",
					color
				};
			}

			return {
				variant: "subtle",
				colorPalette: "gray"
			};
	}
};
