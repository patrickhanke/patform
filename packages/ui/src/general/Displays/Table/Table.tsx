"use client";

import React, { useCallback, useMemo, useState } from "react";
import "./styles.scss";
import {
	useReactTable,
	getCoreRowModel,
	getSortedRowModel,
	flexRender,
	SortingState,
	Column
} from "@tanstack/react-table";
import { TableTypes } from "./types";
import clsx from "clsx";
import { ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react";
import PaginationHandlers from "./content/PaginationHandlers";

const Table: React.FC<TableTypes> = ({
	data,
	columns,
	rowStyles,
	cellBorders = false,
	enableRowSelection = false,
	onRowSelection,
	rowCount,
	pagination,
	setPagination,
	filterContent
}) => {
	const tableData = useMemo(() => data, [data]);
	const [sorting, setSorting] = useState<SortingState>([]);

	const [selectedRows, setSelectedRows] = useState<string[]>([]);

	const table = useReactTable({
		data: tableData,
		columns,
		onPaginationChange: setPagination,
		state: {
			sorting,
			pagination
		},
		enableRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getRowId: (row) => row.uuid,
		manualPagination: true,
		rowCount: rowCount || tableData.length,
		onSortingChange: setSorting,
		debugTable: false,
		debugHeaders: false,
		debugColumns: false
	});

	const getSortIcon = useCallback(
		(column: Column<object>) => {
			const isSortable = column.getCanSort() || false;
			if (!isSortable) return null;
			const isSorted = sorting.find((sort) => sort.id === column.id);

			if (isSorted?.id) {
				return isSorted.desc === true ? (
					<ChevronDown size={10} />
				) : (
					<ChevronUp size={10} />
				);
			}

			return <ChevronsUpDown size={10} />;
		},
		[sorting]
	);

	const handleRowSelection = useCallback(
		(rowId: string) => {
			console.log({ rowId });
			const idIndex = selectedRows.findIndex(
				(selectedRow) => selectedRow === rowId
			);
			console.log(idIndex);

			if (idIndex !== -1) {
				const newSelectedRows = selectedRows.filter(
					(selectedRow) => selectedRow !== rowId
				);
				setSelectedRows(newSelectedRows);
				if (onRowSelection) {
					onRowSelection(newSelectedRows);
				}
			} else {
				setSelectedRows((prev) => [...prev, rowId]);
				if (onRowSelection) {
					onRowSelection([...selectedRows, rowId]);
				}
			}
		},
		[selectedRows, onRowSelection]
	);

	return (
		<>
			{pagination && setPagination && (
				<div className="table_header">
					{filterContent ? (
						<div className="filter_content">{filterContent}</div>
					) : (
						<div />
					)}
					<PaginationHandlers
						pagination={pagination}
						setPagination={setPagination}
						previousPage={table.previousPage}
						nextPage={table.nextPage}
						firstPage={table.firstPage}
						lastPage={table.lastPage}
						pageCount={table.getPageCount()}
						pageIndex={table.getState().pagination.pageIndex}
						canGetPreviousPage={table.getCanPreviousPage()}
						canGetNextPage={table.getCanNextPage()}
					/>
				</div>
			)}
			<div className="content_element no_padding">
				<div className={clsx("table_container")}>
					<table>
						<thead>
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id}>
									{enableRowSelection && (
										<th>
											<input
												type="checkbox"
												onChange={(e) => {
													const isChecked =
														e.target.checked;
													setSelectedRows(
														isChecked
															? table
																	.getRowModel()
																	.rows.map(
																		(row) =>
																			row
																				.original
																				.objectId
																	)
															: []
													);
												}}
												checked={
													selectedRows.length ===
													table.getRowModel().rows
														.length
												}
											/>
										</th>
									)}
									{headerGroup.headers.map((header) => {
										return (
											<th
												key={header.id}
												colSpan={header.colSpan}
											>
												{header.isPlaceholder ? null : (
													<>
														<div
															{...{
																className:
																	header.column.getCanSort()
																		? "sortable"
																		: "",
																onClick:
																	header.column.getToggleSortingHandler()
															}}
														>
															{flexRender(
																header.column
																	.columnDef
																	.header,
																header.getContext()
															)}
															{getSortIcon(
																header.column
															)}
														</div>
													</>
												)}
											</th>
										);
									})}
								</tr>
							))}
						</thead>
						<tbody>
							{table.getRowModel().rows.map((row) => {
								const isSelected = selectedRows.includes(
									row?.original?.objectId
								);
								return (
									<tr
										key={row.id}
										style={{
											...(rowStyles
												? rowStyles(row)
												: {}),
											backgroundColor: isSelected
												? "#e0f7fa"
												: "transparent"
										}}
									>
										{enableRowSelection && (
											<td>
												<input
													type="checkbox"
													checked={isSelected}
													onChange={() =>
														handleRowSelection(
															row.original
																.objectId
														)
													}
												/>
											</td>
										)}
										{row.getVisibleCells().map((cell) => {
											return (
												<td
													key={cell.id}
													data-cell_borders={
														cellBorders
													}
												>
													{flexRender(
														cell.column.columnDef
															.cell,
														cell.getContext()
													)}
												</td>
											);
										})}
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
};

export default Table;
