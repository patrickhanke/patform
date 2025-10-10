import { EventClass, Filter, Module } from "@repo/types";

export type FilterArray = Filter[];

export type UseFindEventHook = (T: {
	module: Module;
	filters: FilterArray;
	limit?: number;
	skip?: number;
}) => {
	loading: boolean;
	events?: EventClass[];
	refetch: () => void;
};

export type DeleteModalProps = {
	isOpen: boolean;
	confirmButtonHandler: () => void;
	header: string;
};
