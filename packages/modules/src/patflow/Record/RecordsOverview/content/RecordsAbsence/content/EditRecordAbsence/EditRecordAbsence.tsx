"use client";

import { FC, useState } from "react";
import { EditAbsenceProps } from "./types";
import DeleteAbsence from "./components/DeleteAbsence";
import { IconButton, Modal } from "@repo/ui";
import { useErrors } from "./hooks";
import { getDateString, useDataStore, useFindDays } from "@repo/provider";
import { useAbsenceDays, useCreateAbsence } from "@repo/modules";
import { ErrorMessage } from "@repo/types";

const EditAbsence: FC<EditAbsenceProps> = ({ absence, refetch }) => {
	const [deleteAbsence, setDeleteAbsence] = useState(false);
	const [editAbsence, setEditAbsence] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errorsState, setErrors] = useState<ErrorMessage[]>([]);
	const { intervalDays } = useAbsenceDays({
		absence: absence,
		days: [],
		isFull: !(absence.start_date.length > 10)
	});

	const { records } = useDataStore();

	// create absence Handler importieren

	const { data: days } = useFindDays({
		userId: absence.user?.objectId as string,
		year: absence.year
	});

	const { editAbsenceHandler } = useCreateAbsence({
		setLoading,
		setErrors,
		errors: errorsState,
		type: "edit",
		absenceState: {
			...absence,
			state: "approved"
		},
		intervalDays: intervalDays,
		daysData: days || [],
		records: records.filter(
			(record) => record.user?.objectId === absence.user?.objectId
		),
		times: [],
		isFull: !(absence.start_date.length > 10),
		workerId: absence.user?.objectId as string,
		absenceId: absence.objectId
	});

	const { errors } = useErrors({
		absence,
		dayData: days || []
	});

	return (
		<>
			<div className="button_container">
				<IconButton
					icon="delete"
					onClick={() => {
						setDeleteAbsence(true);
					}}
				/>
				<IconButton
					icon="check"
					onClick={() => {
						setEditAbsence(true);
					}}
				/>
			</div>
			{deleteAbsence && (
				<DeleteAbsence
					deleteAbsence={deleteAbsence}
					setDeleteAbsence={setDeleteAbsence}
					absence={absence}
					refetch={refetch}
				/>
			)}
			{editAbsence && (
				<Modal
					header="Abwesenheit bestätigen"
					isOpen={editAbsence}
					cancelButtonHandler={() => setEditAbsence(false)}
					confirmButtonHandler={async () => {
						setLoading(true);
						await editAbsenceHandler();
						refetch();
						setEditAbsence(false);
						setLoading(false);
					}}
					buttonDisabled={[false, errors.length > 0]}
					confirmButtonText="Bestätigen"
					cancelButtonText="Abbrechen"
					loading={loading}
				>
					<p>Wollen Sie diese Abwesenheit bestätigen?</p>
					<div>
						Es werden folgende Tage angelegt:
						<br />
						<ul>
							{intervalDays
								.filter((day) => day.state === "create")
								.map((day) => (
									<li key={day.date}>
										{getDateString(new Date(day.date)).date}
									</li>
								))}
						</ul>
					</div>
					{errors.length > 0 && (
						<div className="errors-container">
							<p>
								Speichern nicht möglich, da es Überschneidungen
								mit anderen Einträgen gibt.
							</p>
						</div>
					)}
				</Modal>
			)}
		</>
	);
};

export default EditAbsence;
