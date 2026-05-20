import { formatISO } from "date-fns";
import { createIntervalFromTimes, useFindDays } from "@repo/provider";
import { useMemo } from "react";
import { IntervalDay, UseAbsenceDaysHook } from "../types";

const useAbsenceDays: UseAbsenceDaysHook = ({ absence }) => {
	const { data: daysData, loading: daysLoading } = useFindDays({
		absenceId: absence?.objectId,
		skipQuery: !absence?.objectId
	});

	const intervalDays = useMemo(() => {
		if (!absence || !daysData || !absence.start_date || !absence.end_date)
			return [];
		const interval = createIntervalFromTimes(
			absence.start_date,
			absence.end_date
		);

		console.log({ interval });
		const intervalArray: IntervalDay[] = [];

		interval.forEach((date) => {
			const day = daysData.find((day) => day.date === date);
			if (day) {
				intervalArray.push({
					date,
					state: "keep"
				});
			} else {
				intervalArray.push({
					date,
					state: "create"
				});
			}
		});

		daysData.forEach((day) => {
			if (!interval.includes(day.date)) {
				console.log({ day });
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
	}, [daysData, absence]);

	return {
		daysLoading,
		intervalDays,
		daysData
	};
};

export default useAbsenceDays;
