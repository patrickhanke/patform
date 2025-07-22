import { useEffect } from "react";
import { formatISO9075 } from "date-fns";
import { DayTime, ErrorMessage } from "@repo/types";
import { UseErrors } from "../types";
import { findDefaultTimeForDate } from "@repo/provider";
import { isArray } from "lodash-es";

const useErrors: UseErrors = ({
	date,
	dayType,
	time,
	times,
	setErrors,
	setDisabled,
	records
}) => {
	const checkOverlap = (
		startA: string,
		endA: string,
		startB: string,
		endB: string
	) => {
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
		if (dayType === "work") {
			if (time) {
				const disabledArray: [boolean, boolean] = [false, false];
				const errorArray: ErrorMessage[] = [];

				if (!time.start || !time.end) {
					disabledArray[1] = true;
					errorArray.push({
						id: "time",
						key: `time`,
						message: "Bitte Start- und Endzeit angeben"
					});
				}
				if (
					time.start &&
					typeof new Date(time.start) === "string" &&
					formatISO9075(new Date(time.start), {
						representation: "date"
					}) !== date
				) {
					disabledArray[1] = true;
					errorArray.push({
						id: "time",
						key: `time`,
						message: "Startzeit muss auf dem gewählten Tag liegen"
					});
				}
				if (
					time.start &&
					time.end &&
					new Date(time.start).getTime() >
						new Date(time.end).getTime()
				) {
					disabledArray[1] = true;
					errorArray.push({
						id: "after_start",
						key: `after_start`,
						message: "Endzeit muss nach Startzeit sein"
					});
				}

				if (times && time.start && time.end) {
					const currentTimes = times.filter(
						(t) => t.day_id !== time.day_id
					);
					currentTimes.forEach((timeEntry, index) => {
						if (
							checkOverlap(
								time.start,
								time.end,
								timeEntry.start,
								timeEntry.end
							)
						) {
							disabledArray[1] = true;
							errorArray.push({
								id: `overlap_${index}`,
								key: `overlap_with_time_${index}`,
								message: `Die Zeit überschneidet sich mit einem anderen Eintrag.`
							});
						}
					});
				}

				if (time?.breaks?.length > 0) {
					time.breaks.forEach(
						(breakTime: DayTime["breaks"][number]) => {
							if (!breakTime.start || !breakTime.end) {
								disabledArray[1] = true;
								errorArray.push({
									id: breakTime.id,
									key: `break`,
									message:
										"Bitte Start- und Endzeit für die Pausen angeben"
								});
							}
							if (
								breakTime.start &&
								time.start &&
								new Date(breakTime.start).getTime() <
									new Date(time.start).getTime()
							) {
								disabledArray[1] = true;
								errorArray.push({
									id: breakTime.id,
									key: `break_before_start`,
									message:
										"Startzeit muss vor Beginn der Pause sein"
								});
							}

							if (
								breakTime.end &&
								time.end &&
								new Date(breakTime.end).getTime() >
									new Date(time.end).getTime()
							) {
								disabledArray[1] = true;
								errorArray.push({
									id: breakTime.id,
									key: `break_after_end`,
									message:
										"Endezeit muss nach Ende der Pause sein"
								});
							}

							if (breakTime.start && breakTime.end) {
								if (
									new Date(breakTime.start).getTime() >
									new Date(breakTime.end).getTime()
								) {
									disabledArray[1] = true;
									errorArray.push({
										id: breakTime.id,
										key: `break_after_start`,
										message:
											"Startzeit muss vor Endzeit sein"
									});
								}
							}
						}
					);
				}
				setDisabled(disabledArray);
				setErrors(errorArray);
			}
		}

		if (dayType === "absence") {
			const disabledArray: [boolean, boolean] = [false, false];
			const errorArray: ErrorMessage[] = [];

			const defaultTime = findDefaultTimeForDate(
				date,
				records
			).default_time;

			if (isArray(times)) {
			}

			if (!defaultTime) {
				disabledArray[1] = true;
				errorArray.push({
					id: "default_time",
					key: `default_time`,
					message: "Für diesen Tag existiert keine Anwesenheitszeit"
				});
			} else {
				if (
					time.type === "vacation" ||
					(time.type === "illness" && time.state === "full")
				) {
					console.log("vacation");
				} else {
					if (times && time.start && time.end) {
						const currentTimes = times.filter(
							(t) => t.day_id !== time.day_id
						);
						currentTimes.forEach((timeEntry, index) => {
							if (
								checkOverlap(
									time.start,
									time.end,
									timeEntry.start,
									timeEntry.end
								)
							) {
								disabledArray[1] = true;
								errorArray.push({
									id: `overlap_${index}`,
									key: `overlap_with_time_${index}`,
									message: `Die Zeit überschneidet sich mit einem anderen Eintrag.`
								});
							}
						});
					}
					if (
						new Date(defaultTime.start).getTime() >
						new Date(time.start).getTime()
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
						new Date(time.end).getTime()
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
			setDisabled(disabledArray);
			setErrors(errorArray);
		}
	}, [date, dayType, time, times]);
};

export default useErrors;
