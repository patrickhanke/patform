"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ContentBlock } from "../ContentEditor";

import TextBlock from "../content/TextBlock/TextBlock";
import ButtonBlock from "../content/ButtonBlock/ButtonBlock";
import ImageBlock from "../content/ImageBlock/ImageBlock";
import DividerBlock from "../content/DividerBlock/DividerBlock";
import LayoutBlock from "../content/LayoutBlock/LayoutBlock";
import SectionBlock from "../content/SectionBlock/SectionBlock";
import ContentReferenceBlock from "../content/ContentReferenceBlock/ContentReferenceBlock";
import StyleTags from "./StyleTags";

interface SortableBlockProps {
	block: ContentBlock;
	isSelected: boolean;
	selectedBlock?: ContentBlock | null;
	onSelect: () => void;
	onUpdate: (id: string, updates: Partial<ContentBlock>) => void;
	onDelete: (id: string) => void;
	onDuplicate: (id: string) => void;
	onBlockSelect?: (block: ContentBlock | null) => void;
	disableDelete?: boolean;
}

export default function SortableBlock({
	block,
	isSelected,
	selectedBlock,
	onSelect,
	onUpdate,
	onDelete,
	onDuplicate,
	onBlockSelect,
	disableDelete = false
}: SortableBlockProps) {
	const [isHovered, setIsHovered] = useState(false);

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging
	} = useSortable({ id: block.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1
	};

	const renderBlock = () => {
		switch (block.type) {
			case "text":
				return (
					<TextBlock
						block={block}
						onUpdate={(updates) => onUpdate(block.id, updates)}
					/>
				);
			case "button":
				return (
					<ButtonBlock
						block={block}
						onUpdate={(updates) => onUpdate(block.id, updates)}
					/>
				);
			case "image":
				return (
					<ImageBlock
						block={block}
						onUpdate={(updates) => onUpdate(block.id, updates)}
					/>
				);
			case "divider":
				return <DividerBlock block={block} />;
			case "layout":
				return (
					<LayoutBlock
						block={block}
						onUpdate={(updates) => onUpdate(block.id, updates)}
						onBlockSelect={onBlockSelect}
						onBlockUpdate={onUpdate}
						onBlockDelete={onDelete}
						onBlockDuplicate={onDuplicate}
						selectedBlock={selectedBlock}
					/>
				);
			case "section":
				return (
					<SectionBlock
						block={block}
						onBlockSelect={onBlockSelect}
						onBlockUpdate={onUpdate}
						onBlockDelete={onDelete}
						onBlockDuplicate={onDuplicate}
						selectedBlock={selectedBlock}
					/>
				);
			case "content":
				return <ContentReferenceBlock block={block} />;
			default:
				return <div>Unknown block type</div>;
		}
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`sortable-block ${isSelected ? "selected" : ""} ${isHovered ? "hovered" : ""}`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={(e) => {
				e.stopPropagation();
				onSelect();
			}}
		>
			{(isHovered || isSelected) && (
				<div className="block-toolbar">
					<div className="block-toolbar-left">
						<button
							type="button"
							className="block-drag-handle"
							{...attributes}
							{...listeners}
						>
							⋮⋮
						</button>
						<span className="block-type-label">{block.name}</span>
					</div>
					<div className="block-toolbar-right">
						<button
							type="button"
							className="block-action-btn"
							onClick={(e) => {
								e.stopPropagation();
								onDuplicate(block.id);
							}}
							title="Duplicate"
						>
							⧉
						</button>
						{!disableDelete && (
							<button
								type="button"
								className="block-action-btn"
								onClick={(e) => {
									e.stopPropagation();
									onDelete(block.id);
								}}
								title="Delete"
							>
								🗑
							</button>
						)}
					</div>
				</div>
			)}
			<div className="block-content">
				{block.type !== "section" && (
					<StyleTags style={block.style} />
				)}
				{renderBlock()}
			</div>
		</div>
	);
}
