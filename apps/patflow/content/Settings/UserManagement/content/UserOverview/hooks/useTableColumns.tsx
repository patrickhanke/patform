import { ColumnDef } from '@tanstack/react-table';
import { useContext, useMemo } from 'react';
import EditStaffMember from '../components/EditStaffMember';
import SetStaffMemberPassword from '../components/SetStaffMemberPassword';
import { ApolloRefetch, User } from '@repo/types';
import { StateSelect, StatelessToggle, Toggle } from '@repo/ui';
import { AppContext } from '@provider';
import { useDataHandler } from '@repo/provider';

const useTableColumns = ({refetch}: {refetch: ApolloRefetch}) => { 
	const {roles} = useContext(AppContext);
	const {updateData} = useDataHandler();

	const columns = useMemo<ColumnDef<User>[]>(() => [
		{
			accessorFn: row => `${row.first_name} ${row.family_name}`,
			header: () => <span>Name</span>,
			id: 'name',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: row => <StateSelect type='state' state={row.role.type} stateOptions={roles}  />,
			header: () => <span>Rolle</span>,
			id: 'role',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: row => <Toggle 
				onClick={async () => {
					await updateData({
						className: '_User',
						objectId: row.objectId,
						updateObject: {
							is_worker: !row.is_worker
						}
					});

					await refetch();
				}}
				value={row.is_worker}
			/>,
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