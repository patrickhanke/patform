"use client";

import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SlideIn } from "@repo/ui";
import { Filter as FilterIcon } from "lucide-react";
import { TableFilterProps } from "./types";
import { FilterButton } from "./components/FilterButton";
import "./styles.scss";
import { Filter as FilterType, ModuleFilter } from "@repo/types";
import { Filter } from "./content";

const TableFilter: FC<TableFilterProps> = ({
	filterColumns,
	filters,
	setFilters
}) => {
	console.log({ filterColumns });
	console.log({ filters });
	const [isOpen, setIsOpen] = useState(false);

	const debounceTimers = useRef<
		Record<string, ReturnType<typeof setTimeout>>
	>({});

	const activeFilterCount = useMemo(() => filters.length, [filters]);

	const isFilterActive = useCallback(
		(columnId: string) => {
			return filters.some((f) => (f.id || f.key) === columnId);
		},
		[filters]
	);

	const getActiveFilter = useCallback(
		(columnId: string) => {
			return filters.find((f) => (f.id || f.key) === columnId);
		},
		[filters]
	);

	useEffect(() => {
		return () => {
			Object.values(debounceTimers.current).forEach(clearTimeout);
		};
	}, []);

	const toggleFilter = useCallback(
		(columnInfo: ModuleFilter) => {
			const existingFilter = filters.find((f) => f.id === columnInfo.id);

			if (existingFilter) {
				// Remove filter and clear pending debounce
				if (debounceTimers.current[columnInfo.id]) {
					clearTimeout(debounceTimers.current[columnInfo.id]);
					delete debounceTimers.current[columnInfo.id];
				}

				setFilters((prev) =>
					prev.filter((f) => f.id !== columnInfo.id)
				);
			} else {
				// Add filter - use column operator when from Module, else default
				// key = fieldKey for GraphQL (e.g. "title", "location"), id for UI matching
				const newFilter: FilterType = {
					id: columnInfo.id,
					key: columnInfo.field || columnInfo.id,
					operator: columnInfo.operator,
					value: ""
				};
				setFilters((prev) => [...prev, newFilter]);
			}
		},
		[filters, setFilters]
	);

	const updateFilterValue = useCallback(
		(columnId: string, value: FilterType["value"]) => {
			console.log("value", value);
			setFilters((prev) =>
				prev.map((f) => (f.id === columnId ? { ...f, value } : f))
			);
		},
		[]
	);

	const handleConfirm = useCallback(() => {
		setIsOpen(false);
	}, []);

	const handleCancel = useCallback(() => {
		setIsOpen(false);
	}, []);

	return (
		<>
			<FilterButton
				activeFilterCount={activeFilterCount}
				onClick={() => setIsOpen(true)}
			/>

			<SlideIn
				isOpen={isOpen}
				cancel={handleCancel}
				confirm={handleConfirm}
				header="Filter"
				confirmText="Anwenden"
			>
				<div className="filter-container">
					<div className="filter-select-list">
						{filterColumns.map((columnInfo) => {
							const isActive = isFilterActive(columnInfo.id);
							const activeFilter = getActiveFilter(columnInfo.id);

							return (
								<Filter
									key={columnInfo.id}
									id={columnInfo.id}
									type={columnInfo.type}
									label={columnInfo.label}
									operator={columnInfo.operator}
									isActive={isActive}
									activeFilter={activeFilter}
									toggleFilter={() =>
										toggleFilter(columnInfo)
									}
									updateFilterValue={updateFilterValue}
								/>
							);
						})}
					</div>

					{filterColumns.length === 0 && (
						<div className="empty-filter-state">
							<div className="empty-filter-icon">
								<FilterIcon size={24} />
							</div>
							<p className="empty-filter-text">
								Keine Spalten zum Filtern verfügbar.
							</p>
						</div>
					)}
				</div>
			</SlideIn>
		</>
	);
};

export default TableFilter;
