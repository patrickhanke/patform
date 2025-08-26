import { FC } from "react";
import { CreateButton, Select } from "@repo/ui";
import { useState } from "react";
import { v4 } from "uuid";
import {
	EditTableColumnsProps,
	WebpageTable,
	WebpageTableColumn
} from "../types";

type WebpageTableColumnWithAlign = WebpageTableColumn & {
	textAlign?: "left" | "center" | "right";
};

const EditTableColumns: FC<EditTableColumnsProps> = ({ table, setTable }) => {
	const [newColumnName, setNewColumnName] = useState<string>("");

	const columns: WebpageTable["columns"] = table.columns || [];

	// Add a new column
	const handleAddColumn = () => {
		if (!newColumnName.trim()) return;
		const newColumn: WebpageTableColumn = {
			name: newColumnName,
			id: v4(),
			textAlign: "left"
		};
		const updatedColumns = [...columns, newColumn];
		setTable({ ...table, columns: updatedColumns });
		setNewColumnName("");
	};

	// Edit column name
	const handleEditColumn = (id: string, name: string) => {
		const updatedColumns = columns.map((col) =>
			col.id === id ? { ...col, name } : col
		);
		setTable({ ...table, columns: updatedColumns });
	};

	// Remove column
	const handleRemoveColumn = (id: string) => {
		const updatedColumns = columns.filter((col) => col.id !== id);
		setTable({ ...table, columns: updatedColumns });
	};

	return (
		<div className="flex col gap-md">
			<h3>Tabellenspalten bearbeiten</h3>
			<div className="table_edit_columns_container">
				{columns.map((col) => (
					<div key={col.id} className="table_edit_columns_element">
						<input
							type="text"
							value={col.name}
							onChange={(e) =>
								handleEditColumn(col.id, e.target.value)
							}
							style={{ marginRight: 8 }}
						/>
						<Select
							id={`textalign-${col.id}`}
							value={
								(col as WebpageTableColumnWithAlign)
									.textAlign || "left"
							}
							options={[
								{ value: "left", label: "Links" },
								{ value: "center", label: "Zentriert" },
								{ value: "right", label: "Rechts" }
							]}
							onChange={(value) => {
								const updatedColumns = columns.map((c) =>
									c.id === col.id
										? { ...c, textAlign: value.value }
										: c
								);
								setTable({ ...table, columns: updatedColumns });
							}}
							width={100}
							isClearable={false}
							placeholder="Ausrichtung"
						/>
						<button
							className="full_button md dark"
							onClick={() => handleRemoveColumn(col.id)}
						>
							Entfernen
						</button>
					</div>
				))}
				<div className="table_edit_columns_element">
					<div className="w-100">
						<input
							type="text"
							placeholder="Neue Spalte"
							value={newColumnName}
							onChange={(e) => setNewColumnName(e.target.value)}
							style={{ width: "100%" }}
						/>
					</div>
					<CreateButton
						text="Spalte hinzufügen"
						onClick={handleAddColumn}
						size="small"
					/>
				</div>
			</div>
		</div>
	);
};

export default EditTableColumns;
