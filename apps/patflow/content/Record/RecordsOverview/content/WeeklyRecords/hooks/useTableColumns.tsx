import { DisplayWorker } from '@content';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { WeekObject } from '../types';
import { convertMillisecondsToString } from '@provider';
import EditRecord from '../content/EditRecord';
import { ApolloRefetch } from '@types';

const useTableColumns = ({
    selectedWeek,
    refetch,
}: {
    selectedWeek: number;
    refetch: ApolloRefetch;
}) => {
    const columns: ColumnDef<WeekObject>[] = useMemo(
        () => [
            {
                accessorFn: row => <DisplayWorker workerId={row.user} />,
                header: () => <span>Erstellt von</span>,
                id: 'user',
                cell: info => info.getValue(),
                enableSorting: false,
                footer: info => info.column.id,
            },
            {
                accessorFn: row => row.working_days.toString(),
                header: () => <span>Arbeitstage</span>,
                id: 'working_days',
                cell: info => info.getValue(),
                enableSorting: false,
                footer: info => info.column.id,
            },
            {
                accessorFn: row => row.vacation.toString(),
                header: () => <span>Urlaubstage</span>,
                id: 'vacation',
                cell: info => info.getValue(),
                enableSorting: false,
                footer: info => info.column.id,
            },
            {
                accessorFn: row => row.absence.toString(),
                header: () => <span>Abwesenheit</span>,
                id: 'absence',
                cell: info => info.getValue(),
                enableSorting: false,
                footer: info => info.column.id,
            },
            {
                accessorFn: row => convertMillisecondsToString(row.time),
                header: () => <span>Arbeitszeit</span>,
                id: 'time',
                cell: info => info.getValue(),
                enableSorting: false,
                footer: info => info.column.id,
            },
            {
                accessorFn: row => convertMillisecondsToString(row.breaks),
                header: () => <span>Pausen</span>,
                id: 'breaks',
                cell: info => info.getValue(),
                enableSorting: false,
                footer: info => info.column.id,
            },
            {
                accessorFn: row =>
                    convertMillisecondsToString(row.time - row.breaks),
                header: () => <span>Gesamt</span>,
                id: 'amount',
                cell: info => info.getValue(),
                enableSorting: false,
                footer: info => info.column.id,
            },
            {
                accessorFn: row => convertMillisecondsToString(row.saldo),
                header: () => <span>Saldo</span>,
                id: 'saldo',
                cell: info => info.getValue(),
                enableSorting: false,
                footer: info => info.column.id,
            },
            {
                accessorFn: row => (
                    <EditRecord
                        userId={row.user}
                        selectedWeek={selectedWeek}
                        weekDays={row.days}
                        refetch={refetch}
                    />
                ),
                header: () => <span>Bearbeiten</span>,
                id: 'edit',
                cell: info => info.getValue(),
                enableSorting: false,
                footer: info => info.column.id,
            },
        ],
        [selectedWeek]
    );

    return columns;
};

export default useTableColumns;
