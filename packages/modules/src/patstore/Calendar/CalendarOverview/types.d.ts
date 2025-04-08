import { ApolloRefetch, Filter, GroupClass } from "@repo/types";

export type PersonsOverviewProps = {
	projectId: string;
};

export type FilterArray = Filter[];

export type UseFindDateHook = ({
	moduleId: string,
	filters: FilterArray,
	skip: number,
	limit: number
}) => {
	loading: boolean;
	groups?: GroupClass[];
	refetch: ApolloRefetch;
	count: number;
};

export type DeleteModalProps = {
	isOpen: boolean;
	confirmButtonHandler: () => void;
	header: string;
};
