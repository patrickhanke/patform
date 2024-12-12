import { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { AbsenceWithRecordIs, UseRecordAbsenceColumnsProps } from '../types';
import { DisplayWorker, StateDisplay } from '@content';
import { getDateStringsFromIso } from '@provider';
import EditAbsence from '../components/EditAbsence';

const useRecordAbsenceColumns = ({refetch}: UseRecordAbsenceColumnsProps) => {
	const columns: ColumnDef<AbsenceWithRecordIs>[] = useMemo(() => [
		{
			accessorFn: row => <DisplayWorker workerId={row.user.objectId} />,
			header: () => <span>Nutzer</span>,
			id: 'created_by',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: row => `${getDateStringsFromIso(row.start_date).datum} - ${getDateStringsFromIso(row.end_date).datum}`,
			header: () => <span>Datum</span>,
			id: 'date',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: row => (
				<StateDisplay
					type='AbsenceType'
					state={row.type}
				/>
			),
			header: () => <span>Typ</span>,
			id: 'absennce_type',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: row => (
				<StateDisplay
					type='Absence'
					state={row.state}
					displayInterface={false}
				/>
			),
			header: () => <span>Status</span>,
			id: 'absence',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: row => row.comment,
			header: () => <span>Kommentar</span>,
			id: 'comment',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: row =>  (
				<EditAbsence 
					absence={row} 
					refetch={refetch} 
				/>
			),
			header: () => <span>Bearbeiten</span>,
			id: 'edit',
			cell: info => info.getValue(),
			footer: info => info.column.id
		}
	], []); 

	return columns;
};

export default useRecordAbsenceColumns;