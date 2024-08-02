import { Filter, News } from '@repo/types';

export type FilterArray = Filter[];

export type UseFindNewsHook = ({
    moduleId: string,
    filters: FilterArray, 
}) => ({
    loading: boolean,
    news?: News[],
    refetch: () => void
});

export type DeleteModalProps = {
    isOpen: boolean,
    confirmButtonHandler: () => void,
    header: string
}