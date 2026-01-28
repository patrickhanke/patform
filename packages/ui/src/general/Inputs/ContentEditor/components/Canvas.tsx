"use client";

import { useDroppable } from "@dnd-kit/core";
import SortableBlock from "./SortableBlock";
import { ContentBlock } from "../ContentEditor";

interface CanvasProps {
	blocks: ContentBlock[];
	selectedBlock: ContentBlock | null;
	onBlockSelect: (block: ContentBlock | null) => void;
	onBlockUpdate: (id: string, updates: Partial<ContentBlock>) => void;
	onBlockDelete: (id: string) => void;
	onBlockDuplicate: (id: string) => void;
}

export default function Canvas({
	blocks = [],
	selectedBlock,
	onBlockSelect,
	onBlockUpdate,
	onBlockDelete,
	onBlockDuplicate
}: CanvasProps) {
	const { setNodeRef } = useDroppable({
		id: "canvas"
	});

	console.log("blocks", blocks);

	if (!blocks) return null;

	return (
		<div ref={setNodeRef} className="content-editor-canvas">
			{blocks.length === 0 ? (
				<div className="canvas-empty">
					<p>Drag components here to start building</p>
				</div>
			) : (
				blocks.map((block) => (
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
					/>
				))
			)}
		</div>
	);
}
