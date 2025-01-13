import { ApolloRefetch, ApplicationTypes, Task, Ticket } from '@types';

export type TicketsComponent = {
    id?: string,
    className?: string,
    pageState: Ticket['state'],
}

export type useGetTicketsHook = {
    id?: string,
    className?: string,
    filters: ApplicationTypes.Filter[],
    archived?: boolean
}

export type SiteHeaderContentComponent = {
    id?: string,
    filters: ApplicationTypes.Filter[],
    setFilters: React.Dispatch<React.SetStateAction<ApplicationTypes.Filter[]>>,
    tickets: ApplicationTypes.Ticket[]
}

export type UseTicketColumnsProps = {
    refetch: ApolloRefetch, 
    archiveTicket: (objectId: string) => void, 
    deleteTicket: (objectId: string) => void,
}

export type TicketStateProps = {
    refetch: ApolloRefetch,
    ticketId: string, 
    ticketState: string
}

export type TicketTaskProps = {
    ticketId: string, 
    ticketPropertyId: string, 
    ticketUserId: string,  
    ticketTask?: Pick<Task, 'objectId' | 'title' | 'state'>, 
    refetch: ApolloRefetch,
    ticketState: string
}