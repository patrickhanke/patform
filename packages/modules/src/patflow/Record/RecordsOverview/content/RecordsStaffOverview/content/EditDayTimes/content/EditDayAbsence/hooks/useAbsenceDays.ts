"use client";

import { formatISO } from "date-fns";
import { createIntervalFromTimes } from "@repo/provider";
import { useMemo } from "react";
import { IntervalDay, UseAbsenceDaysHook } from "../types";

const useAbsenceDays: UseAbsenceDaysHook = ({
	absence,
	days,
	isFull = true
}) => {
	const intervalDays = useMemo(() => {
		if (!absence || !days || !absence.start_date || !absence.end_date)
			return [];
		const interval = createIntervalFromTimes(
			absence.start_date,
			absence.end_date
		);

		const intervalArray: IntervalDay[] = [];

		interval.forEach((date) => {
			const day = days.find((day) => day.date === date);
			if (day) {
				if (
					!isFull &&
					(day.time?.start !== absence.start_date ||
						day.time?.end !== absence.end_date)
				) {
					intervalArray.push({
						date,
						state: "change",
						objectId: day.objectId
					});
				} else {
					intervalArray.push({
						date,
						state: "keep",
						objectId: day.objectId
					});
				}
			} else {
				intervalArray.push({
					date,
					state: "create",
					objectId: undefined
				});
			}
		});

		const filteredDays = days.filter(
			(day) => day.absence?.objectId === absence?.objectId
		);

		filteredDays.forEach((day) => {
			if (!interval.includes(day.date)) {
				intervalArray.push({
					date: day.date,
					state: "delete",
					objectId: day.objectId
				});
			}
		});

		const dayBeforeStart = new Date(absence.start_date);
		dayBeforeStart.setDate(dayBeforeStart.getDate() - 1);
		const dayAfterEnd = new Date(absence.end_date);
		dayAfterEnd.setDate(dayAfterEnd.getDate() + 1);

		intervalArray.push({
			date: formatISO(dayBeforeStart, { representation: "date" }),
			state: undefined
		});

		intervalArray.push({
			date: formatISO(dayAfterEnd, { representation: "date" }),
			state: undefined
		});

		return intervalArray.sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
		);
	}, [days, absence]);

	return {
		intervalDays,
		daysData: days.filter(
			(day) => day.absence?.objectId === absence?.objectId
		)
	};
};

export default useAbsenceDays;
