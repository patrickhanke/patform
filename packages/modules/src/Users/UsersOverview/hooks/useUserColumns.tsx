import { useMemo } from 'react'
import { ColumnDef, TableColumnString } from '@repo/ui';
import { PatstoreUser } from '@repo/types';
import { useDataHandler } from '@repo/provider';

const useUserColumns = () => {
	const {updateData} = useDataHandler()
    const columns: ColumnDef<PatstoreUser>[] = useMemo(() => [
		{
			accessorFn: (row) => <TableColumnString 
				value={row.name} 
				onChange={(value) => {
					updateData({
						className: '_User',
						objectId: row.objectId,
						updateObject: {
							name: value
						}
					})
				}}
				isEditable
			/>,
			header: () => <span>Name</span>,
			id: 'name',
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