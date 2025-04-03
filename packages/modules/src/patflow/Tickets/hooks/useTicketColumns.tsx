import { useMemo } from "react";
import { Ticket } from "@repo/types";
import { ColumnDef } from "@tanstack/react-table";
import TicketDate from "../components/TicketDate";
import TicketProperty from "../components/TicketProperty";
import { DisplayWorker } from "@repo/ui";
import TicketState from "../components/TicketState";
import TicketTask from "../components/TicketTask";
import TicketDetails from "../content/TicketDetails";
import { UseTicketColumnsProps } from "../types";

const useTicketColumns = ({
	refetch,
	archiveTicket,
	deleteTicket
}: UseTicketColumnsProps) => {
	const columns: ColumnDef<Ticket>[] = useMemo(
		() => [
			{
				accessorFn: (ticket) => <p>{ticket.title}</p>,
				header: () => <span>Titel</span>,
				id: "title",
				enableSorting: true,
				sortingFn: (rowA, rowB) => {
					const titleA = rowA.original.title.toLowerCase();
					const titleB = rowB.original.title.toLowerCase();
					if (titleA < titleB) return -1;
					if (titleA > titleB) return 1;
					return 0;
				},
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (ticket) => (
					<TicketDate ticketDate={ticket.createdAt} />
				),
				header: () => <span>Erstellt</span>,
				id: "time",
				enableSorting: true,
				sortingFn: (rowA, rowB) => {
					const dateA = new Date(rowA.original.createdAt).getTime();
					const dateB = new Date(rowB.original.createdAt).getTime();
					return dateA - dateB;
				},
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (ticket) => (
					<TicketProperty ticketProperty={ticket?.property?.name} />
				),
				header: () => <span>Objekt</span>,
				id: "property",
				enableSorting: false,
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (ticket) => (
					<DisplayWorker
						workerId={ticket.created_by?.objectId as string}
					/>
				),
				header: () => <span>Erstellt von</span>,
				id: "created_by",
				enableSorting: false,
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (ticket) => (
					<TicketState
						ticketState={ticket.state}
						refetch={refetch}
						ticketId={ticket.objectId}
					/>
				),
				header: () => <span>Status</span>,
				id: "state",
				enableSorting: false,
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (ticket) => (
					<TicketTask
						ticketId={ticket.objectId}
						ticketTask={ticket.task}
						refetch={refetch}
						ticketUserId={ticket.created_by?.objectId as string}
						ticketPropertyId={ticket?.property?.objectId}
						ticketState={ticket.state}
					/>
				),
				header: () => <span>Verbundenes Ticket</span>,
				id: "ticket",
				enableSorting: false,
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (ticket) => (
					<TicketDetails
						ticket={ticket}
						archiveTicket={archiveTicket}
						deleteTicket={deleteTicket}
						refetch={refetch}
					/>
				),
				header: () => <span>Details</span>,
				id: "info",
				enableSorting: false,
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			}
		],
		[]
	);

	return columns;
};

export default useTicketColumns;
