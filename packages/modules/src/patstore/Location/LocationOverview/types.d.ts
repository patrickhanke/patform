import { ApolloRefetch, Filter, LocationClass } from "@repo/types";

export type FilterArray = Filter[];

export type UseFindLocationHook = ({
	moduleId: string,
	filters: FilterArray,
	skip: number,
	limit: number
}) => {
	loading: boolean;
	locations?: LocationClass[];
	refetch: ApolloRefetch;
	count: number;
};
