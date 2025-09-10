import { ApolloRefetch, DownloadClass, Filter } from "@repo/types";

export type PersonsOverviewProps = {
	projectId: string;
};

export type FilterArray = Filter[];

export type UseFindDownloadHook = ({
	moduleId: string,
	filters: FilterArray,
	limit: number,
	skip: number
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
