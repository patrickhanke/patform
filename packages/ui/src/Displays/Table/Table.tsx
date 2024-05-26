'use client';

/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useMemo, useState } from 'react';
import'./styles.scss';
import {
	Column,
	// Table,
	useReactTable,
	ColumnFiltersState,
	getCoreRowModel,
	getFilteredRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFacetedMinMaxValues,
	getPaginationRowModel,
	sortingFns,
	getSortedRowModel,
	FilterFn,
	SortingFn,
	ColumnDef,
	flexRender,
	FilterFns
} from '@tanstack/react-table';
import {
	RankingInfo,
	rankItem,
	compareItems
} from '@tanstack/match-sorter-utils';
import { TableTypes } from './types';
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
import clsx from 'clsx';

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
	// Rank the item
	const itemRank = rankItem(row.getValue(columnId), value);
  
	// Store the itemRank info
	addMeta({
		itemRank
	});
  
	// Return if the item should be filtered in/out
	return itemRank.passed;
};

const Table = ({data, columns}: TableTypes) => {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [globalFilter, setGlobalFilter] = useState('');

	const tableData = useMemo(() => data, [data]);

	const table = useReactTable({
		data: tableData,
		columns,
		filterFns: {
			fuzzy: fuzzyFilter
		},
		state: {
			columnFilters,
			globalFilter
		},
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: fuzzyFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFacetedMinMaxValues: getFacetedMinMaxValues(),
		// debugTable: true,
		// debugHeaders: true,
		debugColumns: false
	});


	// useEffect(() => {
	// 	if (table.getState().columnFilters[0]?.id === 'fullName') {
	// 		if (table.getState().sorting[0]?.id !== 'fullName') {
	// 			table.setSorting([{ id: 'fullName', desc: false }]);
	// 		}
	// 	}
	// }, [table.getState().columnFilters[0]?.id]);
	if (!data || data.length === 0) return null;

	return (
		<div className='content_element'>

			<div className={clsx( "table_container")}  >
				{/* <div className={"header"}>
					<h2>{title}</h2>
				</div> */}
				<table>
					<thead>
						{table.getHeaderGroups().map(headerGroup => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<th key={header.id} colSpan={header.colSpan}>
											{header.isPlaceholder ? null : (
												<>
													<div
														{...{
															className: header.column.getCanSort()
																? "sortable"
																: '',
															onClick: header.column.getToggleSortingHandler()
														}}
													>
														{flexRender(
															header.column.columnDef.header,
															header.getContext()
														)}
														{{
															asc: <MdArrowDropUp size="14px" />,
															desc: <MdArrowDropDown size="14px"/>
														}[header.column.getIsSorted() as string] ?? null}
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
						{table.getCoreRowModel().rows.map(row => {
							return (
								<tr key={row.id}>
									{row.getVisibleCells().map(cell => {
										return (
											<td key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
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
	);
};

export default Table;