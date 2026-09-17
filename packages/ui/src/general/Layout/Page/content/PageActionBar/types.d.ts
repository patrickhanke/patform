import { ApolloRefetch } from "@repo/provider";

export type PageActionBarProps = {
	open: boolean;
	resetData: () => void;
	undoData: () => void;
	redoData: () => void;
	refetch?: ApolloRefetch;
};
