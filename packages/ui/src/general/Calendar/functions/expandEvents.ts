import { formatISO9075 } from "date-fns";
import type { CalendarDateObject } from "@repo/types";
import type { CalendarEventInstance } from "../types";
import parseEventTime from "./parseEventTime";

/**
 * Expand an array of `CalendarDateObject`s into concrete instances bucketed by
 * the date-strings stored on `event.time.dates`. Each date yields exactly one
 * instance so that multi-day / recurring events are trivial to render.
 */
const expandEvents = (
	events: CalendarDateObject[]
): CalendarEventInstance[] => {
	const instances: CalendarEventInstance[] = [];

	events.forEach((event) => {
		const rawDates = event.time?.dates || [];
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
