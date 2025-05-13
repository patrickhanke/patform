import { FC, useEffect, useMemo, useState } from "react";
import {
	MdKeyboardArrowLeft,
	MdKeyboardArrowRight,
	MdKeyboardDoubleArrowLeft,
	MdKeyboardDoubleArrowRight
} from "react-icons/md";
import { Select } from "@repo/ui";
import { PaginationHandlersProps } from "../types";

const ImagePagination: FC<PaginationHandlersProps> = ({
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

	const options = useMemo(
		() => [
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
		],
		[]
	);

	return (
		<div className="w-100 flex row a-ce gap-sm j-fs">
			<div className="flex row a-ce gap-xs">
				<Select
					options={options}
					value={options.find(
						(option) => option.value === pagination.pageSize
					)}
					isClearable={false}
					onChange={(value) => {
						setPagination(() => ({
							pageIndex: 0,
							pageSize: value.value
						}));
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
				<p>
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

export default ImagePagination;
