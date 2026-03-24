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

import "./styles.scss";

export interface ContentBlock {
	id: string;
	name: string;
	type: "text" | "button" | "divider" | "image" | "layout";
	position: number;
	value: string | any;
	active: boolean;
	children?: ContentBlock[][]; // For layout blocks: array of columns, each containing blocks
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
	};
}

export interface ContentEditorProps {
	content?: ContentBlock[];
	onChange?: (content: ContentBlock[]) => void;
	className?: string;
}

export default function ContentEditor({
	content = [],
	onChange,
	className = ""
}: ContentEditorProps) {
	const [blocks, setBlocks] = useState<ContentBlock[]>(content || []);
	const [activeId, setActiveId] = useState<string | null>(null);
	const [selectedBlock, setSelectedBlock] = useState<ContentBlock | null>(
		null
	);
	const [overId, setOverId] = useState<string | null>(null);

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
			// Update positions
			const blocksWithPositions = newBlocks.map((block, index) => ({
				...block,
				position: index + 1
			}));
			setBlocks(blocksWithPositions);
			if (onChange) {
				onChange(blocksWithPositions);
			}
		},
		[onChange]
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

	// Custom collision detection to prioritize columns
	const customCollisionDetection = (args: any) => {
		// First, check for pointer within collision with columns
		const pointerCollisions = pointerWithin(args);

		if (pointerCollisions.length > 0) {
			// Prioritize column droppables
			const columnCollision = pointerCollisions.find((collision: any) =>
				collision.id.toString().startsWith("column-")
			);
			if (columnCollision) {
				return [columnCollision];
			}
			return pointerCollisions;
		}

		// Fallback to rectangle intersection
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

		// Final fallback to closest center
		return closestCenter(args);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over) {
			setActiveId(null);
			setOverId(null);
			return;
		}

		const overId = over.id.toString();
		const activeIdStr = active.id.toString();

		console.log("Drop event:", {
			activeIdStr,
			overId,
			overData: over.data
		});

		// Check if dropping into a layout column
		if (overId.startsWith("column-")) {
			console.log("Dropping into column:", overId);
			const parts = overId.split("-");
			const columnIndex = parts[parts.length - 1]!; // Last part is columnIndex
			const layoutId = parts.slice(1, -1).join("-"); // Everything between "column-" and the last "-"
			handleDropInColumn(activeIdStr, layoutId, parseInt(columnIndex));
			setActiveId(null);
			setOverId(null);
			return;
		}

		// Check if dragging from sidebar (creating new block)
		if (activeIdStr.startsWith("sidebar-")) {
			const type = activeIdStr.replace(
				"sidebar-",
				""
			) as ContentBlock["type"];
			const newBlock = createBlock(type);

			// Find the position to insert
			const overIndex = blocks.findIndex((b) => b.id === over.id);
			const newBlocks = [...blocks];

			if (overIndex === -1) {
				// Add to end
				newBlocks.push(newBlock);
			} else {
				// Insert at position
				newBlocks.splice(overIndex, 0, newBlock);
			}

			updateBlocks(newBlocks);
		} else {
			// Reordering existing blocks (top level or within columns)
			if (active.id !== over.id) {
				const newBlocks = [...blocks];

				// Try to find and reorder within the same column
				let reordered = false;

				for (const block of newBlocks) {
					if (block.children) {
						for (let i = 0; i < block.children.length; i++) {
							const column = block.children[i];
							const oldIndex = column.findIndex(
								(b) => b.id === activeIdStr
							);
							const newIndex = column.findIndex(
								(b) => b.id === overId
							);

							if (oldIndex !== -1 && newIndex !== -1) {
								// Both blocks are in the same column
								const [movedBlock] = column.splice(oldIndex, 1);
								column.splice(newIndex, 0, movedBlock);
								reordered = true;
								break;
							}
						}
						if (reordered) break;
					}
				}

				// If not reordered within columns, try top level
				if (!reordered) {
					const oldIndex = newBlocks.findIndex(
						(b) => b.id === activeIdStr
					);
					const newIndex = newBlocks.findIndex(
						(b) => b.id === overId
					);

					if (oldIndex !== -1 && newIndex !== -1) {
						const [movedBlock] = newBlocks.splice(oldIndex, 1);
						newBlocks.splice(newIndex, 0, movedBlock);
					}
				}

				updateBlocks(newBlocks);
			}
		}

		setActiveId(null);
		setOverId(null);
	};

	const handleDropInColumn = useCallback(
		(activeIdStr: string, layoutId: string, columnIndex: number) => {
			const newBlocks = [...blocks];
			const layoutBlock = newBlocks.find((b) => b.id === layoutId);

			console.log({
				activeIdStr,
				layoutId,
				columnIndex,
				layoutBlock
			});

			if (!layoutBlock) return;

			// Initialize children array if it doesn't exist
			if (!layoutBlock.children) {
				const columnCount =
					layoutBlock.config?.columns?.split("/").length || 2;
				layoutBlock.children = Array.from(
					{ length: columnCount },
					() => []
				);
			}

			// Check if dragging from sidebar (creating new block)
			if (activeIdStr.startsWith("sidebar-")) {
				const type = activeIdStr.replace(
					"sidebar-",
					""
				) as ContentBlock["type"];
				const newBlock = createBlock(type);

				// Add to column
				layoutBlock.children[columnIndex].push(newBlock);
			} else {
				// Moving existing block into column
				// First, try to find and remove from top level
				const blockIndex = newBlocks.findIndex(
					(b) => b.id === activeIdStr
				);

				if (blockIndex !== -1) {
					const [movedBlock] = newBlocks.splice(blockIndex, 1);
					layoutBlock.children[columnIndex].push(movedBlock);
				} else {
					// Block might be in another column, find and remove it
					let foundBlock: ContentBlock | null = null;

					for (const block of newBlocks) {
						if (block.children) {
							for (let i = 0; i < block.children.length; i++) {
								const colIndex = block.children[i].findIndex(
									(b) => b.id === activeIdStr
								);
								if (colIndex !== -1) {
									[foundBlock] = block.children[i].splice(
										colIndex,
										1
									);
									break;
								}
							}
							if (foundBlock) break;
						}
					}

					if (foundBlock) {
						layoutBlock.children[columnIndex].push(foundBlock);
					}
				}
			}

			updateBlocks(newBlocks);
		},
		[blocks, updateBlocks]
	);

	const createBlock = useCallback(
		(type: ContentBlock["type"]): ContentBlock => {
			const id = uuidv4();
			const baseBlock = {
				id,
				position: blocks?.length + 1 || 1,
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
				case "layout":
					const columnCount = 2; // Default to 2 columns
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
				default:
					return {
						...baseBlock,
						name: "Block",
						type: "text",
						value: ""
					};
			}
		},
		[blocks]
	);

	const handleBlockUpdate = (id: string, updates: Partial<ContentBlock>) => {
		const updateBlockRecursive = (
			blockList: ContentBlock[]
		): ContentBlock[] => {
			return blockList.map((block) => {
				if (block.id === id) {
					return { ...block, ...updates };
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

		// Update selected block if it's the one being edited
		if (selectedBlock?.id === id) {
			setSelectedBlock({ ...selectedBlock, ...updates });
		}
	};

	const handleBlockDelete = (id: string) => {
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
		updateBlocks(newBlocks);

		if (selectedBlock?.id === id) {
			setSelectedBlock(null);
		}
	};

	const handleBlockDuplicate = (id: string) => {
		const blockToDuplicate = blocks.find((block) => block.id === id);
		if (!blockToDuplicate) return;

		const newBlock = {
			...blockToDuplicate,
			id: uuidv4(),
			name: `${blockToDuplicate.name} (Copy)`
		};

		const index = blocks.findIndex((block) => block.id === id);
		const newBlocks = [...blocks];
		newBlocks.splice(index + 1, 0, newBlock);

		updateBlocks(newBlocks);
	};

	const handleBlockSelect = (block: ContentBlock | null) => {
		setSelectedBlock(block);
	};

	// Get all block IDs including nested ones for SortableContext
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

	// Find block by ID recursively
	const findBlockById = (
		blockList: ContentBlock[],
		id: string
	): ContentBlock | null => {
		if (!blockList) return null;

		for (const block of blockList) {
			if (block.id === id) return block;
			if (block.children) {
				for (const column of block.children) {
					const found = findBlockById(column, id);
					if (found) return found;
				}
			}
		}
		return null;
	};

	return (
		<div className={`content-editor ${className}`}>
			<DndContext
				sensors={sensors}
				collisionDetection={customCollisionDetection}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
			>
				<Sidebar />

				<div className="content-editor-main">
					<SortableContext
						items={getAllBlockIds(blocks)}
						strategy={verticalListSortingStrategy}
					>
						<Canvas
							blocks={blocks}
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
		</div>
	);
}
