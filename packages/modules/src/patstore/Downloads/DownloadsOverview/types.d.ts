import { ApolloRefetch, DownloadClass, Filter, Module } from "@repo/types";

export type PersonsOverviewProps = {
	projectId: string;
};

export type FilterArray = Filter[];

export type UseFindDownloadHook = (T: {
	module: Module;
	filters: FilterArray;
	limit: number;
	skip: number;
}) => {
	loading: boolean;
	downloads?: DownloadClass[];
	refetch: ApolloRefetch;
	count: number;
};

export type DeleteModalProps = {
	isOpen: boolean;
	confirmButtonHandler: () => void;
	header: string;
};
