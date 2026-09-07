import { DayTime, RecordTimeSettings, RecordWeekdaySetting } from "@repo/types";
import { getDay } from "date-fns";
import { weekdays } from "../../general/constants/weekdays";

const MS_PER_HOUR = 1000 * 60 * 60;

/** A weekday setting before its derived `saldo` has been calculated */
type WeekdayTimes = Omit<RecordWeekdaySetting, "saldo">;

/** Legacy shape of `time_settings` before the per-weekday rework */
type LegacyTimeSettings = {
	hours?: number;
	weekdays?: number | RecordWeekdaySetting[];
	start?: string;
	breaks?: DayTime["breaks"];
	pause?: DayTime["breaks"];
	vacation?: number;
};

/** Turns "HH:mm" into milliseconds since midnight */
export const parseSettingTime = (time: string | undefined): number => {
	if (!time) {
		return 0;
	}

	const [hours, minutes] = time.split(":");
	const hourValue = Number(hours);
	const minuteValue = Number(minutes);

	if (Number.isNaN(hourValue) || Number.isNaN(minuteValue)) {
		return 0;
	}

	return hourValue * MS_PER_HOUR + minuteValue * 60 * 1000;
};

/** Turns milliseconds since midnight back into "HH:mm" */
export const formatSettingTime = (ms: number): string => {
	const totalMinutes = Math.max(0, Math.round(ms / (60 * 1000)));
	const hours = Math.floor(totalMinutes / 60) % 24;
	const minutes = totalMinutes % 60;

	return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

/** Total break time of a weekday in milliseconds */
export const getWeekdayPause = (
	breaks: DayTime["breaks"] | undefined
): number =>
	(breaks ?? []).reduce((acc, current) => {
		const span =
			parseSettingTime(current?.end) - parseSettingTime(current?.start);
		return acc + Math.max(0, span);
	}, 0);

/** Gross time between start and end of a weekday in milliseconds */
export const getWeekdaySpan = (setting: WeekdayTimes | undefined): number => {
	if (!setting) {
		return 0;
	}

	return Math.max(
		0,
		parseSettingTime(setting.end) - parseSettingTime(setting.start)
	);
};

/** Net working time of a weekday (start to end minus breaks) in milliseconds */
export const getWeekdaySaldo = (setting: WeekdayTimes | undefined): number => {
	if (!setting) {
		return 0;
	}

	return Math.max(
		0,
		getWeekdaySpan(setting) - getWeekdayPause(setting.breaks)
	);
};

/** Recalculates the derived `saldo` of a weekday */
export const withWeekdaySaldo = (
	setting: WeekdayTimes
): RecordWeekdaySetting => ({
	...setting,
	saldo: getWeekdaySaldo(setting)
});

/** Sum of all weekday saldos in hours */
export const getWeeklyHours = (
	weekdaySettings: RecordWeekdaySetting[] | undefined
): number => {
	const total = (weekdaySettings ?? []).reduce(
		(acc, setting) => acc + getWeekdaySaldo(setting),
		0
	);

	return Math.round((total / MS_PER_HOUR) * 100) / 100;
};

/** Number of weekdays that actually have working time configured */
export const getWorkingDaysPerWeek = (
	weekdaySettings: RecordWeekdaySetting[] | undefined
): number =>
	(weekdaySettings ?? []).filter((setting) => getWeekdaySaldo(setting) > 0)
		.length;

/** Weekday index (0 = Monday ... 6 = Sunday) of a date */
export const getWeekdayIndexForDate = (date: string | Date): number => {
	// "YYYY-MM-DD" is parsed as UTC by `new Date`, which can shift the weekday
	// depending on the timezone, so it is read as a local date instead.
	const parsed =
		typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
			? new Date(
					Number(date.slice(0, 4)),
					Number(date.slice(5, 7)) - 1,
					Number(date.slice(8, 10))
				)
			: new Date(date);

	return (
		weekdays.find((weekday) => weekday.day === getDay(parsed))?.index ?? 0
	);
};

export const getWeekdaySettingForDate = (
	weekdaySettings: RecordWeekdaySetting[] | undefined,
	date: string | Date
): RecordWeekdaySetting | undefined => {
	const index = getWeekdayIndexForDate(date);

	return (weekdaySettings ?? []).find((setting) => setting.index === index);
};

/** Monday to Friday, 08:00 - 16:00 without breaks (40 hours per week) */
export const createDefaultWeekdaySettings = (): RecordWeekdaySetting[] =>
	weekdays.map((weekday) => {
		const isWorkingDay = weekday.index < 5;

		return withWeekdaySaldo({
			index: weekday.index,
			start: isWorkingDay ? "08:00" : "00:00",
			end: isWorkingDay ? "16:00" : "00:00",
			breaks: []
		});
	});

/**
 * Builds the per-weekday array from the legacy flat settings
 * (`hours`, `weekdays` as a count, one global `start` and one break list).
 */
const convertLegacyWeekdays = (
	settings: LegacyTimeSettings
): RecordWeekdaySetting[] => {
	const workingDays = Number(settings.weekdays) || 0;
	const breaks = settings.breaks ?? settings.pause ?? [];
	const pause = getWeekdayPause(breaks);
	const start = settings.start || "08:00";
	const dailyHours =
		workingDays > 0 ? (settings.hours ?? 0) / workingDays : 0;

	return weekdays.map((weekday) => {
		const isWorkingDay = weekday.index < workingDays;
		const end = isWorkingDay
			? formatSettingTime(
					parseSettingTime(start) + dailyHours * MS_PER_HOUR + pause
				)
			: "00:00";

		return withWeekdaySaldo({
			index: weekday.index,
			start: isWorkingDay ? start : "00:00",
			end,
			breaks: isWorkingDay ? breaks : []
		});
	});
};

/**
 * Brings any stored `time_settings` into the per-weekday shape and refreshes
 * the derived values (`saldo` per weekday, `hours` per week).
 */
export const normalizeTimeSettings = (
	settings: RecordTimeSettings | LegacyTimeSettings | undefined | null
): RecordTimeSettings => {
	const legacy = (settings ?? {}) as LegacyTimeSettings;

	const weekdaySettings = Array.isArray(legacy.weekdays)
		? weekdays.map((weekday) => {
				const stored = (legacy.weekdays as RecordWeekdaySetting[]).find(
					(setting) => setting.index === weekday.index
				);

				return withWeekdaySaldo({
					index: weekday.index,
					start: stored?.start || "00:00",
					end: stored?.end || "00:00",
					breaks: stored?.breaks ?? []
				});
			})
		: convertLegacyWeekdays(legacy);

	return {
		hours: getWeeklyHours(weekdaySettings),
		weekdays: weekdaySettings,
		vacation: legacy.vacation ?? 30
	};
};
