"use client";

import { useCallback, useRef, useState } from "react";
import {
	CreateButton,
	Divider,
	DnDDisplay,
	SlideIn,
	sortItemsByPosition,
	usePageData
} from "@repo/ui";
import { v4 } from "uuid";
import { cloneDeep } from "lodash-es";
import { useDataHandlerSecure } from "@repo/provider";
import { ErrorMessage } from "@repo/types";
import AppModuleFilter from "./components/AppModuleFilter";
import AppModuleEditFilter from "./components/AppModuleEditFilter";
import {
	AppModuleEditFiltersProps,
	ModuleFilter,
	ModuleFiltersPageData
} from "./types";

const DEFAULT_FILTER: Omit<ModuleFilter, "id"> = {
	field: "",
	type: "string",
	operator: "equalTo",
	label: "Neuer Filter",
	position: 0
};

const AppModuleEditFilters = ({
	objectId,
	initialFilters,
	modulePath,
	modules,
	settingsFields,
	dataFields,
	additionnalFields,
	updateOptions,
	refetch
}: AppModuleEditFiltersProps) => {
	const { data, setData } = usePageData<ModuleFiltersPageData>(
		{ initialData: { filters: initialFilters || [] }, objectId },
		updateOptions
	);
	const { updateData } = useDataHandlerSecure();
	const [activeFilter, setActiveFilter] = useState("");
	const [saving, setSaving] = useState(false);
	const [errors, setErrors] = useState<ErrorMessage[]>([]);
	const draftRef = useRef<ModuleFilter | null>(null);

	const filters = data?.filters ?? [];

	const findActiveFilter = useCallback(
		(id: string) => filters.find((filter) => filter.id === id),
		[filters]
	);

	const openEditor = useCallback(
		(id: string) => {
			const found = filters.find((item) => item.id === id);
			draftRef.current = found ? cloneDeep(found) : null;
			setActiveFilter(id);
		},
		[filters]
	);

	const deleteFilter = useCallback(
		(id: string) => {
			setData(
				"filters",
				filters.filter((filter) => filter.id !== id)
			);
			if (activeFilter === id) {
				setActiveFilter("");
			}
		},
		[activeFilter, filters, setData]
	);

	const handleLocalChange = useCallback((draft: ModuleFilter) => {
		draftRef.current = draft;
	}, []);

	const closeEditor = useCallback(() => {
		draftRef.current = null;
		setErrors([]);
		setActiveFilter("");
	}, []);

	const confirmEditor = useCallback(async () => {
		const draft = draftRef.current;
		if (!draft) {
			closeEditor();
			return;
		}

		const nextFilters = filters.map((item) =>
			item.id === draft.id ? draft : item
		);

		setSaving(true);
		setErrors([]);

		let failed = false;
		await updateData({
			className: "Module",
			objectId,
			updateObject: {
				filters: nextFilters
			},
			feedback: "Filter gespeichert",
			onError: (message) => {
				failed = true;
				setErrors([
					{
						id: "save",
						key: "save",
						message
					}
				]);
			}
		});

		setSaving(false);
		if (failed) return;

		await refetch();
		closeEditor();
	}, [closeEditor, filters, objectId, refetch, updateData]);

	const activeFilterData = findActiveFilter(activeFilter);

	if (!data) return null;

	return (
		<div className="content_element">
			<CreateButton
				text="Filter hinzufügen"
				size="medium"
				onClick={() => {
					setData("filters", [
						...filters,
						{
							...DEFAULT_FILTER,
							id: v4(),
							position: filters.length + 1
						} as ModuleFilter
					]);
				}}
			/>
			<Divider size="small" showLine={false} />
			<DnDDisplay<ModuleFilter[]>
				items={
					sortItemsByPosition(
						filters.map((filter, index) => ({
							...filter,
							position: filter.position ?? index
						}))
					) || []
				}
				ItemComponent={({ item }) => (
					<AppModuleFilter
						filter={item as ModuleFilter}
						setActiveFilter={openEditor}
						deleteFilter={deleteFilter}
					/>
				)}
				onChange={(newItems) =>
					setData(
						"filters",
						newItems.map((filter, index) => ({
							...filter,
							position: index + 1
						}))
					)
				}
			/>
			<SlideIn
				isOpen={!!activeFilterData}
				header="Filter bearbeiten"
				cancel={closeEditor}
				confirm={confirmEditor}
				loading={saving}
				disabled={[saving, saving]}
				errors={errors}
			>
				{activeFilterData ? (
					<AppModuleEditFilter
						key={activeFilterData.id}
						filter={cloneDeep(activeFilterData)}
						onChange={handleLocalChange}
						modulePath={modulePath}
						modules={modules}
						settingsFields={settingsFields}
						dataFields={dataFields}
						additionnalFields={additionnalFields}
					/>
				) : null}
			</SlideIn>
		</div>
	);
};

export default AppModuleEditFilters;
