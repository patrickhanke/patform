import { PaginationState } from "../types";

const generatePagination = <T>({
	data,
	pagination
}: {
	data: T[];
	pagination: PaginationState;
}): T[] => {
	const start = pagination.pageIndex * pagination.pageSize;
	const end = start + pagination.pageSize;
	return data.slice(start, end);
};

export default generatePagination;
