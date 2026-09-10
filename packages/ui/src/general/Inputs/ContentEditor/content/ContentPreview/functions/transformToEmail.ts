import { ContentBlock } from "../../../ContentEditor";
import {
	resolveBlockStyleString,
	resolveColor,
	resolveSpacing
} from "../../../styles";
import {
	buttonPaddingAndFontSize,
	DEFAULT_BUTTON_BACKGROUND,
	DEFAULT_BUTTON_FONT_COLOR
} from "../../ButtonBlock/buttonBlockStyles";
import {
	ensureTextMarkup,
	getTextKind,
	getTextTypographyStyleString
} from "../../../utils/textBlock";

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
			return renderEmailDividerBlock(block);
		case "spacer":
			return renderEmailSpacerBlock(block);
		case "image":
			return renderEmailImageBlock(block);
		case "layout":
			return renderEmailLayoutBlock(block);
		case "section":
			// Email clients ignore semantic section tags — render inner blocks only
			return renderEmailSectionBlock(block);
		case "content":
			// Content references are website-only; skip in email HTML
			return "";
		default:
			return "";
	}
};

const mergeStyle = (base: string, extra?: string) =>
	[base, extra].filter(Boolean).join("; ");

const renderEmailSectionBlock = (block: ContentBlock): string => {
	if (!block.children?.length) return "";

	const inner = block.children
		.flatMap((column) => column.map((child) => renderEmailBlock(child)))
		.filter(Boolean)
		.join("\n");

	const styleStr = resolveBlockStyleString(block.style, {
		includeSizing: true,
		includeColors: true
	});

	if (!styleStr) return inner;

	return `<div style="${styleStr}">${inner}</div>`;
};

const HEADING_FONT_SIZES: Record<string, string> = {
	h1: "28px",
	h2: "24px",
	h3: "22px",
	h4: "20px",
	h5: "18px",
	h6: "16px"
};

const EMAIL_TEXT_LINE_HEIGHT = "1.2";
const EMAIL_PARAGRAPH_GAP = "18px";

const getEmailTextTagStyle = (tag: string) => {
	const base = `margin: 0; line-height: ${EMAIL_TEXT_LINE_HEIGHT}`;
	if (tag.toLowerCase() === "p") {
		return `${base}; margin-block-end: ${EMAIL_PARAGRAPH_GAP}; margin-bottom: ${EMAIL_PARAGRAPH_GAP}`;
	}
	return base;
};

/** Email clients apply default margins on semantic tags — reset inline. */
const normalizeEmailTextHtml = (html: string): string =>
	html.replace(
		/<(p|h[1-6]|ul|ol|li)(?=\s|>)([^>]*)>/gi,
		(_match, tag: string, attrs: string) => {
			const tagStyle = getEmailTextTagStyle(tag);
			const styleMatch = attrs.match(/style="([^"]*)"/i);
			if (styleMatch) {
				const mergedStyle = `${styleMatch[1]}; ${tagStyle}`;
				const nextAttrs = attrs.replace(
					/style="[^"]*"/i,
					`style="${mergedStyle}"`
				);
				return `<${tag}${nextAttrs}>`;
			}
			return `<${tag}${attrs} style="${tagStyle}">`;
		}
	);

const renderEmailTextBlock = (block: ContentBlock): string => {
	const kind = getTextKind(block);
	const content = normalizeEmailTextHtml(ensureTextMarkup(block));
	const headingLevel = block.config?.headingLevel || "h2";
	const styleStr = resolveBlockStyleString(block.style, {
		includeSizing: true,
		includeColors: true
	});
	const typography = getTextTypographyStyleString(block.config);
	const color = resolveColor(block.style?.color);
	const defaultFontSize =
		kind === "heading" && !block.config?.fontSize
			? `font-size: ${HEADING_FONT_SIZES[headingLevel] || "24px"}`
			: kind !== "heading" && !block.config?.fontSize
				? "font-size: 16px"
				: "";
	const defaults =
		kind === "heading"
			? `margin: 0; font-weight: bold; color: ${color || "#333333"}; line-height: ${EMAIL_TEXT_LINE_HEIGHT}`
			: `margin: 0; color: ${color || "#555555"}; line-height: ${EMAIL_TEXT_LINE_HEIGHT}`;

	return `
		<div style="${mergeStyle(
			defaults,
			[defaultFontSize, typography, styleStr].filter(Boolean).join("; ")
		)}">
			${content}
		</div>
	`;
};

const renderEmailSpacerBlock = (block: ContentBlock): string => {
	const height = block.config?.spacerHeight || "24px";
	const styleStr = resolveBlockStyleString(block.style, {
		includeSizing: true,
		includeColors: true
	});

	return `
		<div style="${mergeStyle(
			`height: ${height}; line-height: ${height}; font-size: 0; mso-line-height-rule: exactly`,
			styleStr
		)}" aria-hidden="true">&nbsp;</div>
	`;
};

