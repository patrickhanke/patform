import React from "react";
import { ContentBlock } from "../../../ContentEditor";

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
		default:
			return null;
	}
};

const renderTextBlock = (block: ContentBlock): React.ReactNode => {
	const textType = block.config?.textType || "paragraph";
	const headingLevel = block.config?.headingLevel || "h2";

	if (textType === "heading") {
		const HeadingTag = headingLevel as keyof JSX.IntrinsicElements;
		return (
			<HeadingTag
				key={block.id}
				dangerouslySetInnerHTML={{ __html: block.value || "" }}
				style={{ margin: "1rem 0" }}
			/>
		);
	}

	return (
		<div
			key={block.id}
			dangerouslySetInnerHTML={{ __html: block.value || "" }}
			style={{ margin: "1rem 0" }}
		/>
	);
};

const renderButtonBlock = (block: ContentBlock): React.ReactNode => {
	const alignment = block.config?.alignment || "center";
	const buttonText = block.config?.buttonText || "Click me";
	const buttonUrl = block.config?.buttonUrl || "#";

	return (
		<div
			key={block.id}
			style={{
				textAlign: alignment as any,
				margin: "1.5rem 0"
			}}
		>
			<a
				href={buttonUrl}
				style={{
					display: "inline-block",
					padding: "12px 24px",
					backgroundColor: "#007bff",
					color: "#ffffff",
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
	return (
		<hr
			key={block.id}
			style={{
				border: "none",
				borderTop: "1px solid #e0e0e0",
				margin: "2rem 0"
			}}
		/>
	);
};

const renderImageBlock = (block: ContentBlock): React.ReactNode => {
	const alignment = block.config?.alignment || "center";
	const imageUrl = block.config?.imageUrl || "";
	const imageAlt = block.config?.imageAlt || "Image";

	if (!imageUrl) return null;

	return (
		<div
			key={block.id}
			style={{
				textAlign: alignment as any,
				margin: "1.5rem 0"
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

	return (
		<div
			key={block.id}
			style={{
				display: "flex",
				gap: "1rem",
				margin: "1.5rem 0"
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
