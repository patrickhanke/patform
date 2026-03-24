export type ButtonBlockSize = "small" | "medium" | "large";

/** Matches previous default button appearance in the editor */
export const DEFAULT_BUTTON_BACKGROUND = "#007bff";
export const DEFAULT_BUTTON_FONT_COLOR = "#ffffff";

export function buttonPaddingAndFontSize(size: ButtonBlockSize | undefined): {
	padding: string;
	fontSize: string;
} {
	switch (size ?? "large") {
		case "small":
			return { padding: "6px 12px", fontSize: "11px" };
		case "medium":
			return { padding: "8px 16px", fontSize: "13px" };
		default:
			return { padding: "10px 24px", fontSize: "15px" };
	}
}
