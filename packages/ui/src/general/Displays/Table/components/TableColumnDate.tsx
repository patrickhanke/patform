import { getDateString } from "@repo/provider";

const TableColumnDate = ({ date }: { date: string }) => {
	return <div>{getDateString(date).date}</div>;
};

export default TableColumnDate;
