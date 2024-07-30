import { Filter, Image } from '@repo/types';

export type UseGetImagesHookReturnValue = {
    loading: boolean,
    images?: TicketTypes.Ticket[],
    refetch: () => void
}

type FilterArray = Filter[];

type GreetFunction = ({projectId: string, id: string, className: string, filters: FilterArray}) => void;

export type UseGetImagesHook = ({
    moduleId: string,
    filters: FilterArray, 
}) => ({
    loading: boolean,
    images?: Image[],
    refetch: () => void
});

export type DeleteModalProps = {
    images: string[],
    isOpen: boolean,
    confirmButtonHandler: () => void,
    header: 'Bilder löschen'
}