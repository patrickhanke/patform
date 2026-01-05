"use client";

import { FC, useCallback, useMemo } from "react";
import { FilterRowProps } from "./types";
import { X } from "lucide-react";
import "../../styles.scss";
import { Filter, FilterOperator } from "@repo/types";
import {
	StringFilter,
	BooleanFilter,
	ImageFilter,
	DateFilter
} from "../../content/Filter";

const FilterRow: FC<FilterRowProps> = ({ filter, onUpdate, onRemove }) => {
	const handleValueChange = useCallback(
		(value: Filter["value"]) => {
			onUpdate({ ...filter, value });
		},
		[filter, onUpdate]
	);

	const handleOperatorChange = useCallback(
		(operator: FilterOperator) => {
			onUpdate({ ...filter, operator, value: "" });
		},
		[filter, onUpdate]
	);

	const renderFilterInput = useMemo(() => {
		const filterProps = {
			filter,
			onValueChange: handleValueChange,
			onOperatorChange: handleOperatorChange
		};

		// Map column types to filter components
		switch (filter.columnType) {
			case "string":
			case "edit_string":
			case "textfield":
			case "edit_textfield":
			case "texteditor":
			case "edit_texteditor":
				return <StringFilter {...filterProps} />;

			case "boolean":
				return <BooleanFilter {...filterProps} />;

			case "image":
			case "edit_image":
			case "gallery":
			case "image_preview":
			case "files":
			case "file":
				return <ImageFilter {...filterProps} />;

			case "date":
			case "edit_date":
			case "date_picker":
			case "edit_dates":
				return <DateFilter {...filterProps} />;

			case "person":
			case "edit_person":
			case "edit_persons":
			case "user":
			case "updated_by":
			case "created_by":
				return <StringFilter {...filterProps} />;

			case "state":
			case "edit_state":
			case "category":
			case "edit_color":
			case "edit_role":
				return <StringFilter {...filterProps} />;

			case "geopoint":
			case "edit_geopoint":
				return <BooleanFilter {...filterProps} />;

			case "content":
			case "edit_content":
			case "connected_elements":
			case "edit_webpage_components":
			case "edit_team":
			case "edit_times":
				return <ImageFilter {...filterProps} />;

			default:
				return <StringFilter {...filterProps} />;
		}
	}, [filter, handleValueChange, handleOperatorChange]);

	const getTypeLabel = (type: string): string => {
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

	return (
		<div className="filter-row-container">
			<div className="filter-row-header">
				<div className="filter-header-info">
					<span className="filter-label">{filter.columnLabel}</span>
					<span className="filter-type-tag">
						{getTypeLabel(filter.columnType)}
					</span>
				</div>
				<button
					className="remove-filter-button"
					onClick={() => onRemove(filter.id)}
					type="button"
				>
					<X size={14} />
				</button>
			</div>
			{renderFilterInput}
		</div>
	);
};

export default FilterRow;
