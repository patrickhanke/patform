import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { getDateString } from '@/provider';
import { TableData } from '../types';
import ColumnType from '../components/ColumnType';
import ColumnState from '../components/ColumnState';
import ColumnWorkingTime from '../components/ColumnWorkingTime';
import ColumnWorkingHours from '../components/ColumnWorkingHours';
import { Day } from '@/types';

const useTableColumns = () => { 
	const columns: ColumnDef<TableData>[] = useMemo(() => [
		{
			accessorFn: row => getDateString(row.date).date,
			header: () => <span>Datum</span>,
			id: 'date',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: (row) => <ColumnType type={row.type} absenceType={row.absence?.type} />,
			header: () => <span>Typ</span>,
			id: 'type',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: (row) => <ColumnState type={row.type} state={row.type === 'absence' ? (row.absence?.state  || null): (row.time?.state || null)} />,
			header: () => <span>Status</span>,
			id: 'state',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: row => <ColumnWorkingTime type={row.type} time={row.time} />,
			header: () => <span>Arbeitszeiten</span>,
			id: 'working_times',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: row => <ColumnWorkingHours type={row.type} date={row} />,
			header: () => <span>Stunden (Brutto)</span>,
			id: 'amount',
			cell: info => info.getValue(),
			footer: info => info.column.id
		}
	] as ColumnDef<Day<'work' | 'absence'>>[], []);

	return columns;
};

export default useTableColumns;