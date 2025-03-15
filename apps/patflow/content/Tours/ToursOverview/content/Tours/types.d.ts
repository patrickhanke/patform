import { Dispatch, SetStateAction } from 'react';

export type ToursProps = {
    projectId: string;
    setPageHeaderContent: Dispatch<SetStateAction<ReactNode | null>>;
};

export type UseTourTableColumns = {
    workerId: string;
    refetch: ApolloRefetch;
};

export type TourStore = {
    week: { value: number; label: string };
    worker: string | null;
    setWeek: (week: TourStore['week']) => void;
    setWorker: (worker: string) => void;
};
