import { eachDayOfInterval, formatISO9075 } from "date-fns";
import { weekdays } from "@repo/provider";

export function convertMillisecondsToString(ms: number | undefined): string {
	if (ms) {
		const milsec = ms < 0 ? -ms : ms;
		const hours = Math.floor(milsec / (1000 * 60 * 60));
		let minutes: string | number = Math.floor(
			(milsec % (1000 * 60 * 60)) / (1000 * 60)
		);
		minutes = minutes < 10 ? "0" + minutes : minutes;
		if (ms < 0) {
			return `-${hours}.${minutes}`;
		}
		return ` ${hours}.${minutes}`;
	}
	return "00.00";
}

export function convertMillisecondsAndHours(
	type: "mth" | "htm",
	value: number | undefined
): number {
	if (type === "mth") {
		return value ? value / (1000 * 60 * 60) : 0;
	}
	if (type === "htm") {
		return value ? value * 1000 * 60 * 60 : 0;
	}

	return 0;
}

export function getDateFromWeek(
	weekNumber: number,
	dayIndex: number,
	year?: number
) {
	const date = new Date(year || new Date().getFullYear(), 0, 1);

	// Adjust to the first Monday of the year
	const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
	const daysToMonday = (dayOfWeek === 0 ? 7 : dayOfWeek) - 1; // Days to subtract to get to Monday
	date.setDate(date.getDate() - daysToMonday);

	// Calculate the target date
	const days = (weekNumber - 1) * 7 + dayIndex;
	date.setDate(date.getDate() + days);

	return new Date(date);
}

export const getWeekDayKeys: (
	weekNumber: number,
	start?: string,
	end?: string
) => string[] = (weekNumber, start, end) => {
	if (start && end) {
		const weekArray: string[] = [];
		const start_date = new Date(start);
		const end_date = new Date(end);
		weekdays.forEach((day) => {
			const date = getDateFromWeek(weekNumber, day.index);
			if (
				start_date.getTime() < date.getTime() &&
				date.getTime() < end_date.getTime()
			) {
				weekArray.push(formatISO9075(date, { representation: "date" }));
			}
		});
		return weekArray;
	}

	const weekDayKeys = weekdays.map((day) => {
		return formatISO9075(getDateFromWeek(weekNumber, day.index), {
			representation: "date"
		});
	});
	return weekDayKeys;
};

export const getWorktimeDuration = (start: string, end: string): number => {
	const startTime = new Date(start).getTime();
	const endTime = new Date(end).getTime();
	return endTime - startTime;
};

export const createIntervalFromTimes = (
	start: Date | string,
	end: Date | string
): string[] => {
	const interval: string[] = [];
	const startDay = new Date(start);
	const endDay = new Date(end);
	const dayInterval = eachDayOfInterval(
		{
			start: startDay,
			end: endDay
		},
		{ step: 1 }
	);

	dayInterval.forEach((day) => {
		interval.push(formatISO9075(day, { representation: "date" }));
	});

	return interval;
};

export const getDateFromString = (date: string) => {
	return new Date(date);
};
