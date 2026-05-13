import { Day, Record, StaffMember } from "@repo/types";
import { convertMillisecondsToString } from "../dateTimeHelpers";
import {
	createDateIntervalForMonth,
	findDefaultTimeForDate
} from "../recordFunctions";
import { months } from "@repo/provider";

export type MonthData = {
	id: number;
	month: string;
	monthSaldoInt: number;
	monthSaldo: string;
	target: string;
	monthTimes: string;
};

export type TimesSaldoProps = {
	days: Day[];
	month: (typeof months)[number];
	year: number;
	selectedUser?: StaffMember;
	records: Record[];
};

const getMonthData = ({
	days,
	year,
	records,
	month
}: TimesSaldoProps): MonthData[] => {
	const dataArray: MonthData[] = [];
	let totalSaldo = 0;
	let totalTarget = 0;
	let totalTimes = 0;
	if (!days && records.length === 0) {
		return dataArray;
	}

	months.forEach((month) => {
		const dateInterval = createDateIntervalForMonth(year, month.id);
		let target = 0;
		let monthTimes = 0;
		const record_default_times = dateInterval.map((dateElement) =>
			findDefaultTimeForDate(dateElement, records)
		);
		record_default_times.forEach((element) => {
			let default_time = 0;
			if (element.default_time?.type === "regular") {
				default_time =
					element.default_time?.duration -
					element.default_time?.pause;
			}

			target += default_time;
		});

		const daysToLog = [];

		if (days && records) {
			dateInterval.forEach((dayString) => {
				const dayArray = days.filter(
					(dayToFind: Day) => dayToFind.date === dayString
				);

				// console.log({ dayArray });

				if (dayArray.length > 1) {
					dayArray.forEach((day: Day) => {
						daysToLog.push(day);
						if (day && day.type === "work") {
							const time = day.time;
							const timeSpan = time.duration - time.pause;
							monthTimes += timeSpan || 0;
						}
					});
				} else if (dayArray.length === 1) {
					const day = dayArray[0];
					daysToLog.push(day);
					if (day && day.type === "work") {
						const time = day.time;
						const timeSpan = time.duration - time.pause;
						monthTimes += timeSpan || 0;
					} else if (day && day.type === "absence") {
						if (
							day.is_working_day &&
							day.time?.type !== "compensation_times"
						) {
							monthTimes += day.default_time
								? day.default_time.duration -
									day.default_time.pause
								: 0;
						} else if (day.time?.type === "compensation_times") {
							monthTimes -= day.default_time
								? day.default_time.duration -
									day.default_time.pause
								: 0;
						}
					}
				}
			});
		}
		// console.log({ daysToLog });
		totalSaldo += monthTimes - target;
		totalTarget += target;
		totalTimes += monthTimes;
		dataArray.push({
			id: month.id,
			month: month.label,
			monthSaldoInt: monthTimes - target,
			monthSaldo: convertMillisecondsToString(monthTimes - target),
			target: convertMillisecondsToString(target),
			monthTimes: convertMillisecondsToString(monthTimes)
		});
	});

	dataArray.push({
		id: month.id,
		month: "Gesamt",
		monthSaldoInt: totalSaldo,
		monthSaldo: convertMillisecondsToString(totalSaldo),
		target: convertMillisecondsToString(totalTarget),
		monthTimes: convertMillisecondsToString(totalTimes)
	});

	return dataArray;
};

export default getMonthData;
