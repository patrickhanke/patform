import { Filter } from '@repo/types';
export type GalleryOverviewProps = {
    projectId: string;
};

export type UseGetImagesHookReturnValue = {
    loading: boolean,
    images?: TicketTypes.Ticket[],
    refetch: () => void
}

type FilterArray = Filter[];

type GreetFunction = ({projectId: string, id: string, className: string, filters: FilterArray}) => void;

export type UseGetImagesHook = ({
    projectId: string,
    filters: FilterArray, 
}) => ({
    loading: boolean,
    images?: TicketTypes.Ticket[],
    refetch: () => void
});