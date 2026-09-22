"use client";

import { useCallback, useLayoutEffect, useMemo } from "react";
import { create } from "zustand";
import { temporal } from "zundo";
import { cloneDeep, get, isEqual, set } from "lodash-es";

type Primitive = string | number | boolean | bigint | symbol | null | undefined;

type Join<K extends string, P extends string> = `${K}.${P}`;

type Prev = [never, 0, 1, 2, 3, 4, 5];

export type PageDataPaths<T, D extends number = 4> = [D] extends [never]
	? never
	: T extends Primitive
		? never
		: T extends ReadonlyArray<infer V>
			?
					| `${number}`
					| Join<`${number}`, PageDataPaths<NonNullable<V>, Prev[D]>>
			: {
					[K in keyof T & string]: T[K] extends Primitive | undefined
						? K
						:
								| K
								| Join<
										K,
										PageDataPaths<
											NonNullable<T[K]>,
											Prev[D]
										>
								  >;
				}[keyof T & string];

export type PageDataPathValue<
	T,
	P extends string
> = P extends `${infer K}.${infer Rest}`
	? T extends ReadonlyArray<infer V>
		? K extends `${number}`
			? PageDataPathValue<NonNullable<V>, Rest>
			: never
		: K extends keyof T
			? PageDataPathValue<NonNullable<T[K]>, Rest>
			: never
	: T extends ReadonlyArray<infer V>
		? P extends `${number}`
			? V
			: never
		: P extends keyof T
			? T[P]
			: never;

export type SetPageData<T> = <K extends PageDataPaths<T> | string>(
	key: K,
	value: K extends PageDataPaths<T> ? PageDataPathValue<T, K> : unknown,
	debounce?: number
) => void;

export type PageDataUpdateObject<T> = (data: T) => {
	[key: string]:
		| string
		| number
		| boolean
		| object
		| Array<unknown>
		| undefined;
};

export type PageDataUpdatePayload = {
	[key: string]:
		| string
		| number
		| boolean
		| object
		| Array<unknown>
		| undefined;
};

export type PageDataUpdateOptions<T> = {
	className: string;
	updateObject: PageDataUpdateObject<T>;
	message?: string;
	collection?: boolean;
	useMasterKey?: boolean;
};

export type PageDataCollectionUpdate = {
	objectId: string;
	updateObject: PageDataUpdatePayload;
};

type CollectionRow = { objectId?: string };

export type SetPageRowData<T> =
	T extends ReadonlyArray<infer R>
		? <K extends PageDataPaths<R> | string>(
				objectId: string,
				key: K,
				value: K extends PageDataPaths<R>
					? PageDataPathValue<R, K>
					: unknown,
				debounce?: number
			) => void
		: (
				objectId: string,
				key: string,
				value: unknown,
				debounce?: number
			) => void;

type PageDataOptions<T> = {
	initialData?: T;
	objectId?: string;
};

type FieldOverlay = Record<string, Record<string, unknown>>;

type RowPatch = {
	objectId: string;
	key: string;
	value: unknown;
};

type PageDataState = {
	mode: "document" | "collection";
	className: string | null;
	data: unknown;
	initialData: unknown;
	serverRows: CollectionRow[] | null;
	drafts: FieldOverlay;
	committed: FieldOverlay;
	setData: (data: unknown) => void;
	setDraft: (objectId: string, key: string, value: unknown) => void;
	applyRowPatches: (patches: RowPatch[]) => void;
	resetData: () => void;
	initialize: (data: unknown) => void;
	syncServerRows: (rows: CollectionRow[], className: string) => void;
	commitCollection: () => void;
};

const PARSE_META_KEYS = new Set([
	"objectId",
	"createdAt",
	"updatedAt",
	"ACL",
	"__type",
	"className"
]);

const isCollectionRowArray = (value: unknown): value is CollectionRow[] =>
	Array.isArray(value);

const getRowObjectId = (row: unknown): string | undefined => {
	if (row && typeof row === "object" && "objectId" in row) {
		const objectId = (row as CollectionRow).objectId;
		return typeof objectId === "string" ? objectId : undefined;
	}
	return undefined;
};

const hasDrafts = (overlay: FieldOverlay) =>
	Object.values(overlay).some((fields) => Object.keys(fields).length > 0);

const applyFields = (
	row: CollectionRow,
	fields: Record<string, unknown> | undefined
): CollectionRow => {
	if (!fields || Object.keys(fields).length === 0) return row;
	const next = cloneDeep(row);
	Object.entries(fields).forEach(([key, value]) => {
		set(next, key, value);
	});
	return next;
};

