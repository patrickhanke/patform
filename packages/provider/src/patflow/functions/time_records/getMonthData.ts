import { Day, Record, StaffMember } from "@repo/types";
import { formatISO9075 } from "date-fns";
import { convertMillisecondsToString } from "../dateTimeHelpers";
import {
	createDateIntervalForMonth,
	findDefaultTimeForDate,
	getRecordStartingSaldo,
	monthHasRecord
} from "../recordFunctions";
import getCurrentRecord from "../getCurrentRecord";
import { months } from "@repo/provider";

export type MonthData = {
	id: number;
	month: string;
	monthSaldoInt: number;
	monthSaldo: string;
	target: string;
	monthTimes: string;
	hasRecord: boolean;
	previousMonthSaldoInt: number | null;
	previousMonthSaldo: string;
	runningSaldoInt: number | null;
	runningSaldo: string;
};

export type TimesSaldoProps = {
	days: Day[];
	month: (typeof months)[number];
	year: number;
	selectedUser?: StaffMember;
	records: Record[];
};

const getFirstRecordMonthUpTo = (
	records: Record[],
	year: number,
	upToMonthId: number
): { monthId: number; record: Record } | null => {
	for (let monthId = 0; monthId <= upToMonthId; monthId++) {
		if (!monthHasRecord(records, year, monthId)) {
			continue;
		}

		const date = formatISO9075(new Date(year, monthId, 1), {
			representation: "date"
		});
		const record = getCurrentRecord(records, date);
		if (record) {
			return { monthId, record };
		}
	}

	return null;
};

const getCumulativeSaldo = (
	monthData: MonthData[],
	records: Record[],
	year: number,
	upToMonthId: number
): number | null => {
	const firstRecord = getFirstRecordMonthUpTo(records, year, upToMonthId);
	if (!firstRecord) {
		return null;
	}

	let sum = getRecordStartingSaldo(firstRecord.record);
	for (let monthId = firstRecord.monthId; monthId <= upToMonthId; monthId++) {
		const monthEntry = monthData.find((entry) => entry.id === monthId);
		if (monthEntry?.hasRecord) {
			sum += monthEntry.monthSaldoInt;
		}
	}

	return sum;
};

const getPreviousMonthSaldo = (
	monthData: MonthData[],
	records: Record[],
	year: number,
	monthId: number
): { value: number | null; display: string } => {
	if (!monthHasRecord(records, year, monthId)) {
		return { value: null, display: "-" };
	}

	const previousMonthId = monthId - 1;
	if (
		previousMonthId < 0 ||
		!monthHasRecord(records, year, previousMonthId)
	) {
		const date = formatISO9075(new Date(year, monthId, 1), {
			representation: "date"
		});
		const record = getCurrentRecord(records, date);
		const initialSaldo = getRecordStartingSaldo(record);
		return {
			value: initialSaldo,
			display: convertMillisecondsToString(initialSaldo)
		};
	}

	const cumulative = getCumulativeSaldo(
		monthData,
		records,
		year,
		previousMonthId
	);

	return {
		value: cumulative,
		display: convertMillisecondsToString(cumulative)
	};
};

const getRunningSaldo = (
	monthData: MonthData[],
	records: Record[],
	year: number,
	monthId: number
): { value: number | null; display: string } => {
	if (!monthHasRecord(records, year, monthId)) {
		return { value: null, display: "-" };
	}

	const cumulative = getCumulativeSaldo(monthData, records, year, monthId);
	if (cumulative === null) {
		return { value: null, display: "-" };
	}

	return {
		value: cumulative,
		display: convertMillisecondsToString(cumulative)
	};
};

const getMonthData = ({
	days,
	year,
	records
}: TimesSaldoProps): MonthData[] => {
	const dataArray: MonthData[] = [];
	let totalSaldo = 0;
	let totalTarget = 0;
	let totalTimes = 0;

	if (!days && records.length === 0) {
		return dataArray;
	}

	months.forEach((monthEntry) => {
		const dateInterval = createDateIntervalForMonth(year, monthEntry.id);
		const hasRecord = monthHasRecord(records, year, monthEntry.id);
		let target = 0;
		let monthTimes = 0;

		if (hasRecord) {
			const recordDefaultTimes = dateInterval.map((dateElement) =>
				findDefaultTimeForDate(dateElement, records)
			);
			recordDefaultTimes.forEach((element) => {
				let defaultTime = 0;
				if (element.default_time?.type === "regular") {
					defaultTime =
						element.default_time.duration -
						element.default_time.pause;
				}

				target += defaultTime;
			});

			if (days) {
				dateInterval.forEach((dayString) => {
					const dayArray = days.filter(
						(dayToFind: Day) => dayToFind.date === dayString
					);

					if (dayArray.length > 1) {
						dayArray.forEach((day) => {
							if (day) {
								monthTimes += day.worktime;
							}
						});
					} else if (dayArray.length === 1) {
						const day = dayArray[0];
						if (day) {
							monthTimes += day.worktime;
						}
					}
				});
			}
		}

		const monthSaldoInt = hasRecord ? monthTimes - target : 0;

		if (hasRecord) {
			totalSaldo += monthSaldoInt;
			totalTarget += target;
			totalTimes += monthTimes;
		}

		dataArray.push({
			id: monthEntry.id,
			month: monthEntry.label,
			monthSaldoInt,
			monthSaldo: hasRecord
				? convertMillisecondsToString(monthSaldoInt)
				: "-",
			target: hasRecord ? convertMillisecondsToString(target) : "-",
			monthTimes: hasRecord
				? convertMillisecondsToString(monthTimes)
				: "-",
			hasRecord,
			previousMonthSaldoInt: null,
			previousMonthSaldo: "-",
			runningSaldoInt: null,
			runningSaldo: "-"
		});
	});

	dataArray.forEach((monthEntry) => {
		const previousMonthSaldo = getPreviousMonthSaldo(
			dataArray,
			records,
			year,
			monthEntry.id
		);
		const runningSaldo = getRunningSaldo(
			dataArray,
			records,
			year,
			monthEntry.id
		);

		monthEntry.previousMonthSaldoInt = previousMonthSaldo.value;
		monthEntry.previousMonthSaldo = previousMonthSaldo.display;
		monthEntry.runningSaldoInt = runningSaldo.value;
		monthEntry.runningSaldo = runningSaldo.display;
	});

	dataArray.push({
		id: -1,
		month: "Gesamt",
		monthSaldoInt: totalSaldo,
		monthSaldo: convertMillisecondsToString(totalSaldo),
		target: convertMillisecondsToString(totalTarget),
		monthTimes: convertMillisecondsToString(totalTimes),
		hasRecord: records.length > 0,
		previousMonthSaldoInt: null,
		previousMonthSaldo: "-",
		runningSaldoInt: null,
		runningSaldo: "-"
	});

	return dataArray;
};

export default getMonthData;
