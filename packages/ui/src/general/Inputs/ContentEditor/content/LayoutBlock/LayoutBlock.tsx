"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ContentBlock } from "../../ContentEditor";
import NestedBlock from "../../components/NestedBlock";
import "./styles.scss";

interface LayoutBlockProps {
	block: ContentBlock;
	onUpdate: (updates: Partial<ContentBlock>) => void;
	onBlockSelect?: (block: ContentBlock | null) => void;
	onBlockUpdate?: (id: string, updates: Partial<ContentBlock>) => void;
	onBlockDelete?: (id: string) => void;
	onBlockDuplicate?: (id: string) => void;
	selectedBlock?: ContentBlock | null;
}

export default function LayoutBlock({
	block,
	onUpdate,
	onBlockSelect,
	onBlockUpdate,
	onBlockDelete,
	onBlockDuplicate,
	selectedBlock
}: LayoutBlockProps) {
	const columns = block.config?.columns || "50/50";
	const children = block.children || [];

	const getColumnClass = () => {
		switch (columns) {
			case "50/50":
				return "columns-2-equal";
			case "33/66":
				return "columns-2-33-66";
			case "66/33":
				return "columns-2-66-33";
			case "25/75":
				return "columns-2-25-75";
			case "75/25":
				return "columns-2-75-25";
			case "33/33/33":
				return "columns-3-equal";
			default:
				return "columns-2-equal";
		}
	};

	const getColumnCount = () => {
		return columns.split("/").length;
	};

	const renderColumn = (columnIndex: number) => {
		const columnBlocks = children[columnIndex] || [];
		const columnId = `column-${block.id}-${columnIndex}`;

		return (
			<LayoutColumn
				key={columnIndex}
				columnId={columnId}
				columnIndex={columnIndex}
				blocks={columnBlocks}
				selectedBlock={selectedBlock}
				onBlockSelect={onBlockSelect}
				onBlockUpdate={onBlockUpdate}
				onBlockDelete={onBlockDelete}
				onBlockDuplicate={onBlockDuplicate}
			/>
		);
	};

	const renderColumns = () => {
		const count = getColumnCount();
		return Array.from({ length: count }, (_, i) => renderColumn(i));
	};

	return (
		<div className={`layout-block ${getColumnClass()}`}>
			{renderColumns()}
		</div>
	);
}

interface LayoutColumnProps {
	columnId: string;
	columnIndex: number;
	blocks: ContentBlock[];
	selectedBlock?: ContentBlock | null;
	onBlockSelect?: (block: ContentBlock | null) => void;
	onBlockUpdate?: (id: string, updates: Partial<ContentBlock>) => void;
	onBlockDelete?: (id: string) => void;
	onBlockDuplicate?: (id: string) => void;
}

function LayoutColumn({
	columnId,
	columnIndex,
	blocks,
	selectedBlock,
	onBlockSelect,
	onBlockUpdate,
	onBlockDelete,
	onBlockDuplicate
}: LayoutColumnProps) {
	const { setNodeRef, isOver } = useDroppable({
		id: columnId,
		data: {
			type: "column",
			columnIndex
		}
	});

	return (
		<div
			ref={setNodeRef}
			className={`layout-block-column ${isOver ? "drag-over" : ""}`}
			data-column-id={columnId}
		>
			{blocks.length === 0 ? (
				<div className="column-placeholder">
					<p>Column {columnIndex + 1}</p>
					<p className="column-hint">Drag content here</p>
				</div>
			) : (
				<SortableContext
					items={blocks.map((b) => b.id)}
					strategy={verticalListSortingStrategy}
				>
					<div className="column-blocks">
						{blocks.map((childBlock) => (
							<NestedBlock
								key={childBlock.id}
								block={childBlock}
								isSelected={selectedBlock?.id === childBlock.id}
								onSelect={() =>
									onBlockSelect && onBlockSelect(childBlock)
								}
								onUpdate={onBlockUpdate || (() => {})}
								onDelete={onBlockDelete || (() => {})}
								onDuplicate={onBlockDuplicate || (() => {})}
							/>
						))}
					</div>
				</SortableContext>
			)}
		</div>
	);
}
