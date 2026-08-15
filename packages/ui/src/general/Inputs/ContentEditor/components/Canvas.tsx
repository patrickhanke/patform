"use client";

import { useDroppable } from "@dnd-kit/core";
import SortableBlock from "./SortableBlock";
import { ContentBlock } from "../ContentEditor";
import {
	getSectionDroppableId,
	getSectionInnerBlocks
} from "../utils/sections";

interface CanvasProps {
	blocks: ContentBlock[];
	multipleSections?: boolean;
	selectedBlock: ContentBlock | null;
	onBlockSelect: (block: ContentBlock | null) => void;
	onBlockUpdate: (id: string, updates: Partial<ContentBlock>) => void;
	onBlockDelete: (id: string) => void;
	onBlockDuplicate: (id: string) => void;
}

export default function Canvas({
	blocks = [],
	multipleSections = false,
	selectedBlock,
	onBlockSelect,
	onBlockUpdate,
	onBlockDelete,
	onBlockDuplicate
}: CanvasProps) {
	const defaultSection = blocks[0];
	const singleSectionBlocks = getSectionInnerBlocks(defaultSection);
	const singleSectionDroppableId =
		defaultSection?.type === "section"
			? getSectionDroppableId(defaultSection.id)
			: "canvas";

	const { setNodeRef } = useDroppable({
		id: multipleSections ? "canvas" : singleSectionDroppableId
	});

	const renderBlocks = (list: ContentBlock[]) =>
		list.map((block) => (
			<SortableBlock
				key={block.id}
				block={block}
				isSelected={selectedBlock?.id === block.id}
				selectedBlock={selectedBlock}
				onSelect={() => onBlockSelect(block)}
				onBlockSelect={onBlockSelect}
				onUpdate={onBlockUpdate}
				onDelete={onBlockDelete}
				onDuplicate={onBlockDuplicate}
				disableDelete={
					block.type === "section" &&
					blocks.filter((b) => b.type === "section").length <= 1
				}
			/>
		));

	if (multipleSections) {
		return (
			<div ref={setNodeRef} className="content-editor-canvas">
				{!blocks || blocks.length === 0 ? (
					<div className="canvas-empty">
						<p>Ziehe Abschnitte hierher um zu beginnen</p>
					</div>
				) : (
					renderBlocks(blocks)
				)}
			</div>
		);
	}

	return (
		<div ref={setNodeRef} className="content-editor-canvas">
			{singleSectionBlocks.length === 0 ? (
				<div className="canvas-empty">
					<p>Ziehe Komponenten hierher um zu beginnen</p>
				</div>
			) : (
				renderBlocks(singleSectionBlocks)
			)}
		</div>
	);
}
