import { formatISO9075 } from "date-fns";
import type { CalendarDateObject } from "@repo/types";

/**
 * Creates a blank `CalendarDateObject` that can be used as a form seed when
 * the user starts creating a new event. The consumer is expected to replace
 * the generated `id` with its own on persist.
 */
const createEmptyEvent = (date?: Date): CalendarDateObject => {
	const iso = formatISO9075(date || new Date(), {
		representation: "date"
	});
	return {
		label: "",
		text: "",
		full_day: false,
		id: generateId(),
		assigned_users: [],
		place: { type: "address", address: "" },
		time: {
			type: { value: "single", label: "Einzeltermin" },
			category: { value: "fixed", label: "Erledigen am" },
			interval: { number: 1, unit: "weeks" },
			dates: [iso],
			start_date: iso,
			end_date: iso,
			weekday: "",
			time: "09:00-10:00"
		}
	};
};

const generateId = (): string => {
	return `cal_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
};

export default createEmptyEvent;
