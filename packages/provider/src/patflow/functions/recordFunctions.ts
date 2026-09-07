import {
	CreateInitialTime,
	DefaultWorkingDay,
	Holiday,
	Record,
	RecordWeekdaySetting,
	TimeObject
} from "@repo/types";
import { eachDayOfInterval, formatISO9075 } from "date-fns";
import { isArray } from "lodash-es";
import { v4 } from "uuid";
import {
	getWeekdayPause,
	getWeekdaySaldo,
	getWeekdaySettingForDate,
	getWeekdaySpan,
	normalizeTimeSettings
} from "./timeSettingsFunctions";

const checkForWorkingDay: (
	date: string,
	setting: RecordWeekdaySetting | undefined,
	holidays: string[]
) => boolean = (date, setting, holidays) => {
	if (holidays.includes(formatISO9075(date, { representation: "date" }))) {
		return false;
	}

	return getWeekdaySaldo(setting) > 0;
};

export const createInitialTimes: (
	T: CreateInitialTime["props"]
) => CreateInitialTime["return"] = ({
	start_date,
	end_date,
	timeSettings,
	holidays
}) => {
	const times: TimeObject[] = [];
	const settings = normalizeTimeSettings(timeSettings);

	const createTimeObject: (day: string) => TimeObject = (day) => {
		const setting = getWeekdaySettingForDate(settings.weekdays, day);
		const isWorkingDay = checkForWorkingDay(day, setting, holidays);
		const timeObject: TimeObject = {
			date: formatISO9075(new Date(day), { representation: "date" }),
			absence: null,
			default_time: null,
			time: null,
			type: isWorkingDay ? "time" : null,
			is_working_day: isWorkingDay
		};

		if (isWorkingDay && setting) {
			const pauseDuration = getWeekdayPause(setting.breaks);

			timeObject.default_time = {
				type: "regular",
				// `start` stays without seconds so it still matches the value of
				// a datetime-local input (see `isFullDayAbsenceDay`)
				start: `${day}T${setting.start}`,
				end: `${day}T${setting.end}:00`,
				pause: pauseDuration,
				duration: getWeekdaySpan(setting),
				comment: "",
				state: "initial",
				breaks: setting.breaks ?? []
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
		worktime: 0,
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

export const dateHasRecord = (date: string, records: Record[]): boolean => {
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
		if (
			new Date(record.start_date) > new Date(date) ||
			new Date(record.end_date) < new Date(date)
		) {
			return;
		}
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
