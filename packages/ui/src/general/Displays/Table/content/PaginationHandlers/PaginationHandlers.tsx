import { FC, useEffect, useMemo, useState } from "react";
import { PaginationHandlersProps } from "./types";
import {
	MdKeyboardArrowLeft,
	MdKeyboardArrowRight,
	MdKeyboardDoubleArrowLeft,
	MdKeyboardDoubleArrowRight
} from "react-icons/md";
import { Select } from "@repo/ui";

const OPTIONS = [
	{
		value: 10,
		label: "10"
	},
	{
		value: 20,
		label: "20"
	},
	{
		value: 50,
		label: "50"
	},
	{
		value: 100,
		label: "100"
	}
];

const PaginationHandlers: FC<PaginationHandlersProps> = ({
	rowCount,
	pagination,
	setPagination,
	nextPage,
	previousPage,
	firstPage,
	lastPage,
	pageCount,
	pageIndex,
	canGetPreviousPage,
	canGetNextPage
}) => {
	const [pageNumber, setPageNumber] = useState(pageCount);

	useEffect(() => {
		if (pageCount !== pageNumber && pageCount > 0) {
			setPageNumber(pageCount);
		}
	}, [pageCount, pageNumber]);

	return (
		<div className="w-100 flex row a-ce gap-sm j-fe">
			<div className="flex row a-ce gap-xs">
				{rowCount && (
					<>
						<p>{rowCount}</p>
						<p>|</p>
					</>
				)}
				<Select
					options={OPTIONS}
					value={OPTIONS.find(
						(option) => option.value === pagination.pageSize
					)}
					isClearable={false}
					onChange={(value) => {
						setPagination((prev) => ({
							...prev,
							pageSize: value.value
						}));
						firstPage();
					}}
					placeholder="Zeilen pro Seite"
					width={90}
				/>
				<p>Zeilen pro Seite</p>
				<p>|</p>
				<button
					className="full_button sm light"
					type="button"
					onClick={() => firstPage()}
					disabled={!canGetPreviousPage}
				>
					<MdKeyboardDoubleArrowLeft
						size={12}
						style={{ transform: "translateY(2px)" }}
					/>
				</button>
				<button
					className="full_button sm light"
					type="button"
					onClick={() => previousPage()}
					disabled={!canGetPreviousPage}
				>
					<MdKeyboardArrowLeft
						size={12}
						style={{ transform: "translateY(2px)" }}
					/>
				</button>
				<p className="whitespace-nowrap">
					{pageIndex + 1} / {pageNumber}
				</p>
				<button
					className="full_button sm light"
					type="button"
					onClick={() => nextPage()}
					disabled={!canGetNextPage}
				>
					<MdKeyboardArrowRight
						size={12}
						style={{ transform: "translateY(2px)" }}
					/>
				</button>
				<button
					className="full_button sm light"
					type="button"
					onClick={() => lastPage()}
					disabled={!canGetNextPage}
				>
					<MdKeyboardDoubleArrowRight
						size={12}
						style={{ transform: "translateY(2px)" }}
					/>
				</button>
			</div>
		</div>
	);
};

export default PaginationHandlers;
