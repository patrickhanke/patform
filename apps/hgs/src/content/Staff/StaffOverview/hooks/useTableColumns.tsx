import IconButton from '@/_UI/interfaces/IconButton';
import { User } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

const useTableColumns = () => { 
	const columns: ColumnDef<User>[] = useMemo(() => [
		{
			accessorFn: row => `${row.first_name} ${row.family_name}`,
			header: () => <span>Name</span>,
			id: 'name',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: row => row.role.name,
			header: () => <span>Rolle</span>,
			id: 'role',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: row => <IconButton icon='link' isLink link ={`/staff/${row.objectId}`} /> ,
			header: () => <span>Bearbeiten</span>,
			id: 'edit',
			cell: info => info.getValue(),
			footer: info => info.column.id
		}
	], []);

	return columns;
};

export default useTableColumns;