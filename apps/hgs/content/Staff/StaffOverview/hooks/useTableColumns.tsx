import { User } from '@types';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import StaffMemberSettings from '../content/StaffMemberSettings';

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
			accessorFn: row => <StaffMemberSettings userId={row.objectId} /> ,
			header: () => <span>Bearbeiten</span>,
			id: 'edit',
			cell: info => info.getValue(),
			footer: info => info.column.id
		}
	], []);

	return columns;
};

export default useTableColumns;