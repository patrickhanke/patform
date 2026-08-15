"use client";

import { useState, useCallback } from "react";
import {
	DndContext,
	DragOverlay,
	closestCenter,
	pointerWithin,
	rectIntersection,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragStartEvent,
	DragEndEvent,
	DragOverEvent
} from "@dnd-kit/core";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";

import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import { PropertiesPanel } from "./content";
import ImportContentModal, {
	type ImportedContentRef
} from "./content/ImportContentModal/ImportContentModal";
import {
	createSectionBlock,
	findBlockById,
	flattenSections,
	getSectionInnerBlocks,
	normalizeToSections
} from "./utils/sections";

import type { ContentBlockStyle } from "./styles";
import "./styles.scss";
import "./styles/content-styles.scss";

export type SectionHtmlTag =
	| "section"
	| "article"
	| "aside"
	| "nav"
	| "header"
	| "footer"
	| "main"
	| "div";

export type { ContentBlockStyle } from "./styles";
export type {
	ContentBlockFlexStyle,
	SpacingScale,
	FlexAlignItems,
	FlexJustifyContent
} from "./styles";

export interface ContentBlock {
	id: string;
	name: string;
	type:
		| "text"
		| "button"
		| "divider"
		| "image"
		| "layout"
		| "section"
		| "content";
	position: number;
	value: string | any;
	active: boolean;
	/** layout: columns; section: single column `[blocks]` */
	children?: ContentBlock[][];
	/** Declarative visual style (spacing, colors, flex). */
	style?: ContentBlockStyle;
	config?: {
		columns?: string;
		alignment?: string;
		buttonText?: string;
		buttonUrl?: string;
		buttonSize?: "small" | "medium" | "large";
		buttonBackgroundColor?: string;
		buttonFontColor?: string;
		imageUrl?: string;
		imageAlt?: string;
		width?: string;
		height?: string;
		textType?: "heading" | "paragraph";
		headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
		htmlTag?: SectionHtmlTag;
		/** Content class reference metadata (type === "content") */
		contentTitle?: string;
		contentType?: string;
		contentId?: string;
	};
}

export interface ContentEditorProps {
	content?: ContentBlock[];
	onChange?: (content: ContentBlock[]) => void;
	className?: string;
	/** When true, canvas is a list of HTML sections (article, aside, …). Default: one implicit section. */
	multipleSections?: boolean;
}

