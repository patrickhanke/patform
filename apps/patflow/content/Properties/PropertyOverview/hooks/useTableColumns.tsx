import { DisplayWorker } from '@content';
import { getDateLabel } from '@provider';
import { Property } from '@types';
import { IconButton, TableColumnString } from '@repo/ui';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import TeamAssignment from '../content/TeamAssignment';
import { useDataHandler } from '@repo/provider';

const useTableColumns = () => {
    const { updateData } = useDataHandler();
    const columns: ColumnDef<Property>[] = useMemo(
        () => [
            {
                accessorFn: row => (
                    <TableColumnString
                        isEditable
                        value={row.name}
                        onChange={async value => {
                            await updateData({
                                className: 'Property',
                                objectId: row.objectId,
                                updateObject: {
                                    name: value,
                                },
                                onError: () => {
                                    console.log('error');
                                },
                            });
                        }}
                    />
                ),
                header: () => <span>Name</span>,
                id: 'name',
                cell: info => info.getValue(),
                footer: info => info.column.id,
                sortingFn: 'alphanumeric',
            },
            {
                accessorFn: row => getDateLabel(row.createdAt),
                header: () => <span>Erstellt am</span>,
                id: 'createdAt',
                cell: info => info.getValue(),
                footer: info => info.column.id,
                sortingFn: 'alphanumeric',
            },
            {
                accessorFn: row => (
                    <DisplayWorker workerId={row.created_by.objectId} />
                ),
                header: () => <span>Erstellt von</span>,
                id: 'created_by',
                cell: info => info.getValue(),
                footer: info => info.column.id,
                disableSorting: true,
            },
            {
                accessorFn: row => (
                    <TeamAssignment
                        propertyId={row.objectId}
                        showAsButton
                    />
                ),
                header: () => <span>Zugewiesene Arbeiter</span>,
                id: 'assigned_staff',
                cell: info => info.getValue(),
                footer: info => info.column.id,
                disableSorting: true,
            },
            {
                accessorFn: row => (
                    <IconButton
                        icon="link"
                        isLink
                        link={`/properties/${row.objectId}`}
                    />
                ),
                header: () => <span>Zur Objektseite</span>,
                id: 'link',
                cell: info => info.getValue(),
                footer: info => info.column.id,
                disableSorting: true,
            },
        ],
        []
    );

    return columns;
};

export default useTableColumns;
