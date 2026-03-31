"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import type { RowData } from "@tanstack/react-table";
import { SlideIn, SwitchButtons, type SwitchButton } from "@repo/ui";
import type { TableExportProps } from "./types";
import { exportTableToCsv } from "./functions/exportTableToCsv";
import { exportTableToPdf } from "./functions/exportTableToPdf";
import {
	buildExportGridFromColumnData,
	getExportColumnDescriptorsFromColumnData
} from "./functions/buildExportGridFromColumnData";
import "./styles.scss";

const FORMAT_OPTIONS: [SwitchButton, SwitchButton] = [
	{ label: "CSV", value: "csv" },
	{ label: "PDF", value: "pdf" }
];

function TableExport<TData extends RowData>({
	columns: columnFieldDefs,
	selectedRowData
}: TableExportProps<TData>) {
	const [isOpen, setIsOpen] = useState(false);
	const [format, setFormat] = useState<SwitchButton>(FORMAT_OPTIONS[0]);
	const [documentTitle, setDocumentTitle] = useState("");
	const [documentSubtitle, setDocumentSubtitle] = useState("");
	const [selectedFieldIds, setSelectedFieldIds] = useState<Set<string>>(
		() => new Set()
	);

	const columnDescriptors = useMemo(
		() => getExportColumnDescriptorsFromColumnData(columnFieldDefs),
		[columnFieldDefs]
	);

	useEffect(() => {
		if (isOpen) {
			setSelectedFieldIds(new Set(columnDescriptors.map((c) => c.id)));
		}
	}, [isOpen, columnDescriptors]);

	const hasSelection = selectedRowData.length > 0;

	const toggleField = useCallback((id: string) => {
		setSelectedFieldIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	}, []);

	const selectAllFields = useCallback(() => {
		setSelectedFieldIds(new Set(columnDescriptors.map((c) => c.id)));
	}, [columnDescriptors]);

	const clearFields = useCallback(() => {
		setSelectedFieldIds(new Set());
	}, []);

	const handleCancel = useCallback(() => {
		setIsOpen(false);
	}, []);

	const handleConfirm = useCallback(async () => {
		const orderedColumnIds = columnDescriptors
			.filter((f) => selectedFieldIds.has(f.id))
			.map((f) => f.id);
		if (orderedColumnIds.length === 0 || selectedRowData.length === 0) {
			return;
		}

		const { headers, rows } = await buildExportGridFromColumnData(
			columnFieldDefs,
			selectedRowData,
			{ columnIds: orderedColumnIds }
		);

		const fileBaseName =
			documentTitle.trim() ||
			`export_${new Date().toISOString().split("T")[0]}`;

		if (format.value === "csv") {
			exportTableToCsv({
				title: documentTitle,
				subtitle: documentSubtitle,
				headers,
				rows,
				fileBaseName
			});
		} else {
			await exportTableToPdf({
				title: documentTitle,
				subtitle: documentSubtitle,
				headers,
				rows,
				fileBaseName
			});
		}
		setIsOpen(false);
	}, [
		columnFieldDefs,
		columnDescriptors,
		documentTitle,
		documentSubtitle,
		format.value,
		selectedFieldIds,
		selectedRowData
	]);

	const noneSelected = selectedFieldIds.size === 0;

	return (
		<>
			<button
				type="button"
				className="table-export-button"
				disabled={!hasSelection}
				onClick={() => setIsOpen(true)}
			>
				<Download size={14} />
				<span>Export</span>
			</button>

			<SlideIn
				isOpen={isOpen}
				cancel={handleCancel}
				confirm={handleConfirm}
				header="Daten exportieren"
				confirmText="Exportieren"
				disabled={[false, noneSelected]}
			>
				<div className="table-export-container">
					<div className="table-export-format">
						<span className="table-export-section-label">
							Format
						</span>
						<SwitchButtons
							buttonStates={FORMAT_OPTIONS}
							currentStates={format}
							changeHandler={setFormat}
						/>
					</div>

					<div className="table-export-text-fields">
						<label>
							Titel
							<input
								type="text"
								value={documentTitle}
								onChange={(e) =>
									setDocumentTitle(e.target.value)
								}
								placeholder="Dokumenttitel"
							/>
						</label>
						<label>
							Untertitel
							<input
								type="text"
								value={documentSubtitle}
								onChange={(e) =>
									setDocumentSubtitle(e.target.value)
								}
								placeholder="Optional"
							/>
						</label>
					</div>

					<div>
						<div className="table-export-select-all">
							<span className="table-export-section-label">
								Spalten
							</span>
							<div className="flex row gap-xs">
								<button type="button" onClick={selectAllFields}>
									Alle
								</button>
								<button type="button" onClick={clearFields}>
									Keine
								</button>
							</div>
						</div>
						<div className="table-export-fields">
							{columnDescriptors.map((field) => {
								const checked = selectedFieldIds.has(field.id);
								return (
									<label
										key={field.id}
										className="table-export-field-row"
										data-checked={checked}
									>
										<input
											type="checkbox"
											checked={checked}
											onChange={() =>
												toggleField(field.id)
											}
										/>
										<span className="table-export-field-label">
											{field.label}
										</span>
									</label>
								);
							})}
						</div>
					</div>
				</div>
			</SlideIn>
		</>
	);
}

export default TableExport;
