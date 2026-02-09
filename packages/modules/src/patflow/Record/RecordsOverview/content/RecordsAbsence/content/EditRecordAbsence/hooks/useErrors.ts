"use client";

import { useMemo } from "react";
import { Absence, Day, ErrorMessage, Record } from "@repo/types";
import { InitialAbsence } from "../types";
import { getDateString } from "@repo/provider";
import checkForConflicts from "../functions/checkForConflicts";
import checkForAbsenceConflicts from "../functions/checkForAbsenceConflicts";

const useErrors = ({
	absenceState,
	record,
	dayData,
	userAbsenceData,
	absence
}: {
	absenceState: InitialAbsence;
	record: Record | null;
	dayData: Day[];
	userAbsenceData: Absence[];
	absence: Absence | null;
}) => {
	const errors = useMemo(() => {
		const errorArray: ErrorMessage[] = [];
		if (!absenceState.user) {
			errorArray.push({
				message: "Bitte einen Mitarbeiter auswählen",
				id: "select_user",
				key: "select_user"
			});
		} else if (!record) {
			if (!record) {
				errorArray.push({
					message: "Bitte ein Startdatum wählen",
					id: "no_start_date",
					key: "no_start_date"
				});
			}
			if (!!absenceState.start_date && !record) {
				errorArray.push({
					message:
						"Für dieses Datum gibt es keinen Eintrag, bitte legen Sie zuerste einen an.",
					id: "no_record_start_date",
					key: "no_record_start_date"
				});
			}
		} else {
			if (
				new Date(absenceState.start_date).getTime() <
				new Date(record.start_date).getTime()
			) {
				errorArray.push({
					message: `Anfangsdatum muss nach dem ${getDateString(new Date(record?.start_date)).date} liegen`,
					id: "date_too_early",
					key: "date_too_early"
				});
			}

			if (
				new Date(absenceState.start_date).getTime() >
				new Date(record.end_date).getTime()
			) {
				errorArray.push({
					message: `Anfangsdatum muss vor dem ${getDateString(new Date(record?.end_date)).date} liegen`,
					id: "date_too_early",
					key: "date_too_early"
				});
			}

			if (
				new Date(absenceState.end_date).getTime() <
				new Date(record.start_date).getTime()
			) {
				errorArray.push({
					message: `Enddatum muss nach dem ${getDateString(new Date(record?.start_date)).date} liegen`,
					id: "date_too_early",
					key: "date_too_early"
				});
			}

			if (
				new Date(absenceState.end_date).getTime() >
				new Date(record.end_date).getTime()
			) {
				errorArray.push({
					message: `Enddatum muss vor dem ${getDateString(new Date(record?.end_date)).date} liegen`,
					id: "date_too_early",
					key: "date_too_early"
				});
			}

			if (!absenceState.start_date) {
				errorArray.push({
					message: "Anfangsdatum fehlt",
					id: "start_date",
					key: "start_date"
				});
			}
			if (!absenceState.end_date) {
				errorArray.push({
					message: "Enddatum fehlt",
					id: "end_date",
					key: "end_date"
				});
			}

			if (!absenceState.type) {
				errorArray.push({
					message: "Art der Abwesenheit fehlt",
					id: "type",
					key: "type"
				});
			}
			if (
				absenceState.start_date &&
				absenceState.end_date &&
				new Date(absenceState.start_date).getTime() >
					new Date(absenceState.end_date).getTime()
			) {
				errorArray.push({
					message: "Anfangsdatum muss vor dem Enddatum liegen",
					id: "end_date",
					key: "end_date"
				});
			}
			if (dayData && absenceState.start_date && absenceState.end_date) {
				const days = dayData || [];
				const conflicts = checkForConflicts(
					absenceState.start_date,
					absenceState.end_date,
					days,
					absence?.objectId
				);
				if (conflicts.length > 0) {
					const conflictDates = conflicts.map(
						(date) => getDateString(new Date(date)).date
					);
					const conflictDatesString = conflictDates.join(", ");
					errorArray.push({
						message: `Es gibt Überschneidungen mit anderen Einträgen: ${conflictDatesString}`,
						id: "day_conflict",
						key: "day_conflict"
					});
				}
			}
			if (
				absenceState.start_date &&
				absenceState.end_date &&
				userAbsenceData
			) {
				const absences = userAbsenceData || [];
				const conflicts = checkForAbsenceConflicts(
					absenceState.start_date,
					absenceState.end_date,
					absences,
					absence?.objectId
				);
				if (conflicts.length > 0) {
					const conflictDates = conflicts.map(
						(date) => getDateString(new Date(date)).date
					);
					const conflictDatesString = conflictDates.join(", ");
					errorArray.push({
						message: `Es gibt Überschneidungen mit anderen Abwesenheiten: ${conflictDatesString}`,
						id: "absence_conflict",
						key: "absence_conflict"
					});
				}
			}
		}
		return errorArray;
	}, [absenceState, dayData, record, userAbsenceData, absence]);

	return { errors };
};

export default useErrors;