export default function ContentEditor({
	content = [],
	onChange,
	className = "",
	multipleSections = false
}: ContentEditorProps) {
	const [blocks, setBlocks] = useState<ContentBlock[]>(() =>
		normalizeToSections(content)
	);
	const [activeId, setActiveId] = useState<string | null>(null);
	const [selectedBlock, setSelectedBlock] = useState<ContentBlock | null>(
		null
	);
	const [overId, setOverId] = useState<string | null>(null);
	const [importContentOpen, setImportContentOpen] = useState(false);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8
			}
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	);

	const updateBlocks = useCallback(
		(newBlocks: ContentBlock[]) => {
			const blocksWithPositions = newBlocks.map((block, index) => ({
				...block,
				position: index + 1
			}));
			setBlocks(blocksWithPositions);
			// Single-section mode keeps the stored document flat for email compatibility
			onChange?.(
				multipleSections
					? blocksWithPositions
					: flattenSections(blocksWithPositions)
			);
		},
		[onChange, multipleSections]
	);

	const createBlock = useCallback(
		(type: ContentBlock["type"]): ContentBlock => {
			const id = uuidv4();
			const baseBlock = {
				id,
				position: 1,
				active: true
			};

			switch (type) {
				case "text":
					return {
						...baseBlock,
						name: "Text Block",
						type: "text",
						value: "<p>Enter your text here...</p>",
						config: {
							textType: "paragraph"
						}
					};
				case "button":
					return {
						...baseBlock,
						name: "Button",
						type: "button",
						value: "",
						config: {
							buttonText: "Click me",
							buttonUrl: "#",
							alignment: "center",
							buttonSize: "large",
							buttonBackgroundColor: "#007bff",
							buttonFontColor: "#ffffff"
						}
					};
				case "divider":
					return {
						...baseBlock,
						name: "Divider",
						type: "divider",
						value: ""
					};
				case "image":
					return {
						...baseBlock,
						name: "Image",
						type: "image",
						value: "",
						config: {
							imageUrl: "",
							imageAlt: "Image",
							alignment: "center"
						}
					};
				case "layout": {
					const columnCount = 2;
					return {
						...baseBlock,
						name: "Layout",
						type: "layout",
						value: "",
						children: Array.from({ length: columnCount }, () => []),
						config: {
							columns: "50/50"
						}
					};
				}
				case "section":
					return createSectionBlock("section");
				case "content":
					return {
						...baseBlock,
						name: "Inhaltselement",
						type: "content",
						value: "",
						config: {
							contentTitle: "",
							contentType: "",
							contentId: ""
						}
					};
				default:
					return {
						...baseBlock,
						name: "Block",
						type: "text",
						value: ""
					};
			}
		},
		[]
	);

	const createContentReferenceBlock = useCallback(
		(content: ImportedContentRef): ContentBlock => ({
			id: uuidv4(),
			name: content.title || "Inhaltselement",
			type: "content",
			position: 1,
			active: true,
			value: content.objectId,
			config: {
				contentTitle: content.title,
				contentType: content.type,
				contentId: content.content_id
			}
		}),
		[]
	);

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string);
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { over } = event;
		if (over) {
			setOverId(over.id as string);
		}
	};

	const customCollisionDetection = (args: any) => {
		const pointerCollisions = pointerWithin(args);

		if (pointerCollisions.length > 0) {
			const columnCollision = pointerCollisions.find((collision: any) =>
				collision.id.toString().startsWith("column-")
			);
			if (columnCollision) {
				return [columnCollision];
			}
			return pointerCollisions;
		}

		const rectCollisions = rectIntersection(args);
		if (rectCollisions.length > 0) {
			const columnCollision = rectCollisions.find((collision: any) =>
				collision.id.toString().startsWith("column-")
			);
			if (columnCollision) {
				return [columnCollision];
			}
			return rectCollisions;
		}

		return closestCenter(args);
	};

	const ensureSectionChildren = (layoutOrSection: ContentBlock) => {
		if (!layoutOrSection.children) {
			if (layoutOrSection.type === "section") {
				layoutOrSection.children = [[]];
			} else {
				const columnCount =
					layoutOrSection.config?.columns?.split("/").length || 2;
				layoutOrSection.children = Array.from(
					{ length: columnCount },
					() => []
				);
			}
		}
	};

	const removeBlockById = (
		blockList: ContentBlock[],
		id: string
	): ContentBlock | null => {
		const topIndex = blockList.findIndex((b) => b.id === id);
		if (topIndex !== -1) {
			const [removed] = blockList.splice(topIndex, 1);
			return removed || null;
		}

		for (const block of blockList) {
			if (!block.children) continue;
			for (const column of block.children) {
				if (!column) continue;
				const removed = removeBlockById(column, id);
				if (removed) return removed;
			}
		}

		return null;
	};

	const findListContaining = (
		blockList: ContentBlock[],
		id: string
	): { list: ContentBlock[]; index: number } | null => {
		const topIndex = blockList.findIndex((b) => b.id === id);
		if (topIndex !== -1) {
			return { list: blockList, index: topIndex };
		}

		for (const block of blockList) {
			if (!block.children) continue;
			for (const column of block.children) {
				const index = column.findIndex((b) => b.id === id);
				if (index !== -1) {
					return { list: column, index };
				}
			}
		}

		return null;
	};

	const insertIntoDefaultSection = (
		newBlocks: ContentBlock[],
		block: ContentBlock,
		overIdStr: string
	) => {
		const section = newBlocks[0];
		if (!section || section.type !== "section") {
			newBlocks.push(block);
			return;
		}
		ensureSectionChildren(section);
		const inner = section.children![0]!;
		const overIndex = inner.findIndex((b) => b.id === overIdStr);
		if (overIndex === -1 || overIdStr === "canvas") {
			inner.push(block);
		} else {
			inner.splice(overIndex, 0, block);
		}
	};

	const insertBlock = useCallback(
		(block: ContentBlock) => {
			const newBlocks = [...blocks];
			if (multipleSections) {
				const lastSection = newBlocks[newBlocks.length - 1];
				if (lastSection?.type === "section") {
					ensureSectionChildren(lastSection);
					lastSection.children![0]!.push(block);
				} else {
					newBlocks.push(block);
				}
			} else {
				insertIntoDefaultSection(newBlocks, block, "canvas");
			}
			updateBlocks(newBlocks);
			setSelectedBlock(block);
		},
		[blocks, multipleSections, updateBlocks]
	);

	const handleDropInColumn = useCallback(
		(activeIdStr: string, layoutId: string, columnIndex: number) => {
			const newBlocks = [...blocks];
			const layoutBlock = newBlocks.find((b) => b.id === layoutId);

			// Layout/section may be nested inside a section
			const target =
				layoutBlock ||
				(() => {
					for (const section of newBlocks) {
						if (!section.children) continue;
						for (const column of section.children) {
							const found = column.find((b) => b.id === layoutId);
							if (found) return found;
						}
					}
					return null;
				})();

			if (!target) return;

			// Disallow nesting sections inside columns / other sections
			if (activeIdStr === "sidebar-section") {
				return;
			}
			if (!activeIdStr.startsWith("sidebar-")) {
				const moving = findBlockById(newBlocks, activeIdStr);
				if (moving?.type === "section") {
					return;
				}
			}

			ensureSectionChildren(target);
			if (!target.children![columnIndex]) {
				target.children![columnIndex] = [];
			}

			if (activeIdStr.startsWith("sidebar-")) {
				const type = activeIdStr.replace(
					"sidebar-",
					""
				) as ContentBlock["type"];
				if (type === "section") return;
				const newBlock = createBlock(type);
				target.children![columnIndex]!.push(newBlock);
			} else {
				const movedBlock = removeBlockById(newBlocks, activeIdStr);
				if (movedBlock && movedBlock.type !== "section") {
					target.children![columnIndex]!.push(movedBlock);
				}
			}

			updateBlocks(newBlocks);
		},
		[blocks, createBlock, updateBlocks]
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over) {
			setActiveId(null);
			setOverId(null);
			return;
		}

		const overIdStr = over.id.toString();
		const activeIdStr = active.id.toString();

		// Dropping into a layout column or section body
		if (overIdStr.startsWith("column-")) {
			const parts = overIdStr.split("-");
			const columnIndex = parts[parts.length - 1]!;
			const layoutId = parts.slice(1, -1).join("-");
			handleDropInColumn(activeIdStr, layoutId, parseInt(columnIndex));
			setActiveId(null);
			setOverId(null);
			return;
		}

		// Creating from sidebar
		if (activeIdStr.startsWith("sidebar-")) {
			const type = activeIdStr.replace(
				"sidebar-",
				""
			) as ContentBlock["type"];

			if (type === "section") {
				if (!multipleSections) {
					setActiveId(null);
					setOverId(null);
					return;
				}
				const newSection = createBlock("section");
				const newBlocks = [...blocks];
				const overIndex = newBlocks.findIndex((b) => b.id === over.id);
				if (overIndex === -1) {
					newBlocks.push(newSection);
				} else {
					newBlocks.splice(overIndex, 0, newSection);
				}
				updateBlocks(newBlocks);
				setActiveId(null);
				setOverId(null);
				return;
			}

			const newBlock = createBlock(type);
			const newBlocks = [...blocks];

			if (multipleSections) {
				// Insert into the section under the pointer, or the last section
				const overLocation = findListContaining(newBlocks, overIdStr);
				if (overLocation && overLocation.list !== newBlocks) {
					overLocation.list.splice(overLocation.index, 0, newBlock);
				} else {
					const sectionOver = newBlocks.find((b) => b.id === overIdStr);
					if (sectionOver?.type === "section") {
						ensureSectionChildren(sectionOver);
						sectionOver.children![0]!.push(newBlock);
					} else {
						const lastSection = newBlocks[newBlocks.length - 1];
						if (lastSection?.type === "section") {
							ensureSectionChildren(lastSection);
							lastSection.children![0]!.push(newBlock);
						}
					}
				}
			} else {
				insertIntoDefaultSection(newBlocks, newBlock, overIdStr);
			}

			updateBlocks(newBlocks);
			setActiveId(null);
			setOverId(null);
			return;
		}

		// Reordering existing blocks
		if (active.id !== over.id) {
			const newBlocks = [...blocks];

			// Reorder top-level sections
			if (multipleSections) {
				const oldIndex = newBlocks.findIndex(
					(b) => b.id === activeIdStr
				);
				const newIndex = newBlocks.findIndex((b) => b.id === overIdStr);
				if (oldIndex !== -1 && newIndex !== -1) {
					const [movedBlock] = newBlocks.splice(oldIndex, 1);
					if (movedBlock) {
						newBlocks.splice(newIndex, 0, movedBlock);
						updateBlocks(newBlocks);
						setActiveId(null);
						setOverId(null);
						return;
					}
				}
			}

			let reordered = false;

			for (const block of newBlocks) {
				if (!block.children) continue;
				for (let i = 0; i < block.children.length; i++) {
					const column = block.children[i];
					if (!column) continue;
					const oldIndex = column.findIndex(
						(b) => b.id === activeIdStr
					);
					const newIndex = column.findIndex((b) => b.id === overIdStr);

					if (oldIndex !== -1 && newIndex !== -1) {
						const [movedBlock] = column.splice(oldIndex, 1);
						if (movedBlock) {
							column.splice(newIndex, 0, movedBlock);
							reordered = true;
							break;
						}
					}

					// Also reorder inside nested layout columns within a section
					for (const child of column) {
						if (!child.children) continue;
						for (let j = 0; j < child.children.length; j++) {
							const nestedCol = child.children[j];
							if (!nestedCol) continue;
							const nestedOld = nestedCol.findIndex(
								(b) => b.id === activeIdStr
							);
							const nestedNew = nestedCol.findIndex(
								(b) => b.id === overIdStr
							);
							if (nestedOld !== -1 && nestedNew !== -1) {
								const [movedBlock] = nestedCol.splice(
									nestedOld,
									1
								);
								if (movedBlock) {
									nestedCol.splice(nestedNew, 0, movedBlock);
									reordered = true;
									break;
								}
							}
						}
						if (reordered) break;
					}
					if (reordered) break;
				}
				if (reordered) break;
			}

			if (reordered) {
				updateBlocks(newBlocks);
			}
		}

		setActiveId(null);
		setOverId(null);
	};

	const handleBlockUpdate = (id: string, updates: Partial<ContentBlock>) => {
		const updateBlockRecursive = (
			blockList: ContentBlock[]
		): ContentBlock[] => {
			return blockList.map((block) => {
				if (block.id === id) {
					const next = { ...block, ...updates };
					if (updates.config) {
						next.config = { ...block.config, ...updates.config };
					}
					// StylePanel sends the full desired style object (supports clearing keys)
					if (updates.style !== undefined) {
						next.style = updates.style;
					}
					const nextTag = next.config?.htmlTag;
					if (
						next.type === "section" &&
						nextTag &&
						nextTag !== block.config?.htmlTag
					) {
						next.name =
							nextTag.charAt(0).toUpperCase() + nextTag.slice(1);
					}
					return next;
				}
				if (block.children) {
					return {
						...block,
						children: block.children.map((column) =>
							updateBlockRecursive(column)
						)
					};
				}
				return block;
			});
		};

		const newBlocks = updateBlockRecursive(blocks);
		updateBlocks(newBlocks);

		if (selectedBlock?.id === id) {
			setSelectedBlock({
				...selectedBlock,
				...updates,
				config: updates.config
					? { ...selectedBlock.config, ...updates.config }
					: selectedBlock.config,
				style:
					updates.style !== undefined
						? updates.style
						: selectedBlock.style
			});
		}
	};

	const handleBlockDelete = (id: string) => {
		const target = findBlockById(blocks, id);
		if (
			target?.type === "section" &&
			blocks.filter((b) => b.type === "section").length <= 1
		) {
			return;
		}

		const deleteBlockRecursive = (
			blockList: ContentBlock[]
		): ContentBlock[] => {
			return blockList
				.filter((block) => block.id !== id)
				.map((block) => {
					if (block.children) {
						return {
							...block,
							children: block.children.map((column) =>
								deleteBlockRecursive(column)
							)
						};
					}
					return block;
				});
		};

		const newBlocks = deleteBlockRecursive(blocks);
		updateBlocks(
			newBlocks.length === 0 ? normalizeToSections([]) : newBlocks
		);

		if (selectedBlock?.id === id) {
			setSelectedBlock(null);
		}
	};

	const handleBlockDuplicate = (id: string) => {
		const duplicateInList = (list: ContentBlock[]): boolean => {
			const index = list.findIndex((block) => block.id === id);
			if (index === -1) return false;

			const blockToDuplicate = list[index]!;
			const newBlock: ContentBlock = {
				...structuredClone(blockToDuplicate),
				id: uuidv4(),
				name: `${blockToDuplicate.name} (Copy)`
			};

			if (newBlock.type === "section" && newBlock.children) {
				newBlock.children = newBlock.children.map((column) =>
					column.map((child) => ({
						...structuredClone(child),
						id: uuidv4()
					}))
				);
			}

			list.splice(index + 1, 0, newBlock);
			return true;
		};

		const newBlocks = [...blocks];
		if (duplicateInList(newBlocks)) {
			updateBlocks(newBlocks);
			return;
		}

		for (const block of newBlocks) {
			if (!block.children) continue;
			for (const column of block.children) {
				if (duplicateInList(column)) {
					updateBlocks(newBlocks);
					return;
				}
				for (const child of column) {
					if (!child.children) continue;
					for (const nestedCol of child.children) {
						if (duplicateInList(nestedCol)) {
							updateBlocks(newBlocks);
							return;
						}
					}
				}
			}
		}
	};

	const handleBlockSelect = (block: ContentBlock | null) => {
		setSelectedBlock(block);
	};

	const getAllBlockIds = (blockList: ContentBlock[]): string[] => {
		const ids: string[] = [];

		if (!blockList) return ids;

		for (const block of blockList) {
			ids.push(block.id);
			if (block.children) {
				for (const column of block.children) {
					ids.push(...getAllBlockIds(column));
				}
			}
		}
		return ids;
	};

	const sortableItems = multipleSections
		? blocks.map((b) => b.id)
		: getSectionInnerBlocks(blocks[0]).map((b) => b.id);

	return (
		<div className={`content-editor ${className}`}>
			<DndContext
				sensors={sensors}
				collisionDetection={customCollisionDetection}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
			>
				<Sidebar
					multipleSections={multipleSections}
					onImportContent={() => setImportContentOpen(true)}
				/>

				<div className="content-editor-main">
					<SortableContext
						items={
							sortableItems.length
								? sortableItems
								: getAllBlockIds(blocks)
						}
						strategy={verticalListSortingStrategy}
					>
						<Canvas
							blocks={blocks}
							multipleSections={multipleSections}
							selectedBlock={selectedBlock}
							onBlockSelect={handleBlockSelect}
							onBlockUpdate={handleBlockUpdate}
							onBlockDelete={handleBlockDelete}
							onBlockDuplicate={handleBlockDuplicate}
						/>
					</SortableContext>
				</div>

				<PropertiesPanel
					selectedBlock={selectedBlock}
					onBlockUpdate={handleBlockUpdate}
					multipleSections={multipleSections}
				/>

				<DragOverlay>
					{activeId ? (
						<div className="drag-overlay">
							{activeId.toString().startsWith("sidebar-")
								? activeId
										.toString()
										.replace("sidebar-", "")
										.toUpperCase()
								: findBlockById(blocks, activeId.toString())
										?.name || "Block"}
						</div>
					) : null}
				</DragOverlay>
			</DndContext>

			<ImportContentModal
				isOpen={importContentOpen}
				onClose={() => setImportContentOpen(false)}
				onImport={(content) => {
					insertBlock(createContentReferenceBlock(content));
				}}
			/>
		</div>
	);
}
