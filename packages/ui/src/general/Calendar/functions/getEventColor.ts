import type { CalendarDateObject } from "@repo/types";
import type { CalendarUser } from "../types";
import fallback_colors from "../constants/fallback_colors";

/**
 * Returns a color for the given event. If the event has an assigned user and
 * a corresponding user record provides a color, the first such color is used.
 * Otherwise a stable fallback color is chosen based on the event id.
 */
const getEventColor = (
	event: CalendarDateObject,
	users?: CalendarUser[]
): string => {
	if (users && event.assigned_users?.length) {
		for (const userId of event.assigned_users) {
			const user = users.find((u) => u.objectId === userId);
			if (user?.color) return user.color;
		}
	}
	return pickFallback(event.id);
};

const pickFallback = (id: string): string => {
	if (!id) return fallback_colors[0] as string;
	let hash = 0;
	for (let i = 0; i < id.length; i += 1) {
		hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
	}
	return fallback_colors[hash % fallback_colors.length] as string;
};

export default getEventColor;
