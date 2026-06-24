import {
	CreateInitialTime,
	DefaultWorkingDay,
	Holiday,
	Record,
	TimeObject
} from "@repo/types";
import {
	eachDayOfInterval,
	formatISO9075,
	hoursToMilliseconds,
	isWeekend,
	minutesToMilliseconds,
	isSunday,
	isFriday,
	isThursday,
	isWednesday,
	isMonday
} from "date-fns";
import { isArray } from "lodash-es";
import { v4 } from "uuid";

const checkForWorkingDay: (
	date: string,
	weekdays: number,
	holidays: string[]
) => boolean = (date: string, weekdays, holidays) => {
	if (holidays.includes(formatISO9075(date, { representation: "date" }))) {
		return false;
	}
	if (weekdays === 6 && isSunday(date)) {
		return false;
	}
	if (weekdays === 5 && isWeekend(date)) {
		return false;
	}
	if (weekdays === 4 && (isWeekend(date) || isFriday(date))) {
		return false;
	}
	if (
		weekdays === 3 &&
		(isWeekend(date) || isFriday(date) || isThursday(date))
	) {
		return false;
	}
	if (
		weekdays === 2 &&
		(isWeekend(date) ||
			isFriday(date) ||
			isThursday(date) ||
			isWednesday(date))
	) {
		return false;
	}
	if (
		weekdays === 1 &&
		(isWeekend(date) ||
			isFriday(date) ||
			isThursday(date) ||
			isWednesday(date) ||
			isMonday(date))
	) {
		return false;
	}

	return true;
};

export const createInitialTimes: (
	T: CreateInitialTime["props"]
) => CreateInitialTime["return"] = ({
	start_date,
	end_date,
	timeSettings,
	holidays
}) => {
	console.log({ start_date, end_date, timeSettings, holidays });
	const times: TimeObject[] = [];

	const createTimeObject: (day: string) => TimeObject = (day) => {
		const isWorkingDay = checkForWorkingDay(
			day,
			timeSettings.weekdays,
			holidays
		);
		// const isHoliday = holidays.includes(formatISO9075(day, {representation: 'date'}));
		const timeObject: TimeObject = {
			date: formatISO9075(new Date(day), { representation: "date" }),
			absence: null,
			default_time: null,
			time: null,
			type: isWorkingDay ? "time" : null,
			is_working_day: isWorkingDay
		};

		if (isWorkingDay) {
			console.log({ day });
			const startTime = `${day}T${timeSettings.start || "08:00"}`;
			console.log({ timeSettings });
			const pauseDuration = (timeSettings.breaks ?? []).reduce(
				(acc, curr) => {
					const pauseStart = `${day}T${curr.start}:00`;
					const pauseEnd = `${day}T${curr.end}:00`;
					return (
						acc +
						(new Date(pauseEnd).getTime() -
							new Date(pauseStart).getTime())
					);
				},
				0
			);
			console.log({ pauseDuration });
			const durationMs =
				hoursToMilliseconds(
					timeSettings.hours / timeSettings.weekdays
				) + pauseDuration;
			console.log({ durationMs });
			console.log({ startTime: new Date(startTime).getTime() });
			const endTime = new Date(
				new Date(startTime).getTime() + durationMs
			);

			console.log(endTime);

			timeObject.default_time = {
				type: "regular",
				start: startTime,
				end: `${formatISO9075(endTime, { representation: "date" })}T${formatISO9075(endTime, { representation: "time" })}`,
				pause: pauseDuration,
				duration:
					hoursToMilliseconds(
						timeSettings.hours / timeSettings.weekdays
					) + pauseDuration,
				comment: "",
				state: "initial",
				breaks: timeSettings.breaks ?? []
			};
		}
		return timeObject;
	};

	const dayInterval = eachDayOfInterval(
		{
			start: new Date(new Date(start_date)),
			end: new Date(new Date(end_date))
		},
		{ step: 1 }
	);

	dayInterval.forEach((day) => {
		times.push(
			createTimeObject(formatISO9075(day, { representation: "date" }))
		);
	});

	return {
		default_times: times,
		dates: dayInterval.map((day) =>
			formatISO9075(day, { representation: "date" })
		)
	};
};

export const getDefaultTime: (date: string) => DefaultWorkingDay = (date) => {
	return {
		objectId: "",
		month: new Date(date).getMonth(),
		year: new Date(date).getFullYear(),
		date: date,
		is_working_day: true,
		absence: null,
		saldo: 0,
		type: "work",
		default_time: null,
		surcharges: [],
		time: {
			type: "regular",
			start: `${date}T08:00:00`,
			end: `${date}T16:30:00`,
			pause: 0,
			comment: "",
			duration: 0,
			state: "initial",
			breaks: [
				{
					start: `${formatISO9075(new Date(date), { representation: "date" })}T14:00:00`,
					end: `${formatISO9075(new Date(date), { representation: "date" })}T14:30:00`,
					id: v4()
				}
			]
		}
	};
};

export const createDateIntervalForMonth: (
	year: number,
	month: number
) => string[] = (year, month) => {
	const startDay = new Date(year, month, 1);
	const endDay = new Date(year, month + 1, 0);
	const interval = eachDayOfInterval(
		{
			start: startDay,
			end: endDay
		},
		{ step: 1 }
	);
	return interval.map((day) =>
		formatISO9075(day, { representation: "date" })
	);
};

export const dateHasRecord = (
	date: string,
	records: Record[]
): boolean => {
	const currentDate = new Date(date);
	return records.some((record) => {
		const start = new Date(record.start_date);
		const end = new Date(record.end_date);
		return currentDate >= start && currentDate <= end;
	});
};

export const getRecordStartingSaldo = (
	record: Record | null | undefined
): number => {
	if (!record || record.saldo == null) {
		return 0;
	}

	return record.saldo;
};

export const monthHasRecord = (
	records: Record[],
	year: number,
	monthId: number
): boolean => {
	const monthStart = new Date(year, monthId, 1);
	const monthEnd = new Date(year, monthId + 1, 0, 23, 59, 59, 999);
	return records.some((record) => {
		const start = new Date(record.start_date);
		const end = new Date(record.end_date);
		return start <= monthEnd && end >= monthStart;
	});
};

export const findDefaultTimeForDate: (
	date: string,
	records: Record[]
) => TimeObject = (date, records) => {
	let default_time: TimeObject = {
		date,
		is_working_day: false,
		default_time: null,
		time: null,
		absence: null,
		type: null
	};

	records.forEach((record) => {
		const rec_default_time = record.default_times?.find(
			(day) => day.date === date
		);
		if (rec_default_time) {
			default_time = rec_default_time;
		}
	});

	return default_time;
};

export const getHolidayDates = (y: number, hds: Holiday[]): string[] => {
	const dateArray: string[] = [];

	if (!isArray(hds)) {
		return [];
	}

	hds.forEach((hd: Holiday) => {
		if (hd.dates && hd.dates[y.toString()]) {
			dateArray.push(hd.dates[y.toString()] as string);
		}
	});

	return dateArray;
};
