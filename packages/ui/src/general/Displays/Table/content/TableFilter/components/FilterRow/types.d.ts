import { Filter } from "@repo/types";
import { ColumnDataTypes } from "../../../../types";

export type ExtendedTableFilter = Filter & {
	columnLabel: string;
	columnType: ColumnDataTypes;
};

export type FilterRowProps = {
	filter: ExtendedTableFilter;
	onUpdate: (filter: ExtendedTableFilter) => void;
	onRemove: (filterId: string) => void;
};