const renderEmailButtonBlock = (block: ContentBlock): string => {
	const alignment = block.config?.alignment || "center";
	const buttonText = block.config?.buttonText || "Click me";
	const buttonUrl = block.config?.buttonUrl || "#";
	const styleBg = resolveColor(block.style?.backgroundColor);
	const styleColor = resolveColor(block.style?.color);
	const bg =
		styleBg ||
		block.config?.buttonBackgroundColor ||
		DEFAULT_BUTTON_BACKGROUND;
	const fontColor =
		styleColor ||
		block.config?.buttonFontColor ||
		DEFAULT_BUTTON_FONT_COLOR;
	const { padding, fontSize } = buttonPaddingAndFontSize(
		block.config?.buttonSize
	);
	const wrapperStyle = resolveBlockStyleString(block.style, {
		includeSizing: true,
		includeColors: false
	});

	// Parse padding values for MSO-specific rendering
	const paddingParts = padding.split(" ");
	const verticalPadding = paddingParts[0] || "10px";
	const horizontalPadding = paddingParts[1] || paddingParts[0] || "24px";

	return `
		<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${mergeStyle("margin: 24px 0", wrapperStyle)}">
			<tr>
				<td align="${alignment}" style="padding: 0;">
					<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="display: inline-block;">
						<tr>
							<td align="center" style="border-radius: 4px; background-color: ${bg}; mso-padding-alt: ${verticalPadding} ${horizontalPadding}; padding: ${padding};">
								<a href="${buttonUrl}" target="_blank" style="display: inline-block; mso-padding-alt: 0; padding: 0; font-family: Arial, sans-serif; font-size: ${fontSize}; color: ${fontColor}; text-decoration: none; font-weight: 500; line-height: 1.4; white-space: nowrap;">
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

const renderEmailDividerBlock = (block: ContentBlock): string => {
	const color = resolveColor(block.style?.color) || "#e0e0e0";
	const bg = resolveColor(block.style?.backgroundColor);
	const styleStr = resolveBlockStyleString(block.style, {
		includeSizing: false,
		includeColors: true
	});

	return `
		<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${mergeStyle("margin: 32px 0", styleStr)}">
			<tr>
				<td style="border-top: 1px solid ${color};${bg ? ` background-color: ${bg};` : ""}"></td>
			</tr>
		</table>
	`;
};

const renderEmailImageBlock = (block: ContentBlock): string => {
	const imageUrl = block.config?.imageUrl || "";
	const alignment = block.config?.alignment || "center";
	const imageAlt = block.config?.imageAlt || "Image";
	const imageLink = block.config?.imageLink || "";
	const configWidth = block.config?.width || "600px";
	const height = block.config?.height || "auto";
	const wrapperStyle = resolveBlockStyleString(block.style, {
		includeSizing: true,
		includeColors: true
	});

	if (!imageUrl) return "";

	const maxContainerWidth = 540;
	let widthValue = parseInt(configWidth);
	if (isNaN(widthValue) || widthValue > maxContainerWidth) {
		widthValue = maxContainerWidth;
	}

	const imageHtml = `<img src="${imageUrl}" alt="${imageAlt}" width="${widthValue}" style="width: ${widthValue}px; max-width: 100%; height: ${height}; display: block; border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;" />`;
	const linkedImageHtml = imageLink
		? `<a href="${imageLink}" target="_blank" style="display: inline-block; border: 0; text-decoration: none;">${imageHtml}</a>`
		: imageHtml;

	return `
		<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${mergeStyle("margin: 24px 0", wrapperStyle)}">
			<tr>
				<td align="${alignment}">
					${linkedImageHtml}
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
	const gap = resolveSpacing(block.style?.flex?.gap) || "10px";
	const gapPx = parseInt(gap) || 10;
	const bg = resolveColor(block.style?.backgroundColor);
	const color = resolveColor(block.style?.color);
	const layoutExtras = [
		bg ? `background-color: ${bg}` : "",
		color ? `color: ${color}` : ""
	]
		.filter(Boolean)
		.join("; ");

	const columnCells = block.children
		.map((column, index) => {
			const widthPercent = columnWidths[index] || 50;
			const width = Math.round((widthPercent / 100) * totalWidth);
			const columnHtml = column
				.map((childBlock) => renderEmailBlock(childBlock))
				.filter(Boolean)
				.join("\n");
			const isLast = index >= block.children!.length - 1;

			return `
				<td width="${width}" valign="top" style="width: ${width}px; padding: 0 ${isLast ? "0" : `${gapPx}px`} 0 0;">
					${columnHtml}
				</td>
			`;
		})
		.join("\n");

	return `
		<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${mergeStyle("width: 100%; margin: 24px 0", layoutExtras)}">
			<tr>
				${columnCells}
			</tr>
		</table>
	`;
};
