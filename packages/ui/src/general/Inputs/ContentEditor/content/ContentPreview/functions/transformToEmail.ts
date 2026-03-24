import { ContentBlock } from "../../../ContentEditor";
import {
	buttonPaddingAndFontSize,
	DEFAULT_BUTTON_BACKGROUND,
	DEFAULT_BUTTON_FONT_COLOR
} from "../../ButtonBlock/buttonBlockStyles";

/**
 * Transform ContentBlock[] into HTML string for email preview
 * Uses inline styles for email compatibility
 */
export const transformToEmail = (blocks: ContentBlock[]): string => {
	const blocksHtml = blocks
		.map((block) => renderEmailBlock(block))
		.filter(Boolean)
		.join("\n");

	return `
<!DOCTYPE html>
<html lang="de">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Email Preview</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
	<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
		<tr>
			<td align="center" style="padding: 20px 10px;">
				<table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff;">
					<tr>
						<td style="padding: 40px 30px;">
							${blocksHtml}
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>
	`.trim();
};

const renderEmailBlock = (block: ContentBlock): string => {
	if (!block.active) return "";

	switch (block.type) {
		case "text":
			return renderEmailTextBlock(block);
		case "button":
			return renderEmailButtonBlock(block);
		case "divider":
			return renderEmailDividerBlock();
		case "image":
			return renderEmailImageBlock(block);
		case "layout":
			return renderEmailLayoutBlock(block);
		default:
			return "";
	}
};

const renderEmailTextBlock = (block: ContentBlock): string => {
	const textType = block.config?.textType || "paragraph";
	const headingLevel = block.config?.headingLevel || "h2";
	const content = block.value || "";

	if (textType === "heading") {
		const headingSizes: Record<string, string> = {
			h1: "28px",
			h2: "24px",
			h3: "24px",
			h4: "20px",
			h5: "18px",
			h6: "16px"
		};
		const fontSize = headingSizes[headingLevel] || "28px";

		return `
			<${headingLevel} style="margin: 0 0 16px 0; font-size: ${fontSize}; font-weight: bold; color: #333333; line-height: 1.3;">
				${content}
			</${headingLevel}>
		`;
	}

	return `
		<div style="margin: 0 0 16px 0; font-size: 16px; color: #555555; line-height: 1.6;">
			${content}
		</div>
	`;
};

const renderEmailButtonBlock = (block: ContentBlock): string => {
	const alignment = block.config?.alignment || "center";
	const buttonText = block.config?.buttonText || "Click me";
	const buttonUrl = block.config?.buttonUrl || "#";
	const bg =
		block.config?.buttonBackgroundColor || DEFAULT_BUTTON_BACKGROUND;
	const fontColor = block.config?.buttonFontColor || DEFAULT_BUTTON_FONT_COLOR;
	const { padding, fontSize } = buttonPaddingAndFontSize(
		block.config?.buttonSize
	);

	return `
		<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0;">
			<tr>
				<td align="${alignment}">
					<table role="presentation" cellspacing="0" cellpadding="0" border="0">
						<tr>
							<td style="border-radius: 4px; background-color: ${bg};">
								<a href="${buttonUrl}" target="_blank" style="display: inline-block; padding: ${padding}; font-size: ${fontSize}; color: ${fontColor}; text-decoration: none; font-weight: 500;">
									${buttonText}
								</a>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	`;
};

const renderEmailDividerBlock = (): string => {
	return `
		<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 32px 0;">
			<tr>
				<td style="border-top: 1px solid #e0e0e0;"></td>
			</tr>
		</table>
	`;
};

const renderEmailImageBlock = (block: ContentBlock): string => {
	const imageUrl = block.config?.imageUrl || "";
	const alignment = block.config?.alignment || "center";
	const imageAlt = block.config?.imageAlt || "Image";
	const width = block.config?.width || "600px";
	const height = block.config?.height || "auto";

	if (!imageUrl) return "";

	return `
		<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0;">
			<tr>
				<td align="${alignment}">
					<img src="${imageUrl}" alt="${imageAlt}" style="max-width: ${width}; height: ${height}; display: block;" />
				</td>
			</tr>
		</table>
	`;
};

const renderEmailLayoutBlock = (block: ContentBlock): string => {
	if (!block.children || block.children.length === 0) return "";

	const columns = block.config?.columns || "50/50";
	const columnWidths = columns.split("/").map((w) => parseInt(w));
	const totalWidth = 540; // 600px container - 60px padding

	const columnCells = block.children
		.map((column, index) => {
			const width = Math.round(
				(columnWidths[index] || 0 / 100) * totalWidth
			);
			const columnHtml = column
				.map((childBlock) => renderEmailBlock(childBlock))
				.filter(Boolean)
				.join("\n");

			return `
				<td width="${width}" valign="top" style="padding: 0 ${index < block.children!.length - 1 ? "10px" : "0"} 0 0;">
					${columnHtml}
				</td>
			`;
		})
		.join("\n");

	return `
		<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0;">
			<tr>
				${columnCells}
			</tr>
		</table>
	`;
};
