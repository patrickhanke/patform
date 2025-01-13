import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { MonthData } from '../types';

const useTableColumns = () => { 
	const columns: ColumnDef<MonthData>[] = useMemo(() => [
		{
			accessorKey: 'month',
			header: () => <span>Monat</span>,
			id: 'date',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		
		{
			accessorKey: 'target',
			header: () => <span>Sollzeit</span>,
			id: 'target',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorKey: 'monthTimes',
			header: () => <span>Arbeitszeit</span>,
			id: 'working_times',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorKey: 'monthSaldo',
			header: () => <span>Monatssaldo</span>,
			id: 'month_saldo',
			cell: info => info.getValue(),
			footer: info => info.column.id
		}
		
	] as ColumnDef<MonthData>[], []);

	return columns;
};

export default useTableColumns;