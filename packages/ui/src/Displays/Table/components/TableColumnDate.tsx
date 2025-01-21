import { getDateStringsFromIso } from '@repo/provider';

const TableColumnDate = ({date} : {date: string}) => {
	return (
		<div>
			{getDateStringsFromIso(date).date}
		</div>
	);
};

export default TableColumnDate;