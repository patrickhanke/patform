import { useMemo } from 'react';
import { Ticket } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import TicketDate from '../components/TicketDate';
import TicketProperty from '../components/TicketProperty';
import { DisplayWorker } from '../../Workers';
import TicketState from '../components/TicketState';
import TicketTask from '../components/TicketTask';
import TicketDetails from '../content/TicketDetails';
import { UseTicketColumnsProps } from '../types';

const useTicketColumns = ({refetch, archiveTicket, deleteTicket}: UseTicketColumnsProps) => {
	const columns: ColumnDef<Ticket>[] = useMemo(() => [
		{
			accessorFn: (ticket) => (
				<p>
					{ticket.title}
				</p>
			),
			header: () => <span>Titel</span>,
			id: 'title',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: (ticket) => (
				<TicketDate ticketDate={ticket.createdAt} />
			),
			header: () => <span>Erstellt</span>,
			id: 'time',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: ticket => <TicketProperty ticketProperty={ticket.property.name} />,
			header: () => <span>Objekt</span>,
			id: 'property',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: ticket => <DisplayWorker workerId={ticket.created_by?.objectId as string}  />,
			header: () => <span>Erstellt von</span>,
			id: 'created_by',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: ticket => <TicketState ticketState={ticket.state} refetch={refetch} ticketId={ticket.objectId} />,
			header: () => <span>Status</span>,
			id: 'state',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: ticket =>( 
				<TicketTask
					ticketId={ticket.objectId}
					ticketTask={ticket.task}
					refetch={refetch}
					ticketUserId={ticket.created_by?.objectId as string}
					ticketPropertyId={ticket.property.objectId}
					ticketState={ticket.state}
				/>
			),
			header: () => <span>Verbundenes Ticket</span>,
			id: 'ticket',
			cell: info => info.getValue(),
			footer: info => info.column.id
		},
		{
			accessorFn: ticket => <TicketDetails ticket={ticket} archiveTicket={archiveTicket} deleteTicket={deleteTicket} />,
			header: () => <span>Details</span>,
			id: 'info',
			cell: info => info.getValue(),
			footer: info => info.column.id
		}
	], []);

	return columns;
};

export default useTicketColumns;