import { CreateButton, Divider, usePageData } from "@repo/ui";
import { FC } from "react";
import { EditTableProps, WebpageTableColumn } from "./types";
import EditTableSettings from "./components/EditTableSettings";
import { IconButton } from "@repo/ui";
import { v4 } from "uuid";
import { WebpageComponentTable } from "@repo/types";
import EditTableColumn from "./components/EditTableColumn";
import EditTableCell from "./components/EditTableCell";

const EditTable: FC<EditTableProps> = ({ initialData, objectId }) => {
	const { data: table, setData } = usePageData<WebpageComponentTable>(
		{ initialData, objectId },
		{
			className: "Content",
			updateObject: (data) => ({ data }),
			message: "Inhalt gespeichert"
		}
	);

	if (!table) return null;

	const handleInputChange = (
		rowIdx: number,
		colIdx: number,
		value: string
	) => {
		console.log(rowIdx, colIdx, value);
		setData(`rows.${rowIdx}.data.${colIdx}`, value, 1000);
	};

	const handleAddRow = () => {
		setData("rows", [
			...table.rows,
			{
				id: `${Date.now()}`,
				data: {}
			}
		]);
	};

	const handleRemoveRow = (rowIdx: number) => {
		setData(
			"rows",
			table.rows.filter((_, idx) => idx !== rowIdx)
		);
	};

	const handleAddColumn = () => {
		const newColumn: WebpageTableColumn = {
			name: "Neue Spalte",
			id: v4(),
			textAlign: "left"
		};
		setData("columns", [...table.columns, newColumn]);
	};

	const handleEditColumn = (
		id: string,
		key: "title" | "align",
		value: string
	) => {
		setData(
			"columns",
			table.columns.map((col) =>
				col.id === id ? { ...col, [key]: value } : col
			)
		);
	};

	return (
		<div>
			<EditTableSettings data={table} setData={setData} />
			<Divider size="large" showLine={false} />
			{/* <EditTableColumns /> */}
			<div className="content_element">
				<h3>Inhalt</h3>
				<Divider size="medium" showLine={false} />
				<table className="w-100">
					<thead style={{ backgroundColor: "#f9f9f9" }}>
						<tr className="border-bottom">
							{table.columns.map((col) => (
								<EditTableColumn
									key={col.id}
									column={col}
									onChange={(key, value) => {
										handleEditColumn(col.id, key, value);
									}}
								/>
							))}
							<th>
								<IconButton
									icon="plus"
									onClick={handleAddColumn}
									size={16}
								/>
							</th>
						</tr>
					</thead>
					<tbody>
						{table.rows.map((row, rowIdx) => (
							<tr key={row.id} className="border-bottom">
								{table.columns.map((col, colIdx) => (
									<EditTableCell
										key={col.id}
										name={row.data[colIdx] || ""}
										onChange={(value) => {
											handleInputChange(
												rowIdx,
												colIdx,
												value
											);
										}}
									/>
								))}
								<td style={{ padding: "6px 12px" }}>
									<IconButton
										icon="delete"
										onClick={() => handleRemoveRow(rowIdx)}
										size={16}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<Divider size="medium" showLine={false} />
				<CreateButton
					text="Zeile hinzufügen"
					onClick={handleAddRow}
					size="small"
				/>
			</div>
		</div>
	);
};

export default EditTable;
