import { EventClass, Filter } from '@repo/types';

export type FilterArray = Filter[];

export type UseFindEventHook = ({
	moduleId: string,
	filters: FilterArray 
}) => ({
    loading: boolean,
    news?: EventClass[],
    refetch: () => void
});

export type DeleteModalProps = {
    isOpen: boolean,
    confirmButtonHandler: () => void,
    header: string
};