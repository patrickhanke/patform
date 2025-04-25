import React, { FC, useState } from "react";
import { SlideIn } from "@repo/ui";
import { TableColumnEditDateProps } from "./types";
import { getDateString } from "@repo/provider";
import { useImmer } from "use-immer";
import { EventDate } from "@repo/types";
import DateEdit from "./components/DateEdit";
import initialDateValues from "./constants/initialDateValues";

const TableColumnEditDate: FC<TableColumnEditDateProps> = ({
	value,
	onChange
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [date, setDate] = useImmer<EventDate>(value || initialDateValues);

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
				header="Personen auswählen"
			>
				<DateEdit date={date} setDate={setDate} />
			</SlideIn>
		</div>
	);
};

export default TableColumnEditDate;
