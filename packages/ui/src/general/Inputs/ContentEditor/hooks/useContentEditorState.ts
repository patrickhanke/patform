"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cloneDeep, isEqual } from "lodash-es";
import type { ContentBlock } from "../ContentEditor";
import { flattenSections, normalizeToSections } from "../utils/sections";

const MAX_HISTORY = 50;

const withPositions = (blocks: ContentBlock[]): ContentBlock[] =>
	blocks.map((block, index) => ({
		...block,
		position: index + 1
	}));

export const toEditorOutput = (
	blocks: ContentBlock[],
	multipleSections: boolean
): ContentBlock[] =>
	multipleSections ? blocks : flattenSections(blocks);

const snapshotBlocks = (blocks: ContentBlock[]): ContentBlock[] =>
	cloneDeep(withPositions(blocks));

const createInitialSnapshot = (content: ContentBlock[]): ContentBlock[] =>
	snapshotBlocks(normalizeToSections(content));

export const useContentEditorState = (
	content: ContentBlock[],
	multipleSections: boolean,
	onChange?: (content: ContentBlock[]) => void
) => {
	const initialSnapshotRef = useRef<ContentBlock[] | null>(null);
	if (initialSnapshotRef.current === null) {
		initialSnapshotRef.current = createInitialSnapshot(content);
	}

	const [blocks, setBlocks] = useState<ContentBlock[]>(
		() => initialSnapshotRef.current as ContentBlock[]
	);
	const [committedBlocks, setCommittedBlocks] = useState<ContentBlock[]>(() =>
		cloneDeep(initialSnapshotRef.current as ContentBlock[])
	);
	const [historyIndex, setHistoryIndex] = useState(0);

	const historyRef = useRef<ContentBlock[][]>([
		cloneDeep(initialSnapshotRef.current as ContentBlock[])
	]);
	const historyIndexRef = useRef(0);
	const committedBlocksRef = useRef(committedBlocks);
	const hasChangedRef = useRef(false);
	const isFirstRenderRef = useRef(true);

	committedBlocksRef.current = committedBlocks;

	const hasChanged = useMemo(
		() =>
			!isEqual(
				toEditorOutput(blocks, multipleSections),
				toEditorOutput(committedBlocks, multipleSections)
			),
		[blocks, committedBlocks, multipleSections]
	);
	hasChangedRef.current = hasChanged;

	const canUndo = historyIndex > 0;
	const canRedo = historyIndex < historyRef.current.length - 1;

	const replaceHistory = (next: ContentBlock[]) => {
		historyRef.current = [cloneDeep(next)];
		historyIndexRef.current = 0;
		setHistoryIndex(0);
	};

	const updateBlocks = useCallback((newBlocks: ContentBlock[]) => {
		const next = snapshotBlocks(newBlocks);
		setBlocks(next);

		const truncated = historyRef.current.slice(
			0,
			historyIndexRef.current + 1
		);
		truncated.push(cloneDeep(next));
		if (truncated.length > MAX_HISTORY) {
			truncated.shift();
		}
		historyRef.current = truncated;
		historyIndexRef.current = truncated.length - 1;
		setHistoryIndex(historyIndexRef.current);
	}, []);

	const undo = useCallback(() => {
		if (historyIndexRef.current <= 0) return;
		const nextIndex = historyIndexRef.current - 1;
		historyIndexRef.current = nextIndex;
		setHistoryIndex(nextIndex);
		setBlocks(cloneDeep(historyRef.current[nextIndex]!));
	}, []);

	const redo = useCallback(() => {
		if (historyIndexRef.current >= historyRef.current.length - 1) return;
		const nextIndex = historyIndexRef.current + 1;
		historyIndexRef.current = nextIndex;
		setHistoryIndex(nextIndex);
		setBlocks(cloneDeep(historyRef.current[nextIndex]!));
	}, []);

	const reset = useCallback(() => {
		const restored = cloneDeep(committedBlocksRef.current);
		replaceHistory(restored);
		setBlocks(restored);
	}, []);

	const commit = useCallback(() => {
		const current = cloneDeep(blocks);
		setCommittedBlocks(current);
		committedBlocksRef.current = current;
		replaceHistory(current);
		onChange?.(toEditorOutput(current, multipleSections));
	}, [blocks, multipleSections, onChange]);

	useEffect(() => {
		if (isFirstRenderRef.current) {
			isFirstRenderRef.current = false;
			return;
		}
		if (hasChangedRef.current) return;

		const incomingNormalized = normalizeToSections(content);
		const incomingOutput = toEditorOutput(
			incomingNormalized,
			multipleSections
		);
		const committedOutput = toEditorOutput(
			committedBlocksRef.current,
			multipleSections
		);
		if (isEqual(incomingOutput, committedOutput)) return;

		const snapshot = snapshotBlocks(incomingNormalized);
		setBlocks(snapshot);
		setCommittedBlocks(cloneDeep(snapshot));
		committedBlocksRef.current = snapshot;
		replaceHistory(snapshot);
	}, [content, multipleSections]);

	return {
		blocks,
		hasChanged,
		canUndo,
		canRedo,
		updateBlocks,
		undo,
		redo,
		reset,
		commit
	};
};
