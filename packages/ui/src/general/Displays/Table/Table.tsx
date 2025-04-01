"use client";

import React, { useCallback, useMemo, useState } from "react";
import "./styles.scss";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  Column,
} from "@tanstack/react-table";
import { TableTypes } from "./types";
import clsx from "clsx";
import { ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react";

const Table: React.FC<TableTypes> = ({
  data,
  columns,
  rowStyles,
  cellBorders = false,
  enableRowSelection = false,
}) => {
  const tableData = useMemo(() => data, [data]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 200,
  });
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: tableData.length,
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  });

  const getSortIcon = useCallback(
    (column: Column<any>) => {
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
    [sorting],
  );

  const handleRowSelection = (rowId: string) => {
    setSelectedRows((prev) => {
      const newSelectedRows = new Set(prev);
      if (newSelectedRows.has(rowId)) {
        newSelectedRows.delete(rowId);
      } else {
        newSelectedRows.add(rowId);
      }
      return newSelectedRows;
    });
  };

  return (
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
                        const isChecked = e.target.checked;
                        setSelectedRows(
                          isChecked
                            ? new Set(
                                table.getRowModel().rows.map((row) => row.id),
                              )
                            : new Set(),
                        );
                      }}
                      checked={
                        selectedRows.size === table.getRowModel().rows.length
                      }
                    />
                  </th>
                )}
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "sortable"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {getSortIcon(header.column)}
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
              const isSelected = selectedRows.has(row.id);
              return (
                <tr
                  key={row.id}
                  style={{
                    ...(rowStyles ? rowStyles(row) : {}),
                    backgroundColor: isSelected ? "#e0f7fa" : "transparent",
                  }}
                >
                  {enableRowSelection && (
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleRowSelection(row.id)}
                      />
                    </td>
                  )}
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id} data-cell_borders={cellBorders}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
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
  );
};

export default Table;
