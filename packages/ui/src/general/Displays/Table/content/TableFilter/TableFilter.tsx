"use client";

import { FC, useCallback, useMemo, useState } from "react";
import { SlideIn } from "@repo/ui";
import { Filter as FilterIcon, Check } from "lucide-react";
import { ColumnInfo, TableFilterProps } from "./types";
import { FilterButton } from "./components/FilterButton";
import "./styles.scss";
import { ColumnDataTypes } from "../../types";
import { Filter } from "@repo/types";
import {
	StringFilter,
	BooleanFilter,
	DateFilter,
	LocationFilter
} from "./content/Filter";

const getDefaultOperator = (type: ColumnDataTypes) => {
	switch (type) {
		case "string":
		case "edit_string":
		case "textfield":
		case "edit_textfield":
		case "texteditor":
		case "edit_texteditor":
			return "_eq";
		case "boolean":
			return "_eq";
		case "image":
		case "edit_image":
		case "gallery":
		case "image_preview":
		case "files":
		case "file":
			return "_ne";
		case "date":
		case "edit_date":
		case "date_picker":
		case "edit_dates":
			return "_eq";
		default:
			return "_eq";
	}
};

const getTypeLabel = (type: ColumnDataTypes): string => {
	const typeLabels: Record<string, string> = {
		string: "Text",
		edit_string: "Text",
		textfield: "Textfeld",
		edit_textfield: "Textfeld",
		texteditor: "Editor",
		edit_texteditor: "Editor",
		boolean: "Boolean",
		image: "Bild",
		edit_image: "Bild",
		gallery: "Galerie",
		image_preview: "Bildvorschau",
		files: "Dateien",
		file: "Datei",
		date: "Datum",
		edit_date: "Datum",
		date_picker: "Datum",
		edit_dates: "Datum",
		person: "Person",
		edit_person: "Person",
		edit_persons: "Personen",
		user: "Benutzer",
		updated_by: "Aktualisiert von",
		created_by: "Erstellt von",
		state: "Status",
		edit_state: "Status",
		category: "Kategorie",
		edit_color: "Farbe",
		edit_role: "Rolle",
		geopoint: "Standort",
		edit_geopoint: "Standort",
		content: "Inhalt",
		edit_content: "Inhalt",
		connected_elements: "Verbunden",
		edit_webpage_components: "Komponenten",
		edit_team: "Team",
		edit_times: "Zeiten"
	};
	return typeLabels[type] || type;
};

const TableFilter: FC<TableFilterProps> = ({
	filterColumns,
	filters,
	setFilters
}) => {
	const [isOpen, setIsOpen] = useState(false);
	console.log(filterColumns);

	// Extract column information from column definitions
	const columnInfos = useMemo(() => {
		const infos: ColumnInfo[] = [];

		filterColumns.forEach((column) => {
			const col = column as { id?: string; accessorKey?: string };
			const columnId = col.id || col.accessorKey || "";
			const columnLabel = column.label;

			const columnType: ColumnDataTypes = column.type;

			if (columnId) {
				infos.push({
					id: columnId,
					label: columnLabel,
					type: columnType
				});
			}
		});

		return infos;
	}, [filterColumns]);

	const activeFilterCount = useMemo(() => filters.length, [filters]);

	const isFilterActive = useCallback(
		(columnId: string) => {
			return filters.some((f) => f.id === columnId);
		},
		[filters]
	);

	const getActiveFilter = useCallback(
		(columnId: string) => {
			return filters.find((f) => f.id === columnId);
		},
		[filters]
	);

	const toggleFilter = useCallback(
		(columnInfo: ColumnInfo) => {
			const existingFilter = filters.find((f) => f.id === columnInfo.id);

			if (existingFilter) {
				// Remove filter
				setFilters((prev) =>
					prev.filter((f) => f.id !== columnInfo.id)
				);
			} else {
				// Add filter
				const newFilter: Filter = {
					id: columnInfo.id,
					key: columnInfo.id,
					operator: getDefaultOperator(columnInfo.type),
					value: ""
				};
				setFilters((prev) => [...prev, newFilter]);
			}
		},
		[filters, setFilters]
	);

	const updateFilterValue = useCallback(
		(columnId: string, value: Filter["value"]) => {
			setFilters((prev) =>
				prev.map((f) => (f.id === columnId ? { ...f, value } : f))
			);
		},
		[setFilters]
	);

	const updateFilterOperator = useCallback(
		(columnId: string, operator: Filter["operator"]) => {
			setFilters((prev) =>
				prev.map((f) =>
					f.id === columnId ? { ...f, operator, value: "" } : f
				)
			);
		},
		[setFilters]
	);

	const renderFilterInput = useCallback(
		(columnInfo: ColumnInfo, filter: Filter) => {
			const filterProps = {
				filter: {
					...filter,
					columnType: columnInfo.type,
					columnLabel: columnInfo.label
				},
				onValueChange: (value: Filter["value"]) =>
					updateFilterValue(columnInfo.id, value),
				onOperatorChange: (operator: Filter["operator"]) =>
					updateFilterOperator(columnInfo.id, operator)
			};

			switch (columnInfo.type) {
				case "string":
				case "edit_string":
				case "textfield":
				case "edit_textfield":
				case "texteditor":
				case "edit_texteditor":
				case "person":
				case "edit_person":
				case "edit_persons":
				case "user":
				case "updated_by":
				case "created_by":
				case "state":
				case "edit_state":
				case "category":
				case "edit_color":
				case "edit_role":
					return <StringFilter {...filterProps} />;
				case "location":
					return <LocationFilter {...filterProps} />;

				case "boolean":
					return <BooleanFilter {...filterProps} />;

				case "geopoint":
				case "edit_geopoint":
				case "image":
				case "edit_image":
				case "gallery":
				case "image_preview":
				case "files":
				case "file":
				case "content":
				case "edit_content":
				case "connected_elements":
				case "edit_webpage_components":
				case "edit_team":
				case "edit_times":
				case "date":
				case "edit_date":
				case "date_picker":
				case "edit_dates":
					return <DateFilter {...filterProps} />;

				default:
					return <StringFilter {...filterProps} />;
			}
		},
		[updateFilterValue, updateFilterOperator]
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
						{columnInfos.map((columnInfo) => {
							const isActive = isFilterActive(columnInfo.id);
							const activeFilter = getActiveFilter(columnInfo.id);

							return (
								<div
									key={columnInfo.id}
									className="filter-select-item"
									data-selected={isActive}
								>
									<button
										type="button"
										className="filter-select-button"
										onClick={() => toggleFilter(columnInfo)}
										data-selected={isActive}
									>
										<div className="filter-select-checkbox">
											{isActive && <Check size={14} />}
										</div>
										<div className="filter-select-info">
											<span className="filter-select-label">
												{columnInfo.label}
											</span>
											<span className="filter-select-type">
												{getTypeLabel(columnInfo.type)}
											</span>
										</div>
									</button>

									{isActive && activeFilter && (
										<div className="filter-input-section">
											{renderFilterInput(
												columnInfo,
												activeFilter
											)}
										</div>
									)}
								</div>
							);
						})}
					</div>

					{columnInfos.length === 0 && (
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