const overlayRow = (
	row: CollectionRow,
	committed: FieldOverlay,
	drafts: FieldOverlay
): CollectionRow => {
	const objectId = getRowObjectId(row);
	if (!objectId) return row;
	return applyFields(applyFields(row, committed[objectId]), drafts[objectId]);
};

const baselineValue = (
	row: CollectionRow | undefined,
	committed: FieldOverlay,
	objectId: string,
	key: string
): unknown => {
	const confirmed = committed[objectId];
	if (confirmed && Object.hasOwn(confirmed, key)) return confirmed[key];
	return row ? get(row, key) : undefined;
};

const withDraftValue = (
	drafts: FieldOverlay,
	serverRows: CollectionRow[] | null,
	committed: FieldOverlay,
	objectId: string,
	key: string,
	value: unknown
): FieldOverlay => {
	const row = serverRows?.find((item) => getRowObjectId(item) === objectId);
	const next: FieldOverlay = { ...drafts };
	const rowDrafts = { ...(next[objectId] ?? {}) };
	if (isEqual(value, baselineValue(row, committed, objectId, key))) {
		delete rowDrafts[key];
	} else {
		rowDrafts[key] = value;
	}
	if (Object.keys(rowDrafts).length === 0) delete next[objectId];
	else next[objectId] = rowDrafts;
	return next;
};

const pruneOverlay = (
	rows: CollectionRow[],
	overlay: FieldOverlay
): FieldOverlay => {
	const visible = new Set(
		rows
			.map((row) => getRowObjectId(row))
			.filter((objectId): objectId is string => Boolean(objectId))
	);
	const next: FieldOverlay = {};
	Object.entries(overlay).forEach(([objectId, fields]) => {
		if (!visible.has(objectId)) return;
		const row = rows.find((item) => getRowObjectId(item) === objectId);
		const kept: Record<string, unknown> = {};
		Object.entries(fields).forEach(([key, value]) => {
			if (!row || !isEqual(get(row, key), value)) kept[key] = value;
		});
		if (Object.keys(kept).length > 0) next[objectId] = kept;
	});
	return next;
};

const mergeOverlay = (
	base: FieldOverlay,
	extra: FieldOverlay
): FieldOverlay => {
	const next: FieldOverlay = { ...base };
	Object.entries(extra).forEach(([objectId, fields]) => {
		next[objectId] = { ...(next[objectId] ?? {}), ...fields };
	});
	return next;
};

const diffCollectionRow = (
	current: Record<string, unknown>,
	initial: Record<string, unknown> | undefined
): PageDataUpdatePayload => {
	const payload: PageDataUpdatePayload = {};
	const keys = new Set([
		...Object.keys(current),
		...(initial ? Object.keys(initial) : [])
	]);

	keys.forEach((key) => {
		if (PARSE_META_KEYS.has(key)) return;
		if (!isEqual(current[key], initial?.[key])) {
			payload[key] = current[key] as PageDataUpdatePayload[string];
		}
	});

	return payload;
};

const applyPathValue = <T>(data: T, key: string, value: unknown): T => {
	const next = cloneDeep(data);
	set(next as object, key, value);
	return next;
};

