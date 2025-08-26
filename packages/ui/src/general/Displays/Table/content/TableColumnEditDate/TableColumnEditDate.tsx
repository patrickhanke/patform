import { FC, useState } from "react";
import { SlideIn } from "@repo/ui";
import { TableColumnEditDateProps } from "./types";
import { getDateString } from "@repo/provider";
import { EventDate } from "@repo/types";
import DateEdit from "./components/DateEdit";
import initialDateValues from "./constants/initialDateValues";

const TableColumnEditDate: FC<TableColumnEditDateProps> = ({
	value,
	onChange
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [date, setDate] = useState<EventDate>(value || initialDateValues);

	return (
		<div>
			{!value ? (
				<button
					type="button"
					onClick={() => setIsOpen(true)}
					className="full_button sm grey"
				>
					<span>+ Datum hinzufügen</span>
				</button>
			) : (
				<button
					type="button"
					onClick={() => setIsOpen(true)}
					className="full_button sm light"
				>
					<span>{getDateString(value.start).date}</span>
				</button>
			)}
			<SlideIn
				isOpen={isOpen}
				cancel={() => setIsOpen(false)}
				confirm={async () => {
					setLoading(true);
					await onChange(date);
					setIsOpen(false);
					setLoading(false);
				}}
				disabled={[loading, loading]}
				header="Datum bearbeiten"
			>
				<DateEdit date={date} setDate={setDate} />
			</SlideIn>
		</div>
	);
};

export default TableColumnEditDate;
