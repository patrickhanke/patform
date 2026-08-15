import React from "react";
import { ContentBlock } from "../../../ContentEditor";
import { resolveBlockStyle, resolveColor } from "../../../styles";
import {
	buttonPaddingAndFontSize,
	DEFAULT_BUTTON_BACKGROUND,
	DEFAULT_BUTTON_FONT_COLOR
} from "../../ButtonBlock/buttonBlockStyles";

/**
 * Transform ContentBlock[] into React components for web preview
 */
export const transformToWeb = (blocks: ContentBlock[]): React.ReactNode => {
	return blocks.map((block) => renderWebBlock(block));
};

const renderWebBlock = (block: ContentBlock): React.ReactNode => {
	if (!block.active) return null;

	switch (block.type) {
		case "text":
			return renderTextBlock(block);
		case "button":
			return renderButtonBlock(block);
		case "divider":
			return renderDividerBlock(block);
		case "image":
			return renderImageBlock(block);
		case "layout":
			return renderLayoutBlock(block);
		case "section":
			return renderSectionBlock(block);
		case "content":
			return renderContentReferenceBlock(block);
		default:
			return null;
	}
};

const renderContentReferenceBlock = (
	block: ContentBlock
): React.ReactNode => {
	const { style, className } = resolveBlockStyle(block.style, {
		includeSizing: true,
		includeColors: true
	});
	const objectId = typeof block.value === "string" ? block.value : "";
	const title = block.config?.contentTitle || block.name || "Inhalt";

	return (
		<div
			key={block.id}
			className={className || undefined}
			data-content-ref={objectId}
			data-content-id={block.config?.contentId || undefined}
			data-content-type={block.config?.contentType || undefined}
			style={{
				padding: "1rem",
				border: "1px dashed #ccc",
				borderRadius: 4,
				...style
			}}
		>
			{/* Website runtime should hydrate by data-content-ref (Content.objectId) */}
			<em>
				Content-Ref: {title}
				{objectId ? ` (${objectId})` : ""}
			</em>
		</div>
	);
};

const renderSectionBlock = (block: ContentBlock): React.ReactNode => {
	if (!block.children?.length) return null;

	const Tag = (block.config?.htmlTag ||
		"section") as keyof JSX.IntrinsicElements;
	const { style, className } = resolveBlockStyle(block.style, {
		includeSizing: true,
		includeColors: true
	});
	const inner = block.children.flatMap((column) =>
		column.map((child) => renderWebBlock(child))
	);

	return (
		<Tag key={block.id} className={className || undefined} style={style}>
			{inner}
		</Tag>
	);
};

const renderTextBlock = (block: ContentBlock): React.ReactNode => {
	const textType = block.config?.textType || "paragraph";
	const headingLevel = block.config?.headingLevel || "h2";
	const { style, className } = resolveBlockStyle(block.style, {
		includeSizing: true,
		includeColors: true
	});

	if (textType === "heading") {
		const HeadingTag = headingLevel as keyof JSX.IntrinsicElements;
		return (
			<HeadingTag
				key={block.id}
				className={className || undefined}
				dangerouslySetInnerHTML={{ __html: block.value || "" }}
				style={style}
			/>
		);
	}

	return (
		<div
			key={block.id}
			className={className || undefined}
			dangerouslySetInnerHTML={{ __html: block.value || "" }}
			style={style}
		/>
	);
};

const renderButtonBlock = (block: ContentBlock): React.ReactNode => {
	const alignment = block.config?.alignment || "center";
	const buttonText = block.config?.buttonText || "Click me";
	const buttonUrl = block.config?.buttonUrl || "#";
	const styleBg = resolveColor(block.style?.backgroundColor);
	const styleColor = resolveColor(block.style?.color);
	const bg =
		styleBg ||
		block.config?.buttonBackgroundColor ||
		DEFAULT_BUTTON_BACKGROUND;
	const color =
		styleColor ||
		block.config?.buttonFontColor ||
		DEFAULT_BUTTON_FONT_COLOR;
	const { padding, fontSize } = buttonPaddingAndFontSize(
		block.config?.buttonSize
	);
	const { style: wrapperStyle, className } = resolveBlockStyle(block.style, {
		includeSizing: true,
		includeColors: false
	});

	return (
		<div
			key={block.id}
			className={className || undefined}
			style={{
				textAlign: alignment as React.CSSProperties["textAlign"],
				...wrapperStyle
			}}
		>
			<a
				href={buttonUrl}
				style={{
					display: "inline-block",
					padding,
					fontSize,
					backgroundColor: bg,
					color,
					textDecoration: "none",
					borderRadius: "4px",
					fontWeight: "500"
				}}
			>
				{buttonText}
			</a>
		</div>
	);
};

const renderDividerBlock = (block: ContentBlock): React.ReactNode => {
	const { style, className } = resolveBlockStyle(block.style, {
		includeSizing: false,
		includeColors: true
	});

	return (
		<hr
			key={block.id}
			className={className || undefined}
			style={{
				border: "none",
				borderTop: `1px solid ${style.color || "#e0e0e0"}`,
				backgroundColor: style.backgroundColor,
				margin: style.margin || "2rem 0"
			}}
		/>
	);
};

const renderImageBlock = (block: ContentBlock): React.ReactNode => {
	const alignment = block.config?.alignment || "center";
	const imageUrl = block.config?.imageUrl || "";
	const imageAlt = block.config?.imageAlt || "Image";
	const { style, className } = resolveBlockStyle(block.style, {
		includeSizing: true,
		includeColors: true
	});

	if (!imageUrl) return null;

	return (
		<div
			key={block.id}
			className={className || undefined}
			style={{
				textAlign: alignment as React.CSSProperties["textAlign"],
				...style
			}}
		>
			<img
				src={imageUrl}
				alt={imageAlt}
				style={{
					maxWidth: "100%",
					height: "auto"
				}}
			/>
		</div>
	);
};

const renderLayoutBlock = (block: ContentBlock): React.ReactNode => {
	if (!block.children || block.children.length === 0) return null;

	const columns = block.config?.columns || "50/50";
	const columnWidths = columns.split("/").map((w) => `${w}%`);
	const { style, className } = resolveBlockStyle(block.style, {
		includeSizing: false,
		includeFlex: true,
		includeColors: true
	});

	return (
		<div
			key={block.id}
			className={className || undefined}
			style={{
				gap: style.gap || "1rem",
				...style
			}}
		>
			{block.children.map((column, index) => (
				<div
					key={`${block.id}-col-${index}`}
					style={{
						flex: `0 0 ${columnWidths[index] || "auto"}`,
						minWidth: 0
					}}
				>
					{column.map((childBlock) => renderWebBlock(childBlock))}
				</div>
			))}
		</div>
	);
};
