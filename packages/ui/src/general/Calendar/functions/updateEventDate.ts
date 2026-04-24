import { addDays, formatISO9075 } from "date-fns";
import type { CalendarDateObject } from "@repo/types";
import type { CalendarEventInstance } from "../types";
import { formatMinutes, formatTimeRange } from "./parseEventTime";

/**
 * Applies a drag delta (whole days) to a specific occurrence of an event and
 * returns an updated event. Only the matching date in `time.dates` is moved.
 */
export const moveInstanceByDays = (
	instance: CalendarEventInstance,
	deltaDays: number
): CalendarDateObject => {
	const event = instance.event;
	if (deltaDays === 0) return event;
	const nextDates = (event.time?.dates || []).map((raw: string) => {
		if (!raw) return raw;
		try {
			const iso = formatISO9075(new Date(raw), {
				representation: "date"
			});
			if (iso === instance.date) {
				return formatISO9075(addDays(new Date(raw), deltaDays), {
					representation: "date"
				});
			}
			return iso;
		} catch {
			return raw;
		}
	});
	return {
		...event,
		time: {
			...event.time,
			dates: nextDates
		}
	};
};

/**
 * Applies a minute delta to an events start time. If the event has no range,
 * a default duration is applied. All occurrences share the same time, so
 * changing one instance updates the whole event.
 */
export const moveInstanceByMinutes = (
	instance: CalendarEventInstance,
	deltaMinutes: number
): CalendarDateObject => {
	const event = instance.event;
	const start = (instance.start_minutes ?? 0) + deltaMinutes;
	const duration =
		instance.end_minutes !== null && instance.start_minutes !== null
			? instance.end_minutes - instance.start_minutes
			: 60;
	const end = start + duration;
	const clampedStart = Math.max(0, Math.min(24 * 60 - duration, start));
	const clampedEnd = clampedStart + duration;
	return {
		...event,
		time: {
			...event.time,
			time: formatTimeRange(clampedStart, clampedEnd)
		}
	};
};

/**
 * Applies a minute delta to an event's end time (resize). Minimum length 15min.
 */
export const resizeInstanceByMinutes = (
	instance: CalendarEventInstance,
	deltaMinutes: number
): CalendarDateObject => {
	const event = instance.event;
	const start = instance.start_minutes ?? 0;
	const end = Math.max(
		start + 15,
		Math.min(24 * 60, (instance.end_minutes ?? start + 60) + deltaMinutes)
	);
	return {
		...event,
		time: {
			...event.time,
			time: formatTimeRange(start, end)
		}
	};
};

/**
 * Sets an explicit start minute on an event (used by editor form).
 */
export const setEventTime = (
	event: CalendarDateObject,
	start_minutes: number,
	end_minutes: number
): CalendarDateObject => ({
	...event,
	time: {
		...event.time,
		time: `${formatMinutes(start_minutes)}-${formatMinutes(end_minutes)}`
	}
});
