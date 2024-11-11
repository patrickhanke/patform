import { DownloadClass, Filter } from '@repo/types';

export type PersonsOverviewProps = {
    projectId: string;
};

export type FilterArray = Filter[];

export type UseFindDownloadHook = ({
	moduleId: string,
	filters: FilterArray 
}) => ({
    loading: boolean,
    downloads?: DownloadClass[],
    refetch: () => void
});

export type DeleteModalProps = {
    isOpen: boolean,
    confirmButtonHandler: () => void,
    header: string
}