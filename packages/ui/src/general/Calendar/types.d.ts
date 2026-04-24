import type { CalendarDateObject } from "@repo/types";
import type { Dispatch, SetStateAction } from "react";

export type CalendarViewValue = "year" | "month" | "week" | "day";

export type CalendarView = {
	value: CalendarViewValue;
	label: string;
	is_icon?: boolean;
};

/**
 * A user that can be assigned to a calendar event. The color (if given) is
 * used to visually distinguish events that belong to this user.
 */
export type CalendarUser = {
	objectId: string;
	label?: string;
	/** Hex or CSS color. If omitted the calendar falls back to a neutral color. */
	color?: string;
};

/**
 * Represents a single concrete occurrence of a `CalendarDateObject` on a given
 * day. Because a `CalendarDateObject` may contain multiple dates (multi /
 * recurring events) the calendar expands the object into one instance per date.
 */
export type CalendarEventInstance = {
	/** The CalendarDateObject id. Multiple instances share the same id. */
	id: string;
	/** The concrete date of this instance in `YYYY-MM-DD` format. */
	date: string;
	/** Start time in minutes from 00:00. `null` for full day events. */
	start_minutes: number | null;
	/** End time in minutes from 00:00. `null` for full day events. */
	end_minutes: number | null;
	event: CalendarDateObject;
};

export type EventCalendarProps = {
	/**
	 * Events to render in the calendar. Multiple data sources can be merged
	 * outside of the calendar and passed in as a single flat array.
	 */
	dates: CalendarDateObject[];
	/**
	 * Called whenever the user edits, drags or resizes an event. The calendar
	 * itself does not persist any state; it only emits changes.
	 */
	onChange?: (event: CalendarDateObject, id: string) => void;
	/**
	 * Called when the user creates a new event from the UI. The calendar will
	 * generate a temporary id which the consumer may replace.
	 */
	onCreate?: (event: CalendarDateObject) => void;
	/** Called when the user deletes an event from the edit slide-in. */
	onDelete?: (id: string) => void;
	/** Optional user directory. Used to color events and offer assignees. */
	users?: CalendarUser[];
	/** Initial view, defaults to `month`. */
	initialView?: CalendarViewValue;
	/** Initial focused date, defaults to today. */
	initialDate?: Date;
	/** Disable editing / drag / resize. */
	readOnly?: boolean;
};

export type CalendarHeaderProps = {
	view: CalendarView;
	setView: (view: CalendarView) => void;
	cursorDate: Date;
	setCursorDate: Dispatch<SetStateAction<Date>>;
	onCreateClick: () => void;
	readOnly?: boolean;
};

export type CalendarEventBlockProps = {
	instance: CalendarEventInstance;
	users?: CalendarUser[];
	onClick?: (instance: CalendarEventInstance) => void;
	onDragEnd?: (instance: CalendarEventInstance, deltaMinutes: number) => void;
	onResizeEnd?: (instance: CalendarEventInstance, deltaMinutes: number) => void;
	/** Height per minute (in px). */
	minuteHeight: number;
	/** Left offset in percent (0-100). */
	leftPercent?: number;
	/** Width in percent (0-100). */
	widthPercent?: number;
	readOnly?: boolean;
};

export type CalendarEventChipProps = {
	instance: CalendarEventInstance;
	users?: CalendarUser[];
	onClick?: (instance: CalendarEventInstance) => void;
	compact?: boolean;
};

export type CalendarViewRenderProps = {
	cursorDate: Date;
	instances: CalendarEventInstance[];
	users?: CalendarUser[];
	onEventClick: (instance: CalendarEventInstance) => void;
	onEventChange: (event: CalendarDateObject) => void;
	onCreate: (prefill: Partial<CalendarDateObject> & { date?: string }) => void;
	setCursorDate: Dispatch<SetStateAction<Date>>;
	setView: (view: CalendarView) => void;
	readOnly?: boolean;
};

export type CalendarEventSlideInProps = {
	isOpen: boolean;
	onClose: () => void;
	onSave: (event: CalendarDateObject) => void;
	onDelete?: (id: string) => void;
	event: CalendarDateObject | null;
	users?: CalendarUser[];
	mode: "create" | "edit";
};
