import { getDateString } from "@repo/provider";
import { Modal, DatePicker } from "@repo/ui";
import { useState } from "react";

const TableColumnDate = ({
	date,
	onChange,
	isEditable
}: {
	date: string;
	onChange: (newDate: string) => Promise<void>;
	isEditable: boolean;
}) => {
	const [editDate, setEditDate] = useState(false);
	const [newDate, setNewDate] = useState<string>(date || "");

	return (
		<>
			{isEditable ? (
				<button
					className="full_button sm light"
					type="button"
					onClick={() => setEditDate(true)}
				>
					{getDateString(date).date || "+ Datum hinzufügen"}
				</button>
			) : (
				<div>{getDateString(date).date}</div>
			)}
			{isEditable && (
				<Modal
					header="Datum auswählen"
					isOpen={editDate}
					cancelButtonHandler={() => setEditDate(false)}
					confirmButtonHandler={async () => {
						await onChange(newDate);
						setEditDate(false);
					}}
					confirmButtonText="Speichern"
					buttonDisabled={[false, newDate === "" || newDate === date]}
				>
					<DatePicker
						type={"date"}
						defaultValue={date}
						onChange={(newDate) => {
							setNewDate(newDate);
						}}
					/>
				</Modal>
			)}
		</>
	);
};

export default TableColumnDate;
