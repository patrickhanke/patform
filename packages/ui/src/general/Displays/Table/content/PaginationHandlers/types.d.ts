import { PaginationState } from "@tanstack/react-table";
export type PaginationHandlersProps = {
	rowCount?: number;
	pagination: PaginationState;
	setPagination: (
		updater: (prev: PaginationState) => PaginationState
	) => void;
	pageCount: number;
	pageIndex: number;
	previousPage: () => void;
	nextPage: () => void;
	firstPage: () => void;
	lastPage: () => void;
	canGetPreviousPage: boolean;
	canGetNextPage: boolean;
};
