import { useState, FC } from "react";
import { CreateButton } from "@repo/ui";
import { EditTableRowsProps } from "../types";
import { set } from "lodash-es";
import { WebpageContentTable } from "@repo/types";

const EditTableRows: FC<EditTableRowsProps> = ({ table, onChange }) => {
	const [localRows, setLocalRows] = useState<
		WebpageContentTable["table"]["rows"]
	>(table.rows || []);

	const handleInputChange = (
		rowIdx: number,
		colIdx: number,
		value: string
	) => {
		const updatedRows = [...localRows];
		set(updatedRows, `${rowIdx}.data.${colIdx}`, value);

		setLocalRows(updatedRows);
		if (onChange) onChange((prev) => ({ ...prev, rows: updatedRows }));
	};

	const handleAddRow = () => {
		const newRow = {
			id: `${Date.now()}`,
			data: {}
		};
		const updatedRows = [...localRows, newRow];
		setLocalRows(updatedRows);
		if (onChange) onChange((prev) => ({ ...prev, rows: updatedRows }));
	};

	const handleRemoveRow = (rowIdx: number) => {
		const updatedRows = localRows.filter((_, idx) => idx !== rowIdx);
		setLocalRows(updatedRows);
		if (onChange) onChange((prev) => ({ ...prev, rows: updatedRows }));
	};

	return (
		<div className="flex col gap-md">
			<h3>Tabellenzeilen bearbeiten</h3>
			<table className="w-100">
				<thead>
					<tr>
						{table.columns.map((col) => (
							<th key={col.id}>{col.name}</th>
						))}
						<th>Aktionen</th>
					</tr>
				</thead>
				<tbody>
					{localRows.map((row, rowIdx) => (
						<tr key={row.id}>
							{table.columns.map((col, colIdx) => (
								<td key={col.id}>
									<input
										type="text"
										value={row.data[colIdx] || ""}
										onChange={(e) =>
											handleInputChange(
												rowIdx,
												colIdx,
												e.target.value
											)
										}
										style={{ width: "100%" }}
									/>
								</td>
							))}
							<td>
								<button
									className="full_button md dark"
									onClick={() => handleRemoveRow(rowIdx)}
								>
									Entfernen
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<CreateButton
				text="Zeile hinzufügen"
				onClick={handleAddRow}
				size="small"
			/>
		</div>
	);
};

export default EditTableRows;
