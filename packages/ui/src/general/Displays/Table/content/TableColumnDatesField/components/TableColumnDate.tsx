import { IconButton } from "@repo/ui";
import "../styles.scss";
import { TableColumnDateProps } from "../types";
import { useMemo } from "react";
import { formatISO9075, isValid } from "date-fns";

const TableColumnDate = ({
	date,
	setActiveDate,
	onDelete
}: TableColumnDateProps) => {
	const title = useMemo(() => {
		if (date.label) {
			return date.label;
		}

		const start = date.start ? new Date(date.start) : null;
		if (start && isValid(start)) {
			return formatISO9075(start);
		} else {
			return "Kein Datum";
		}
	}, [date]);

	return (
		<div className="table_column_date_container content_element">
			<div>
				<h3>{title}</h3>
			</div>
			<div className="button_container">
				<IconButton
					icon="edit"
					onClick={() => setActiveDate(date.id)}
				/>
				<IconButton icon="delete" onClick={() => onDelete(date.id)} />
			</div>
		</div>
	);
};

export default TableColumnDate;
