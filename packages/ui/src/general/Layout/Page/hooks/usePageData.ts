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

export type PageDataUpdateOptions<T> = {
	className: string;
	updateObject: PageDataUpdateObject<T>;
	message?: string;
};

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
	const storeNeedsInitialData =
		initialData !== undefined && !isEqual(storedInitialData, initialData);

	useLayoutEffect(() => {
		if (!storeNeedsInitialData) return;
		cancelPendingSetData();
		usePageDataStore.getState().initialize(initialData);
	}, [storeNeedsInitialData, initialData, cancelPendingSetData]);

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

	const setData = useCallback(
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
	) as SetPageData<T>;

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

	const prepareData = useCallback(() => {
		flushPendingSetData();
		return usePageDataStore.getState().data as T | null;
	}, [flushPendingSetData]);

	const commitData = useCallback(() => {
		const current = usePageDataStore.getState().data;
		if (current != null) {
			usePageDataStore.getState().initialize(current);
		}
	}, []);

	return {
		data: ((storeNeedsInitialData ? initialData : data) ??
			initialData ??
			null) as T | null,
		setData,
		updateOptions:
			updateOptionsRef.current as PageDataUpdateOptions<T> | null,
		objectId: objectIdRef.current,
		prepareData,
		commitData,
		undo,
		redo,
		dataHasChanged: storeNeedsInitialData
			? false
			: !isEqual(data, storedInitialData),
		resetData
	};
};

export default usePageData;
