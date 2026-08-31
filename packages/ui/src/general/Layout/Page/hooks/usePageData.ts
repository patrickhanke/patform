"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import { create } from "zustand";
import { temporal } from "zundo";
import { cloneDeep, isEqual, set } from "lodash-es";
import { useUnmount } from "usehooks-ts";

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

type PageDataState = {
	data: unknown;
	initialData: unknown;
	setData: (data: unknown) => void;
	resetData: () => void;
	initialize: (data: unknown) => void;
	replaceCollection: (data: unknown, initialData: unknown) => void;
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

const mergeCollectionRows = (
	incoming: CollectionRow[],
	current: CollectionRow[],
	storedInitial: CollectionRow[]
): CollectionRow[] => {
	const currentById = new Map(
		current
			.map((row) => [getRowObjectId(row), row] as const)
			.filter((entry): entry is readonly [string, CollectionRow] =>
				Boolean(entry[0])
			)
	);
	const initialById = new Map(
		storedInitial
			.map((row) => [getRowObjectId(row), row] as const)
			.filter((entry): entry is readonly [string, CollectionRow] =>
				Boolean(entry[0])
			)
	);

	return incoming.map((serverRow) => {
		const objectId = getRowObjectId(serverRow);
		if (!objectId) return serverRow;
		const currentRow = currentById.get(objectId);
		const initialRow = initialById.get(objectId);
		if (currentRow && initialRow && !isEqual(currentRow, initialRow)) {
			return currentRow;
		}
		return serverRow;
	});
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
		(setState, get) => ({
			data: null,
			initialData: null,
			setData: (data) => setState({ data }),
			resetData: () => {
				const { pause, resume, clear } =
					usePageDataStore.temporal.getState();
				pause();
				setState({ data: get().initialData });
				clear();
				resume();
			},
			initialize: (data) => {
				const { pause, resume, clear } =
					usePageDataStore.temporal.getState();
				pause();
				setState({ data, initialData: data });
				clear();
				resume();
			},
			replaceCollection: (data, initialData) => {
				const { pause, resume, clear } =
					usePageDataStore.temporal.getState();
				pause();
				setState({ data, initialData });
				clear();
				resume();
			}
		}),
		{
			partialize: (state) => ({ data: state.data }),
			equality: (pastState, currentState) =>
				isEqual(pastState, currentState)
		}
	)
);

const updateOptionsRef: {
	current: PageDataUpdateOptions<unknown> | null;
} = { current: null };

