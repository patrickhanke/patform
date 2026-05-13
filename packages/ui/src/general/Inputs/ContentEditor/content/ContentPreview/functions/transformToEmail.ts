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
			<!--[if gte mso 9]>
			<xml>
				<o:OfficeDocumentSettings>
					<o:AllowPNG/>
					<o:PixelsPerInch>96</o:PixelsPerInch>
				</o:OfficeDocumentSettings>
			</xml>
			<![endif]-->
		</head>
		<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
			<!--[if mso | IE]>
			<table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center" style="width: 600px;">
				<tr>
					<td>
			<![endif]-->
			<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
				<tr>
					<td align="center" style="padding: 20px 10px;">
						<table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width: 600px; max-width: 600px; background-color: #ffffff;">
							<tr>
								<td style="padding: 40px 30px;">
									${blocksHtml}
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
			<!--[if mso | IE]>
					</td>
				</tr>
			</table>
			<![endif]-->
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
	const bg = block.config?.buttonBackgroundColor || DEFAULT_BUTTON_BACKGROUND;
	const fontColor =
		block.config?.buttonFontColor || DEFAULT_BUTTON_FONT_COLOR;
	const { padding, fontSize } = buttonPaddingAndFontSize(
		block.config?.buttonSize
	);

	return `
		<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0;">
			<tr>
				<td align="${alignment}">
					<!--[if mso]>
					<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${buttonUrl}" style="height:40px;v-text-anchor:middle;width:200px;" arcsize="10%" stroke="f" fillcolor="${bg}">
						<w:anchorlock/>
						<center style="color:${fontColor};font-family:Arial,sans-serif;font-size:${fontSize};font-weight:500;">
							${buttonText}
						</center>
					</v:roundrect>
					<![endif]-->
					<!--[if !mso]><!-->
					<table role="presentation" cellspacing="0" cellpadding="0" border="0">
						<tr>
							<td style="border-radius: 4px; background-color: ${bg}; padding: ${padding};">
								<a href="${buttonUrl}" target="_blank" style="display: inline-block; font-size: ${fontSize}; color: ${fontColor}; text-decoration: none; font-weight: 500; line-height: 1.2;">
									${buttonText}
								</a>
							</td>
						</tr>
					</table>
					<!--<![endif]-->
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
	const configWidth = block.config?.width || "600px";
	const height = block.config?.height || "auto";

	if (!imageUrl) return "";

	// Parse width and ensure it doesn't exceed container (540px = 600px - 60px padding)
	const maxContainerWidth = 540;
	let widthValue = parseInt(configWidth);
	if (isNaN(widthValue) || widthValue > maxContainerWidth) {
		widthValue = maxContainerWidth;
	}

	// For Outlook Classic: width attribute needs numeric value only (no "px")
	// For other clients: use both width and max-width in styles
	return `
		<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0;">
			<tr>
				<td align="${alignment}">
					<img src="${imageUrl}" alt="${imageAlt}" width="${widthValue}" style="width: ${widthValue}px; max-width: 100%; height: ${height}; display: block; border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;" />
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
			const widthPercent = columnWidths[index] || 50;
			const width = Math.round((widthPercent / 100) * totalWidth);
			const columnHtml = column
				.map((childBlock) => renderEmailBlock(childBlock))
				.filter(Boolean)
				.join("\n");

			// For Outlook Classic: use width attribute with numeric value and width style
			return `
				<td width="${width}" valign="top" style="width: ${width}px; padding: 0 ${index < block.children!.length - 1 ? "10px" : "0"} 0 0;">
					${columnHtml}
				</td>
			`;
		})
		.join("\n");

	return `
		<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%; margin: 24px 0;">
			<tr>
				${columnCells}
			</tr>
		</table>
	`;
};
