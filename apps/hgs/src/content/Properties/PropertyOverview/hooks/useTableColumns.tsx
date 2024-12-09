import { DisplayWorker } from '@/_UI';
import IconButton from '@/_UI/interfaces/IconButton';
import { getDateLabel } from '@/provider';
import { Property } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

const useTableColumns = () => { 
	const columns: ColumnDef<Property>[] = useMemo(() => [
		{
			accessorKey: 'name',
			header: () => <span>Name</span>,
			id: 'name',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: row => getDateLabel(row.createdAt),
			header: () => <span>Erstellt am</span>,
			id: 'createdAt',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: row => <DisplayWorker workerId={row.created_by.objectId} />,
			header: () => <span>Erstellt von</span>,
			id: 'created_by',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: row => <IconButton icon='link' isLink link ={`/properties/${row.objectId}`} /> ,
			header: () => <span>Bearbeiten</span>,
			id: 'edit',
			cell: info => info.getValue(),
			footer: info => info.column.id
		}
	], []);

	return columns;
};

export default useTableColumns;