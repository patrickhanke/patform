import { PropertyTypes } from '@types';
import { ColumnDef } from '@tanstack/react-table';
import { DateSelectInterface, Toggle, WorkerSelect } from '@content';
import { useMemo } from 'react';

const useTableColumns = () => {
    const columns = useMemo(
        () => [
            {
                accessorFn: row => row.name,
                header: () => 'hello',
                id: 'name',
                cell: info => info.getValue(),
                footer: info => info.column.id,
            },
            {
                accessorFn: row => (
                    <DateSelectInterface objectId={row.objectId} />
                ),
                header: () => 'Zeiten',
                id: 'time',
                cell: info => info.getValue(),
                footer: info => info.column.id,
            },
            {
                accessorFn: row => (
                    <WorkerSelect
                        objectId={row.objectId}
                        className="Service"
                    />
                ),
                header: () => 'Arbeiter',
                id: 'workers',
                cell: info => info.getValue(),
                footer: info => info.column.id,
            },
            {
                accessorFn: row => (
                    <Toggle
                        objectId={row.objectId}
                        type="get_service_active"
                    />
                ),
                header: () => 'Aktiv',
                id: 'active',
                cell: info => info.getValue(),
                footer: info => info.column.id,
            },
        ],
        []
    ) as ColumnDef<PropertyTypes.PropertyService>[];

    return columns;
};

export default useTableColumns;