const usePageDataStore = create<PageDataState>()(
	temporal(
		(setState, getState) => ({
			mode: "document",
			className: null,
			data: null,
			initialData: null,
			serverRows: null,
			drafts: {},
			committed: {},
			setData: (data) => setState({ data }),
			setDraft: (objectId, key, value) => {
				const state = getState();
				setState({
					mode: "collection",
					drafts: withDraftValue(
						state.drafts,
						state.serverRows,
						state.committed,
						objectId,
						key,
						value
					)
				});
			},
			applyRowPatches: (patches) => {
				const state = getState();
				const drafts = patches.reduce(
					(next, patch) =>
						withDraftValue(
							next,
							state.serverRows,
							state.committed,
							patch.objectId,
							patch.key,
							patch.value
						),
					state.drafts
				);
				setState({ mode: "collection", drafts });
			},
			resetData: () => {
				const { pause, resume, clear } =
					usePageDataStore.temporal.getState();
				pause();
				if (getState().mode === "collection") {
					setState({ drafts: {} });
				} else {
					setState({ data: getState().initialData });
				}
				clear();
				resume();
			},
			initialize: (data) => {
				const { pause, resume, clear } =
					usePageDataStore.temporal.getState();
				pause();
				setState({
					mode: "document",
					className: null,
					data,
					initialData: data,
					serverRows: null,
					drafts: {},
					committed: {}
				});
				clear();
				resume();
			},
			syncServerRows: (rows, className) => {
				const state = getState();
				const { pause, resume, clear } =
					usePageDataStore.temporal.getState();
				const switchingMode = state.mode !== "collection";
				const switchingClass =
					state.className != null && state.className !== className;
				const committed =
					switchingMode || switchingClass
						? {}
						: pruneOverlay(rows, state.committed);
				const drafts =
					switchingMode || switchingClass
						? {}
						: pruneOverlay(rows, state.drafts);
				if (
					!switchingMode &&
					!switchingClass &&
					isEqual(state.serverRows, rows) &&
					isEqual(state.committed, committed) &&
					isEqual(state.drafts, drafts)
				) {
					return;
				}
				pause();
				setState({
					mode: "collection",
					className,
					serverRows: rows,
					committed,
					drafts,
					...(switchingMode ? { data: null, initialData: null } : {})
				});
				if (switchingMode || switchingClass) clear();
				resume();
			},
			commitCollection: () => {
				const state = getState();
				const { pause, resume, clear } =
					usePageDataStore.temporal.getState();
				pause();
				setState({
					committed: mergeOverlay(state.committed, state.drafts),
					drafts: {}
				});
				clear();
				resume();
			}
		}),
		{
			partialize: (state) => ({
				data: state.data,
				drafts: state.drafts
			}),
			equality: (pastState, currentState) =>
				isEqual(pastState, currentState)
		}
	)
);

const updateOptionsRef: {
	current: PageDataUpdateOptions<unknown> | null;
} = { current: null };

const objectIdRef: { current: string | null } = { current: null };

type PendingPatch =
	| { kind: "document"; key: string; value: unknown }
	| (RowPatch & { kind: "row" });

const pendingPatches = new Map<string, PendingPatch>();
let pendingTimeout: ReturnType<typeof setTimeout> | null = null;

const rowPatchKey = (objectId: string, key: string) => `${objectId}\0${key}`;

const cancelPending = () => {
	if (pendingTimeout) {
		clearTimeout(pendingTimeout);
		pendingTimeout = null;
	}
	pendingPatches.clear();
};

const flushPendingNow = () => {
	if (pendingTimeout) {
		clearTimeout(pendingTimeout);
		pendingTimeout = null;
	}
	if (pendingPatches.size === 0) return;

	const patches = Array.from(pendingPatches.values());
	pendingPatches.clear();
	const store = usePageDataStore.getState();
	const rowPatches = patches.filter(
		(patch): patch is RowPatch & { kind: "row" } => patch.kind === "row"
	);
	if (rowPatches.length > 0) {
		store.applyRowPatches(rowPatches);
	}

	const documentPatches = patches.filter(
		(patch): patch is { kind: "document"; key: string; value: unknown } =>
			patch.kind === "document"
	);
	if (documentPatches.length === 0) return;
	const current = usePageDataStore.getState().data;
	if (current == null) return;
	let next = current;
	documentPatches.forEach((patch) => {
		next = applyPathValue(next, patch.key, patch.value);
	});
	usePageDataStore.getState().setData(next);
};

const scheduleFlush = (delay: number) => {
	if (pendingTimeout) clearTimeout(pendingTimeout);
	pendingTimeout = setTimeout(() => {
		pendingTimeout = null;
		flushPendingNow();
	}, delay);
};

