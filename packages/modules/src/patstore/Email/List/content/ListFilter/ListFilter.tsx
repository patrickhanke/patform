"use client";

import { FC, useCallback, useMemo, useState } from "react";
import { CreateButton, IconButton, Select } from "@repo/ui";
import { Module, PatstoreUser } from "@repo/types";
import AddListFilterSlideIn from "./components/AddListFilterSlideIn";
import { buildFilterFieldDefinitions } from "./functions/buildFilterFieldDefinitions";
import getListMembers from "../../functions/getListMembers";
import { ListFilterItem } from "./types";
import { EmailList, ListChangeHandler } from "../../types";

const FILTER_MODE_OPTIONS = [
	{ value: "all", label: "Alle Nutzer" },
	{ value: "filtered", label: "Gefiltert" }
] as const;

type FilterMode = (typeof FILTER_MODE_OPTIONS)[number]["value"];

export interface ListFilterProps {
	list: EmailList;
	users: PatstoreUser[];
	userModule: Module | undefined;
	onListChange: ListChangeHandler;
	disabled?: boolean;
}

const ListFilter: FC<ListFilterProps> = ({
	list,
	users,
	userModule,
	onListChange,
	disabled = false
}) => {
	const [isFilterSlideInOpen, setIsFilterSlideInOpen] = useState(false);
	const settings = list.settings || { static_list: true };

	const filters = useMemo(
		() =>
			(list.settings?.filters || list.filters || []) as ListFilterItem[],
		[list.settings?.filters, list.filters]
	);

	const fieldDefinitions = useMemo(
		() => buildFilterFieldDefinitions(userModule, users),
		[userModule, users]
	);

	const filterMode: FilterMode = settings.include_all_users ? "all" : "filtered";

	const dynamicListForPreview = useMemo(
		(): EmailList => ({
			...list,
			settings: { ...settings, static_list: false },
			filters
		}),
		[list, settings, filters]
	);

	const matchingUsers = useMemo(
		() => getListMembers(dynamicListForPreview, users, list.objectId),
		[dynamicListForPreview, users, list.objectId]
	);

	const updateFilters = useCallback(
		(nextFilters: ListFilterItem[]) => {
			onListChange({
				settings: {
					...settings,
					filters: nextFilters,
					static_list: false,
					include_all_users: false
				},
				filters: nextFilters
			});
		},
		[settings, onListChange]
	);

	const handleFilterModeChange = useCallback(
		(mode: FilterMode) => {
			if (mode === "all") {
				onListChange({
					settings: {
						...settings,
						static_list: false,
						include_all_users: true,
						filters: []
					},
					filters: []
				});
				return;
			}

			onListChange({
				settings: {
					...settings,
					static_list: false,
					include_all_users: false
				}
			});
		},
		[settings, onListChange]
	);

	const handleAddFilter = useCallback(
		(filter: ListFilterItem) => {
			updateFilters([...filters, filter]);
		},
		[filters, updateFilters]
	);

	const handleRemoveFilter = useCallback(
		(filterId: string) => {
			updateFilters(filters.filter((filter) => filter.id !== filterId));
		},
		[filters, updateFilters]
	);

	if (!userModule) {
		return <div>Lädt ...</div>;
	}

	return (
		<div className="flex col a-st gap-md">
			<div className="flex col gap-sm">
				<h3>Listenfilter</h3>
				<p>
					Definieren Sie, welche Nutzer in der Liste enthalten sind.
					Die Liste enthält{" "}
					<strong>{matchingUsers.length}</strong> von{" "}
					<strong>{users.length}</strong> Nutzern.
				</p>
			</div>

			<Select
				label="Listenmodus"
				id="filter-mode"
				options={FILTER_MODE_OPTIONS.map((option) => ({
					label: option.label,
					value: option.value
				}))}
				value={
					FILTER_MODE_OPTIONS.find(
						(option) => option.value === filterMode
					) ?? null
				}
				onChange={(option) => {
					const value = option?.value as FilterMode | undefined;
					if (value) {
						handleFilterModeChange(value);
					}
				}}
				isDisabled={disabled}
				width="100%"
			/>

			{filterMode === "filtered" && (
				<>
					{filters.length === 0 ? (
						<p>Keine Filter definiert.</p>
					) : (
						<div className="flex col gap-sm">
							{filters.map((filter) => {
								const fieldLabel =
									fieldDefinitions.find(
										(definition) =>
											definition.key === filter.key
									)?.label || filter.key;

								return (
									<div
										key={filter.id}
										className="flex row a-ce j-sb gap-sm"
									>
										<span>
											<strong>{fieldLabel}:</strong>{" "}
											{String(filter.value)}
										</span>
										<IconButton
											icon="delete"
											onClick={() =>
												handleRemoveFilter(filter.id)
											}
											disabled={disabled}
										/>
									</div>
								);
							})}
						</div>
					)}

					<CreateButton
						text="Filter hinzufügen"
						size="small"
						disabled={
							disabled || fieldDefinitions.length === 0
						}
						onClick={() => setIsFilterSlideInOpen(true)}
					/>

					{fieldDefinitions.length === 0 && (
						<p>
							Keine filterbaren Felder im Nutzer-Modul gefunden.
						</p>
					)}
				</>
			)}

			<AddListFilterSlideIn
				isOpen={isFilterSlideInOpen}
				setIsOpen={setIsFilterSlideInOpen}
				fieldDefinitions={fieldDefinitions}
				existingFilters={filters}
				onAdd={handleAddFilter}
				disabled={disabled}
			/>
		</div>
	);
};

export default ListFilter;
