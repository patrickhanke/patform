import { ApplicationTypes, Task, Ticket } from "@repo/types";

export type TicketsComponent = {
	id?: string;
	className?: string;
	pageState: Ticket["state"];
};

export type UseGetTicketsHook = {
	id?: string;
	className?: string;
	filters: ApplicationTypes.Filter[];
	archived?: boolean;
	limit?: number;
	skip?: number;
};

export type SiteHeaderContentComponent = {
	id?: string;
	filters: ApplicationTypes.Filter[];
	setFilters: React.Dispatch<React.SetStateAction<ApplicationTypes.Filter[]>>;
	initialFilters: () => ApplicationTypes.Filter[];
	tickets: ApplicationTypes.Ticket[];
};

export type UseTicketColumnsProps = {
	archiveTicket: (objectId: string) => Promise<void>;
	deleteTicket: (objectId: string) => Promise<void>;
};

export type TicketStateProps = {
	ticketId: string;
	ticketState: string;
};

export type TicketTaskProps = {
	ticketId: string;
	ticketPropertyId: string;
	ticketUserId: string;
	ticketTask?: Pick<Task, "objectId" | "title" | "state">;
	ticketState: string;
};
