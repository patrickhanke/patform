import { useMemo } from 'react'
import { ColumnDef } from '@repo/ui';
import { PatstoreUser } from '@repo/types';

const useUserColumns = () => {
    const columns: ColumnDef<PatstoreUser>[] = useMemo(() => [
		{
			accessorFn: (row) => row?.label,
			header: () => <span>Name</span>,
			id: 'label',
			cell: info => info.getValue(),
			footer: info => info.column.id,
			enableSorting: false
		},{
			accessorFn: (row) => row?.username,
			header: () => <span>E-Mail</span>,
			id: 'username',
			cell: info => info.getValue(),
			footer: info => info.column.id,
			enableSorting: false
		},
		{
			accessorFn: row => row?.role?.name,
			header: () => <span>Rolle</span>,
			id: 'role',
			cell: info => info.getValue(),
			footer: info => info.column.id,
			enableSorting: false
		},
		{
			accessorFn: row => 'edit',
			header: () => <span>Bearbeiten</span>,
			id: 'edit',
			cell: info => info.getValue(),
			footer: info => info.column.id,
			enableSorting: false
		}
	], []);

	return columns;
}

export default useUserColumns