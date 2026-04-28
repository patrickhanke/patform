import {
	formatISO9075,
	eachMonthOfInterval,
	eachWeekOfInterval,
	getDay,
	type Day
} from "date-fns";
import type { CalendarDateObject } from "@repo/types";
import type { CalendarEventInstance } from "../types";
import parseEventTime from "./parseEventTime";

/**
 * Generate all recurring dates for an interval event.
 * Works for both "opportunity" (recurring) and "fixed" category events.
 */
const generateIntervalDates = (event: CalendarDateObject): string[] => {
	const { time } = event;
	if (!time?.start_date || !time?.interval?.unit || !time?.interval?.number) {
		return [];
	}

	const start = new Date(time.start_date);
	const year = new Date().getFullYear();
	const end = time.end_date
		? new Date(time.end_date)
		: new Date(year + 2, 11, 31);

	if (time.interval.unit === "days") {
		const dates: string[] = [];
		const current = new Date(start);

		while (current <= end) {
			dates.push(formatISO9075(current, { representation: "date" }));
			current.setDate(
				current.getDate() + (Number(time.interval.number) || 1)
			);
		}

		return dates;
	}

	if (time.interval.unit === "weeks") {
		const interval = eachWeekOfInterval(
			{ start, end },
			{
				weekStartsOn:
					time.category?.value === "opportunity"
						? 1
						: (getDay(start) as Day),
				step: Number(time.interval.number) || 1
			}
		);

		return interval.map((date) =>
			formatISO9075(date, { representation: "date" })
		);
	}

	if (time.interval.unit === "months") {
		const startDate = start.getDate();
		const interval = eachMonthOfInterval(
			{ start, end },
			{ step: Number(time.interval.number) || 1 }
		);

		return interval.map((date) => {
			const adjusted = new Date(
				date.getFullYear(),
				date.getMonth(),
				startDate
			);
			return formatISO9075(adjusted, { representation: "date" });
		});
	}

	return [];
};

/**
 * Expand an array of `CalendarDateObject`s into concrete instances bucketed by
 * the date-strings stored on `event.time.dates`. Each date yields exactly one
 * instance so that multi-day / recurring events are trivial to render.
 *
 * For interval events (any category with interval configuration), automatically
 * generates all recurring dates based on the interval configuration.
 */
const expandEvents = (
	events: CalendarDateObject[]
): CalendarEventInstance[] => {
	const instances: CalendarEventInstance[] = [];

	events.forEach((event) => {
		let rawDates: string[] = [];

		if (
			event.time?.interval?.unit &&
			event.time?.interval?.number &&
			event.time?.start_date
		) {
			rawDates = generateIntervalDates(event);
		} else {
			rawDates = event.time?.dates || [];
		}

		const uniqueDates = new Set<string>();

		rawDates.forEach((raw: string) => {
			if (!raw) return;
			try {
				const iso = formatISO9075(new Date(raw), {
					representation: "date"
				});
				uniqueDates.add(iso);
			} catch {
				// ignore invalid dates
			}
		});

		uniqueDates.forEach((date) => {
			const { start_minutes, end_minutes } = parseEventTime(
				event.time?.time,
				event.full_day
			);
			instances.push({
				id: event.id,
				date,
				start_minutes,
				end_minutes,
				event
			});
		});
	});

	return instances;
};

export const instancesByDate = (
	instances: CalendarEventInstance[]
): Record<string, CalendarEventInstance[]> => {
	const bucket: Record<string, CalendarEventInstance[]> = {};
	instances.forEach((instance) => {
		if (!bucket[instance.date]) bucket[instance.date] = [];
		bucket[instance.date]!.push(instance);
	});
	Object.values(bucket).forEach((list) => {
		list.sort((a, b) => {
			if (a.start_minutes === null) return -1;
			if (b.start_minutes === null) return 1;
			return a.start_minutes - b.start_minutes;
		});
	});
	return bucket;
};

export default expandEvents;
