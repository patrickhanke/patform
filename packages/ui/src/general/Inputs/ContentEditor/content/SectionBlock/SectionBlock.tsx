"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ContentBlock, SectionHtmlTag } from "../../ContentEditor";
import SortableBlock from "../../components/SortableBlock";
import StyleTags from "../../components/StyleTags";
import { getSectionDroppableId } from "../../utils/sections";
import "./styles.scss";

interface SectionBlockProps {
	block: ContentBlock;
	onBlockSelect?: (block: ContentBlock | null) => void;
	onBlockUpdate?: (id: string, updates: Partial<ContentBlock>) => void;
	onBlockDelete?: (id: string) => void;
	onBlockDuplicate?: (id: string) => void;
	selectedBlock?: ContentBlock | null;
}

export default function SectionBlock({
	block,
	onBlockSelect,
	onBlockUpdate,
	onBlockDelete,
	onBlockDuplicate,
	selectedBlock
}: SectionBlockProps) {
	const htmlTag = (block.config?.htmlTag || "section") as SectionHtmlTag;
	const innerBlocks =
		(block.children?.[0] as ContentBlock[] | undefined) || [];
	const droppableId = getSectionDroppableId(block.id);

	const { setNodeRef, isOver } = useDroppable({
		id: droppableId,
		data: {
			type: "section",
			sectionId: block.id,
			columnIndex: 0
		}
	});

	return (
		<div className="section-block">
			<StyleTags style={block.style} extraTags={[htmlTag]} />
			<div
				ref={setNodeRef}
				className={`section-block-body ${isOver ? "drag-over" : ""}`}
			>
				{innerBlocks.length === 0 ? (
					<div className="section-placeholder">
						<p>Abschnitt &lt;{htmlTag}&gt;</p>
						<p className="section-hint">
							Ziehe Komponenten hierher
						</p>
					</div>
				) : (
					<SortableContext
						items={innerBlocks.map((b) => b.id)}
						strategy={verticalListSortingStrategy}
					>
						<div className="section-blocks">
							{innerBlocks.map((childBlock) => (
								<SortableBlock
									key={childBlock.id}
									block={childBlock}
									isSelected={
										selectedBlock?.id === childBlock.id
									}
									selectedBlock={selectedBlock}
									onSelect={() =>
										onBlockSelect?.(childBlock)
									}
									onBlockSelect={onBlockSelect}
									onUpdate={onBlockUpdate || (() => {})}
									onDelete={onBlockDelete || (() => {})}
									onDuplicate={onBlockDuplicate || (() => {})}
								/>
							))}
						</div>
					</SortableContext>
				)}
			</div>
		</div>
	);
}