const objectIdRef: { current: string | null } = { current: null };

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

	const data = usePageDataStore((state) => state.data) as T | null;
	const storedInitialData = usePageDataStore(
		(state) => state.initialData
	) as T | null;
	const setStoreData = usePageDataStore((state) => state.setData) as (
		data: T
	) => void;
	const resetStoreData = usePageDataStore((state) => state.resetData);

	const pendingPatchesRef = useRef<Map<string, unknown>>(new Map());
	const pendingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null
	);

	const cancelPendingSetData = useCallback(() => {
		if (pendingTimeoutRef.current) {
			clearTimeout(pendingTimeoutRef.current);
			pendingTimeoutRef.current = null;
		}
		pendingPatchesRef.current.clear();
	}, []);

	const initialData = options?.initialData;
	const incomingDiffersFromStore =
		initialData !== undefined && !isEqual(storedInitialData, initialData);
	const dataIsDirty = !isEqual(data, storedInitialData);
	const shouldMergeCollection =
		incomingDiffersFromStore &&
		dataIsDirty &&
		isCollectionRowArray(initialData) &&
		isCollectionRowArray(data) &&
		isCollectionRowArray(storedInitialData);

	useLayoutEffect(() => {
		if (!incomingDiffersFromStore || initialData === undefined) return;
		cancelPendingSetData();

		const current = usePageDataStore.getState().data;
		const storedInitial = usePageDataStore.getState().initialData;
		const isDirty = !isEqual(current, storedInitial);

		if (
			isDirty &&
			isCollectionRowArray(initialData) &&
			isCollectionRowArray(current) &&
			isCollectionRowArray(storedInitial)
		) {
			usePageDataStore
				.getState()
				.replaceCollection(
					mergeCollectionRows(initialData, current, storedInitial),
					initialData
				);
			return;
		}

		usePageDataStore.getState().initialize(initialData);
	}, [incomingDiffersFromStore, initialData, cancelPendingSetData]);

	const flushPendingPatches = useCallback(() => {
		const patches = pendingPatchesRef.current;
		if (patches.size === 0) return;

		const current = usePageDataStore.getState().data as T | null;
		if (current == null) {
			patches.clear();
			pendingTimeoutRef.current = null;
			return;
		}

		let next = current;
		patches.forEach((value, key) => {
			next = applyPathValue(next, key, value);
		});
		patches.clear();
		pendingTimeoutRef.current = null;
		setStoreData(next);
	}, [setStoreData]);

	const flushPendingSetData = useCallback(() => {
		if (pendingTimeoutRef.current) {
			clearTimeout(pendingTimeoutRef.current);
			pendingTimeoutRef.current = null;
		}
		flushPendingPatches();
	}, [flushPendingPatches]);

	useUnmount(() => {
		if (pendingTimeoutRef.current) {
			clearTimeout(pendingTimeoutRef.current);
			pendingTimeoutRef.current = null;
		}
		flushPendingPatches();
	});

	const setDataInternal = useCallback(
		(key: string, value: unknown, debounce?: number) => {
			if (!debounce) {
				pendingPatchesRef.current.delete(key);
				const current = usePageDataStore.getState().data as T | null;
				if (current == null) return;
				setStoreData(applyPathValue(current, key, value));
				return;
			}

			pendingPatchesRef.current.set(key, value);
			if (pendingTimeoutRef.current) {
				clearTimeout(pendingTimeoutRef.current);
			}
			pendingTimeoutRef.current = setTimeout(
				flushPendingPatches,
				debounce
			);
		},
		[flushPendingPatches, setStoreData]
	);
	const setData = setDataInternal as SetPageData<T>;

	const resetData = useCallback(() => {
		cancelPendingSetData();
		resetStoreData();
	}, [cancelPendingSetData, resetStoreData]);

	const undo = useCallback(
		(steps?: number) => {
			cancelPendingSetData();
			usePageDataStore.temporal.getState().undo(steps);
		},
		[cancelPendingSetData]
	);

	const redo = useCallback(
		(steps?: number) => {
			cancelPendingSetData();
			usePageDataStore.temporal.getState().redo(steps);
		},
		[cancelPendingSetData]
	);

	const setRowData = useCallback(
		(objectId: string, key: string, value: unknown, debounce?: number) => {
			const current = usePageDataStore.getState().data;
			if (isCollectionRowArray(current)) {
				const index = current.findIndex(
					(row) => getRowObjectId(row) === objectId
				);
				if (index < 0) return;
				setDataInternal(`${index}.${key}`, value, debounce);
				return;
			}

			if (objectIdRef.current === objectId) {
				setDataInternal(key, value, debounce);
			}
		},
		[setDataInternal]
	) as SetPageRowData<T>;

	const prepareData = useCallback(() => {
		flushPendingSetData();
		return usePageDataStore.getState().data as T | null;
	}, [flushPendingSetData]);

	const prepareCollectionUpdates =
		useCallback((): PageDataCollectionUpdate[] => {
			flushPendingSetData();
			const current = usePageDataStore.getState().data;
			const storedInitial = usePageDataStore.getState().initialData;
			if (!isCollectionRowArray(current)) return [];

			const initialById = new Map<string, CollectionRow>();
			if (isCollectionRowArray(storedInitial)) {
				storedInitial.forEach((row) => {
					const objectId = getRowObjectId(row);
					if (objectId) initialById.set(objectId, row);
				});
			}

			const updates: PageDataCollectionUpdate[] = [];
			current.forEach((row) => {
				const objectId = getRowObjectId(row);
				if (!objectId) return;
				const initialRow = initialById.get(objectId);
				if (isEqual(row, initialRow)) return;
				const updateObject = diffCollectionRow(
					row as Record<string, unknown>,
					initialRow as Record<string, unknown> | undefined
				);
				if (Object.keys(updateObject).length === 0) return;
				updates.push({ objectId, updateObject });
			});

			return updates;
		}, [flushPendingSetData]);

	const commitData = useCallback(() => {
		const current = usePageDataStore.getState().data;
		if (current != null) {
			usePageDataStore.getState().initialize(current);
		}
	}, []);

	const displayedData = (
		shouldMergeCollection
			? mergeCollectionRows(initialData, data, storedInitialData)
			: incomingDiffersFromStore
				? initialData
				: data
	) as T | null;

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
			incomingDiffersFromStore && !shouldMergeCollection
				? false
				: !isEqual(
						shouldMergeCollection ? displayedData : data,
						shouldMergeCollection ? initialData : storedInitialData
					),
		resetData
	};
};

export default usePageData;
