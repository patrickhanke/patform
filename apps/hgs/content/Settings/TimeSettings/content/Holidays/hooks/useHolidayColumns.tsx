import { Holiday } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

const useHolidayColumns = () => { 
	const columns: ColumnDef<Holiday>[] = useMemo(() =>{
		const columnArray: ColumnDef<Holiday>[] = [
			{
				accessorFn: row => row.name,
				header: () => <span>Name</span>,
				id: 'name',
				cell: info => info.getValue(),
				footer: info => info.column.id
			}];

		const year = new Date().getFullYear();

		for (let i = 0; i <= 4; i+=1) {
			columnArray.push({
				accessorFn: row =>  row.dates ? row.dates[year + i] : '-',
				header: () => <span>{year + i}</span>,
				id: (year + i).toString(),
				cell: info => info.getValue(),
				footer: info => info.column.id
			});
		}

		
		return columnArray;
	}, []);

	return columns;
};

export default useHolidayColumns;