import { getDateStringsFromIso } from '@repo/provider';

const TableColumnDate = ({date} : {date: string}) => {
	return (
		<div>
			{getDateStringsFromIso(date).datum}
		</div>
	);
};

export default TableColumnDate;