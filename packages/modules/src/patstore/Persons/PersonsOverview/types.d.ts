import { ApolloRefetch, Filter, Person } from "@repo/types";

export type PersonsOverviewProps = {
	projectId: string;
};

export type FilterArray = Filter[];

export type UseFindPersonsHook = ({
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

export type DeleteModalProps = {
	isOpen: boolean;
	confirmButtonHandler: () => void;
	header: string;
};
