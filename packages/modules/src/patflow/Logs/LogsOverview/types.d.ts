export type UseFindLogsHook = ({
	moduleId: string,
	filters: FilterArray,
	limit: number,
	skip: number
}) => {
	loading: boolean;
	persons?: Person[];
	refetch: ApolloRefetch;
	count: number;
};