export const findTicketRoute = (ticketState: string) => {
    switch (ticketState) {
        case 'open':
            return '/tickets/open';
        case 'in_progress':
            return '/tickets/on_progress';
        case 'closed':
            return '/tickets/closed';
        case 'archived':
            return '/tickets/completed';
        default:
            return '/tickets';
    }
};
