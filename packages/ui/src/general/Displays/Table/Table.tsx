"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./styles.scss";
import {
	useReactTable,
	getCoreRowModel,
	flexRender,
	SortingState,
	Column
} from "@tanstack/react-table";
import { TableTypes } from "./types";
import clsx from "clsx";
import { ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react";
import { PaginationHandlers, TableFilter } from "./content";
import { isArray } from "lodash";

const Table: React.FC<TableTypes> = ({
	data,
	columns,
	rowStyles,
	secondaryRow,
	cellBorders = false,
	enableRowSelection = false,
	onRowSelection,
	selectedRows,
	setSelectedRows,
	rowCount,
	pagination,
	setPagination,
	filterContent,
	setOrder,
	filters,
	setFilters,
	filterColumns
}) => {
	const tableData = useMemo(() => data, [data]);
	const [sorting, setSorting] = useState<SortingState>([]);

	useEffect(() => {
		if (setOrder) {
			if (isArray(sorting) && sorting.length > 0) {
				if (sorting[0]?.desc === true) {
					setOrder(sorting[0].id + "_DESC");
				} else if (sorting[0]?.desc === false) {
					setOrder(sorting[0].id + "_ASC");
				}
			}
		}
	}, [sorting]);

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
		// getSortedRowModel: getSortedRowModel(),
		getRowId: (row) => row.objectId,
		manualPagination: true,
		manualSorting: true,
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
			if (selectedRows && setSelectedRows) {
				const idIndex = selectedRows.findIndex(
					(selectedRow) => selectedRow === rowId
				);

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
			}
		},
		[selectedRows, onRowSelection, setSelectedRows]
	);

	const handleSelectAll = useCallback(() => {
		if (selectedRows && setSelectedRows) {
			const allSelected =
				selectedRows.length === table.getRowModel().rows.length;
			if (allSelected) {
				setSelectedRows([]);
			} else {
				const allRowIds = table
					.getRowModel()
					.rows.map((row) => row.original.objectId);
				setSelectedRows(allRowIds);
			}
			if (onRowSelection) {
				if (allSelected) {
					onRowSelection([]);
				} else {
					onRowSelection(
						table
							.getRowModel()
							.rows.map((row) => row.original.objectId)
					);
				}
			}
		}
	}, [selectedRows, table, onRowSelection]);

	return (
		<>
			{pagination && setPagination && (
				<div className="table_header">
					{filters &&
						setFilters &&
						columns &&
						filterColumns &&
						filterColumns.length > 0 && (
							<TableFilter
								filterColumns={filterColumns}
								filters={filters}
								setFilters={setFilters}
							/>
						)}
					{filterContent ? (
						<div className="filter_content">{filterContent}</div>
					) : (
						<div />
					)}
					<PaginationHandlers
						rowCount={rowCount}
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
												style={{
													minWidth: "30px !important"
												}}
												type="checkbox"
												onChange={() =>
													handleSelectAll()
												}
												checked={
													selectedRows
														? selectedRows.length ===
															table.getRowModel()
																.rows.length
														: false
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
								const isSelected = selectedRows
									? selectedRows.includes(
											row?.original?.objectId
										)
									: false;

								const subRowContent = secondaryRow?.(row);
								const colspanRest = Math.max(
									1,
									row.getVisibleCells().length - 1
								);

								return (
									<React.Fragment key={row.id}>
										<tr
											data-is_selected={isSelected}
											style={{
												...(rowStyles
													? rowStyles(row)
													: {})
											}}
										>
											{enableRowSelection && (
												<td>
													<input
														style={{
															minWidth:
																"30px !important"
														}}
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
											{row.getVisibleCells().map(
												(cell) => {
													return (
														<td
															key={cell.id}
															data-cell_borders={
																cellBorders
															}
														>
															{flexRender(
																cell.column
																	.columnDef
																	.cell,
																cell.getContext()
															)}
														</td>
													);
												}
											)}
										</tr>
										{subRowContent != null ? (
											<tr
												key={`${row.id}__sub`}
												data-table_sub_row
												style={{
													...(rowStyles
														? rowStyles(row)
														: {})
												}}
											>
												{enableRowSelection && (
													<td
														data-cell_borders={
															cellBorders
														}
													/>
												)}
												<td
													data-cell_borders={
														cellBorders
													}
												/>
												<td
													colSpan={colspanRest}
													data-cell_borders={
														cellBorders
													}
												>
													{subRowContent}
												</td>
											</tr>
										) : null}
									</React.Fragment>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
};

export default React.memo(Table);
