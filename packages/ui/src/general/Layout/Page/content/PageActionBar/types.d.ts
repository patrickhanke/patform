import { ApolloRefetch } from "@repo/provider";
import { PageDataUpdateOptions } from "../../hooks/usePageData";

export type PageActionBarProps<T = unknown> = {
	open: boolean;
	updateOptions: PageDataUpdateOptions<T> | null;
	objectId: string | null;
	resetData: () => void;
	undoData: () => void;
	redoData: () => void;
	refetch?: ApolloRefetch;
};
