import { ApolloRefetch, Filter, Module, NewsClass } from "@repo/types";

export type FilterArray = Filter[];

export type UseFindNewsHook = (T: {
	module: Module;
	filters: FilterArray;
	skip: number;
	limit: number;
}) => {
	loading: boolean;
	news: NewsClass[];
	refetch: ApolloRefetch;
	count: number;
};

export type DeleteModalProps = {
	isOpen: boolean;
	confirmButtonHandler: () => void;
	header: string;
};
