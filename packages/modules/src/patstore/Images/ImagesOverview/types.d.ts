import { Filter, Module } from "@repo/types";

export type UseGetImagesHookReturnValue = {
	loading: boolean;
	images?: TicketTypes.Ticket[];
	refetch: () => void;
};

type FilterArray = Filter[];

type GreetFunction = ({
	projectId: string,
	id: string,
	className: string,
	filters: FilterArray
}) => void;

export type UseFindImagesHook = (T: {
	module: Module;
	filters: Filter[];
	limit?: number;
	skip?: number;
}) => {
	images: ImageClass[];
	refetch: ApolloRefetch;
	count: number;
	loading: boolean;
};

export type DeleteModalProps = {
	images: string[];
	isOpen: boolean;
	confirmButtonHandler: () => void;
	header: "Bilder löschen";
};
