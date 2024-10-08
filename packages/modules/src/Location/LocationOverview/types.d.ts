import { Filter, LocationClass } from '@repo/types';

export type FilterArray = Filter[];

export type UseFindLocationHook = ({
	moduleId: string,
	filters: FilterArray 
}) => ({
    loading: boolean,
    locations?: LocationClass[],
    refetch: () => void
});