const usePageData = <T = unknown>(
	options?: PageDataOptions<T>,
	updateOptions?: PageDataUpdateOptions<T>
) => {
	if (options?.objectId !== undefined) {
		objectIdRef.current = options.objectId;
	}

	if (updateOptions !== undefined) {
		updateOptionsRef.current =
			updateOptions as PageDataUpdateOptions<unknown>;
	}

	const mode = usePageDataStore((state) => state.mode);
	const data = usePageDataStore((state) => state.data) as T | null;
	const storedInitialData = usePageDataStore(
		(state) => state.initialData
	) as T | null;
	const serverRows = usePageDataStore((state) => state.serverRows);
	const drafts = usePageDataStore((state) => state.drafts);
	const committed = usePageDataStore((state) => state.committed);
	const setStoreData = usePageDataStore((state) => state.setData) as (
		data: T
	) => void;
	const resetStoreData = usePageDataStore((state) => state.resetData);

	const initialData = options?.initialData;
	const collectionMode = Boolean(updateOptions?.collection);
	const incomingDiffersFromStore =
		!collectionMode &&
		initialData !== undefined &&
		!isEqual(storedInitialData, initialData);

	useLayoutEffect(() => {
		if (!collectionMode || !isCollectionRowArray(initialData)) return;
		usePageDataStore
			.getState()
			.syncServerRows(initialData, updateOptions?.className ?? "");
	}, [collectionMode, initialData, updateOptions?.className]);

	useLayoutEffect(() => {
		if (collectionMode || initialData === undefined) return;
		if (mode !== "collection" && isEqual(storedInitialData, initialData)) {
			return;
		}
		cancelPending();
		usePageDataStore.getState().initialize(initialData);
	}, [collectionMode, mode, initialData, storedInitialData]);

	useLayoutEffect(() => {
		return () => {
			flushPendingNow();
		};
	}, []);

	const setDataInternal = useCallback(
		(key: string, value: unknown, debounce?: number) => {
			if (!debounce) {
				pendingPatches.delete(key);
				const current = usePageDataStore.getState().data as T | null;
				if (current == null) return;
				setStoreData(applyPathValue(current, key, value));
				return;
			}

			pendingPatches.set(key, { kind: "document", key, value });
			scheduleFlush(debounce);
		},
		[setStoreData]
	);
	const setData = setDataInternal as SetPageData<T>;

	const resetData = useCallback(() => {
		cancelPending();
		resetStoreData();
	}, [resetStoreData]);

	const undo = useCallback((steps?: number) => {
		cancelPending();
		usePageDataStore.temporal.getState().undo(steps);
	}, []);

	const redo = useCallback((steps?: number) => {
		cancelPending();
		usePageDataStore.temporal.getState().redo(steps);
	}, []);

	const setRowData = useCallback(
		(objectId: string, key: string, value: unknown, debounce?: number) => {
			const state = usePageDataStore.getState();
			if (collectionMode || state.mode === "collection") {
				const patchKey = rowPatchKey(objectId, key);
				if (!debounce) {
					pendingPatches.delete(patchKey);
					state.setDraft(objectId, key, value);
					return;
				}
				pendingPatches.set(patchKey, {
					kind: "row",
					objectId,
					key,
					value
				});
				scheduleFlush(debounce);
				return;
			}

			if (objectIdRef.current === objectId) {
				setDataInternal(key, value, debounce);
			}
		},
		[collectionMode, setDataInternal]
	) as SetPageRowData<T>;

	const prepareData = useCallback(() => {
		flushPendingNow();
		return usePageDataStore.getState().data as T | null;
	}, []);

	const prepareCollectionUpdates =
		useCallback((): PageDataCollectionUpdate[] => {
			flushPendingNow();
			const { drafts: currentDrafts, serverRows: rows } =
				usePageDataStore.getState();
			if (!rows) return [];

			const updates: PageDataCollectionUpdate[] = [];
			Object.entries(currentDrafts).forEach(([objectId, fields]) => {
				if (Object.keys(fields).length === 0) return;
				const serverRow = rows.find(
					(row) => getRowObjectId(row) === objectId
				);
				if (!serverRow) return;
				const updateObject = diffCollectionRow(
					applyFields(serverRow, fields) as Record<string, unknown>,
					serverRow as Record<string, unknown>
				);
				if (Object.keys(updateObject).length === 0) return;
				updates.push({ objectId, updateObject });
			});

			return updates;
		}, []);

	const commitData = useCallback(() => {
		const state = usePageDataStore.getState();
		if (state.mode === "collection") {
			state.commitCollection();
			return;
		}
		if (state.data != null) {
			state.initialize(state.data);
		}
	}, []);

	const collectionData = useMemo(() => {
		if (mode !== "collection" || !serverRows) return null;
		return serverRows.map((row) => overlayRow(row, committed, drafts));
	}, [mode, serverRows, committed, drafts]);

	const displayedData = (
		mode === "collection"
			? collectionData
			: incomingDiffersFromStore
				? initialData
				: data
	) as T | null;

	const documentDirty = !isEqual(data, storedInitialData);

	return {
		data: (displayedData ?? initialData ?? null) as T | null,
		setData,
		setRowData,
		updateOptions:
			updateOptionsRef.current as PageDataUpdateOptions<T> | null,
		objectId: objectIdRef.current,
		prepareData,
		prepareCollectionUpdates,
		commitData,
		undo,
		redo,
		dataHasChanged:
			mode === "collection"
				? hasDrafts(drafts)
				: incomingDiffersFromStore
					? false
					: documentDirty,
		resetData
	};
};

export default usePageData;
