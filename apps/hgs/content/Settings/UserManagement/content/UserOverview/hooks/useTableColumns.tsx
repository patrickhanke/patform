import { StateDisplay, Toggle } from '@/content/_UI';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import EditStaffMember from '../components/EditStaffMember';
import SetStaffMemberPassword from '../components/SetStaffMemberPassword';
import { User } from '@/types';

const useTableColumns = () => { 
	const columns = useMemo<ColumnDef<User>[]>(() => [
		{
			accessorFn: row => `${row.first_name} ${row.family_name}`,
			header: () => <span>Name</span>,
			id: 'name',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: row => <StateDisplay type='Role' state={row.role.type} />,
			header: () => <span>Rolle</span>,
			id: 'role',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: row => <Toggle key={row.objectId} objectId={row.objectId} type='is_worker' />,
			header: () => <span>Arbeiter</span>,
			id: 'worker',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: row => 
				<div className='button_container'>
					<SetStaffMemberPassword userId={row.objectId} />
					<EditStaffMember userId={row.objectId} />
				</div>,
			header: () => <span>Bearbeiten</span>,
			id: 'edit',
			cell: info => info.getValue(),
			footer: info => info.column.id
		}
	], []);

	return columns;
};

export default useTableColumns;