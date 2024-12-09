import { Ticket } from './Ticket.d';
import { ApplicationTypes, DateTypes, UserTypes } from '@/types/General';
import { TaskTypes } from '../Task';
import { PropertyTypes } from '../Property';
import { TicketTypes } from '.';

export type TicketState = 'open' | 'closed' | 'in_progress'

export type Ticket ={
    title: string,
    objectId: string,
    description: string,
    object: PropertyTypes.Property,
    created_by?: UserTypes.UserDisplayData,
    createdAt: DateTypes.TDateISO,
    images: ApplicationTypes.Image[],
    state: TicketState,
    comments: Comment[],
    property: PropertyTypes.Property,
    task: {
        objectId: TaskTypes.Task['objectId'],
        title: TaskTypes.Task['title'],
        state: TaskTypes.TaskState
    }
}

export type TicketProps = {
    ticketId: string, 
    showDivider: boolean,
    refetchTickets: () => void
}

export type TicketUpdateObject = Partial<Ticket, 'description' | 'object' | 'image' | 'is_closed'>;

export type CreateTicket = Pick<Ticket, 'title' | 'description' | 'images' | 'created_by' > & { property?: PropertyTypes.PropertySelect | undefined }

export type TicketDetailsProps = {
    ticket: TicketTypes.Ticket,
    deleteTicket: (T: Ticket['objectId']) => void,
    archiveTicket: (T: Ticket['objectId']) => void  
}

export type TicketStateProps = {
    ticketState: Ticket['state'],
    updateTicketState: (state: Ticket['state']) => void
}

export type TicketCommentsProps = {
    ticketId: Ticket['objectId'],
    comments: ApplicationTypes.Comment[],
    refetch: () => void
}

