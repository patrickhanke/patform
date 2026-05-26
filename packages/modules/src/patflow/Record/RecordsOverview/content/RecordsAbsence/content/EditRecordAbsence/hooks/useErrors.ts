"use client";

import { useMemo } from "react";
import { Absence, Day, ErrorMessage } from "@repo/types";
import { getDateString } from "@repo/provider";
import checkForConflicts from "../functions/checkForConflicts";

const useErrors = ({
	dayData,
	absence
}: {
	dayData: Day[];
	absence: Absence;
}) => {
	const errors = useMemo(() => {
		const errorArray: ErrorMessage[] = [];
		if (dayData && absence.start_date && absence.end_date) {
			const days = dayData || [];
			const conflicts = checkForConflicts(
				absence.start_date,
				absence.end_date,
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

		return errorArray;
	}, [absence, dayData, absence]);

	return { errors };
};

export default useErrors;
