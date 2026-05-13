import { useEffect } from "react";
import { ErrorMessage } from "@repo/types";
import { UseErrors } from "../types";
import {
	createIntervalFromTimes,
	findDefaultTimeForDate
} from "@repo/provider";

const useErrors: UseErrors = ({
	date,
	dayType,
	days,
	absence,
	setErrors,
	setOverlap,
	records,
	isFull
}) => {
	const checkOverlap = (
		startA: string,
		endA: string,
		startB?: string,
		endB?: string
	) => {
		if (!startB || !endB) {
			return false;
		}
		const startATime = new Date(startA).getTime();
		const endATime = new Date(endA).getTime();
		const startBTime = new Date(startB).getTime();
		const endBTime = new Date(endB).getTime();

		return (
			(startATime < endBTime && startATime >= startBTime) || // A starts inside B
			(endATime <= endBTime && endATime > startBTime) || // A ends inside B
			(startATime <= startBTime && endATime >= endBTime) // A covers B
		);
	};

	useEffect(() => {
		const disabledArray: [boolean, boolean] = [false, false];
		const errorArray: ErrorMessage[] = [];
		const overlapArray: string[] = [];

		const defaultTime = findDefaultTimeForDate(date, records).default_time;

		if (!defaultTime) {
			disabledArray[1] = true;
			errorArray.push({
				id: "default_time",
				key: `default_time`,
				message: "Für diesen Tag existiert keine Anwesenheitszeit"
			});
		} else {
			if (days && absence.start_date && absence.end_date) {
				const timesInterval = createIntervalFromTimes(
					absence.start_date,
					absence.end_date
				);

				console.log({ timesInterval });
				const currentTimes = days.filter((t) =>
					timesInterval.includes(t.date)
				);
				currentTimes.forEach((timeEntry, index) => {
					if (
						checkOverlap(
							absence.start_date,
							absence.end_date,
							timeEntry.time?.start,
							timeEntry.time?.end
						)
					) {
						disabledArray[1] = true;
						errorArray.push({
							id: `overlap_${index}`,
							key: `overlap_with_time_${index}`,
							message: `Die Zeit überschneidet sich mit einem anderen Eintrag.`
						});
						overlapArray.push(timeEntry.date);
					}
				});
				if (
					new Date(defaultTime.start).getTime() >
					new Date(absence.start_date).getTime()
				) {
					disabledArray[1] = true;
					errorArray.push({
						id: "start_before_default_time",
						key: `start_before_default_time`,
						message:
							"Startzeit muss nach Beginn der Anwesenheitszeit liegen"
					});
				}
				if (
					new Date(defaultTime.end).getTime() <
					new Date(absence.end_date).getTime()
				) {
					disabledArray[1] = true;
					errorArray.push({
						id: "end_after_default_time",
						key: `end_after_default_time`,
						message:
							"Endzeit muss vor Ende der Anwesenheitszeit liegen"
					});
				}
			}
		}
		setErrors(errorArray);
		setOverlap(overlapArray);
	}, [date, dayType, absence, days, isFull]);
};

export default useErrors;
