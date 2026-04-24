"use client";

import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
	DndContext,
	DragEndEvent,
	PointerSensor,
	useSensor,
	useSensors
} from "@dnd-kit/core";
import { differenceInCalendarDays } from "date-fns";
import type { CalendarDateObject } from "@repo/types";
import "./calendar.scss";
import CalendarHeader from "./components/CalendarHeader";
import CalendarMonthView from "./content/CalendarMonthView";
import CalendarWeekView from "./content/CalendarWeekView";
import CalendarDayView from "./content/CalendarDayView";
import CalendarYearView from "./content/CalendarYearView";
import CalendarEventSlideIn from "./content/CalendarEventSlideIn";
import view_settings from "./constants/view_settings";
import expandEvents from "./functions/expandEvents";
import createEmptyEvent from "./functions/createEmptyEvent";
import {
	moveInstanceByDays,
	moveInstanceByMinutes,
	resizeInstanceByMinutes
} from "./functions/updateEventDate";
import type {
	CalendarEventInstance,
	EventCalendarProps,
	CalendarView,
	CalendarViewRenderProps
} from "./types";

/**
 * Flexible calendar with year / month / week / day views, create & edit
 * slide-in and drag / resize support powered by dnd-kit.
 *
 * The calendar is fully controlled at the data level: it receives a flat
 * array of `CalendarDateObject` items, and emits changes through `onChange`,
 * `onCreate` and `onDelete`. All UI state (view, focused date, open editor)
 * is managed internally.
 */
const Calendar: FC<EventCalendarProps> = ({
	dates,
	onChange,
	onCreate,
	onDelete,
	users,
	initialView = "month",
	initialDate,
	readOnly = false
}) => {
	const [view, setView] = useState<CalendarView>(
		view_settings.find((v) => v.value === initialView) ||
			(view_settings[1] as CalendarView)
	);
	const [cursorDate, setCursorDate] = useState<Date>(
		initialDate || new Date()
	);

	const [editorOpen, setEditorOpen] = useState(false);
	const [editorMode, setEditorMode] = useState<"create" | "edit">("create");
	const [editorEvent, setEditorEvent] = useState<CalendarDateObject | null>(
		null
	);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
	);

	const instances = useMemo(() => expandEvents(dates), [dates]);

	const openCreate = useCallback(
		(
			prefill: Partial<CalendarDateObject> & {
				date?: string;
				start_minutes?: number;
			}
		) => {
			if (readOnly) return;
			const seed = createEmptyEvent(
				prefill.date ? new Date(prefill.date) : cursorDate
			);
			if (prefill.start_minutes !== undefined) {
				const start = prefill.start_minutes;
				const h = String(Math.floor(start / 60)).padStart(2, "0");
				const m = String(start % 60).padStart(2, "0");
				const endTotal = Math.min(start + 60, 24 * 60 - 1);
				const eh = String(Math.floor(endTotal / 60)).padStart(2, "0");
				const em = String(endTotal % 60).padStart(2, "0");
				seed.time.time = `${h}:${m}-${eh}:${em}`;
			}
			setEditorMode("create");
			setEditorEvent({ ...seed, ...prefill });
			setEditorOpen(true);
		},
		[cursorDate, readOnly]
	);

	const openEdit = useCallback((instance: CalendarEventInstance) => {
		setEditorMode("edit");
		setEditorEvent(instance.event);
		setEditorOpen(true);
	}, []);

	const closeEditor = useCallback(() => {
		setEditorOpen(false);
		setEditorEvent(null);
	}, []);

	const handleSave = useCallback(
		(event: CalendarDateObject) => {
			if (editorMode === "create") {
				onCreate?.(event);
			} else {
				onChange?.(event, event.id);
			}
			closeEditor();
		},
		[editorMode, onChange, onCreate, closeEditor]
	);

	const handleDelete = useCallback(
		(id: string) => {
			onDelete?.(id);
			closeEditor();
		},
		[onDelete, closeEditor]
	);

	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			if (readOnly) return;
			const { active, over, delta } = event;
			const activeData = active.data.current as
				| {
						type: "chip" | "move" | "resize";
						instance: CalendarEventInstance;
				  }
				| undefined;
			if (!activeData) return;
			const instance = activeData.instance;

			if (activeData.type === "chip") {
				if (!over) return;
				const overData = over.data.current as
					| { type: "day"; date: string }
					| undefined;
				if (!overData || overData.type !== "day") return;
				const deltaDays = differenceInCalendarDays(
					new Date(overData.date),
					new Date(instance.date)
				);
				if (deltaDays === 0) return;
				const next = moveInstanceByDays(instance, deltaDays);
				onChange?.(next, next.id);
				return;
			}

			const minuteHeight = 48 / 60;
			if (activeData.type === "move") {
				const deltaMinutes =
					Math.round(delta.y / minuteHeight / 15) * 15;
				let deltaDays = 0;
				if (over) {
					const overData = over.data.current as
						| { type: "day"; date: string }
						| undefined;
					if (overData?.type === "day") {
						deltaDays = differenceInCalendarDays(
							new Date(overData.date),
							new Date(instance.date)
						);
					}
				}
				if (deltaMinutes === 0 && deltaDays === 0) return;
				let next = instance.event;
				if (deltaDays !== 0) {
					next = moveInstanceByDays(instance, deltaDays);
				}
				if (deltaMinutes !== 0) {
					next = moveInstanceByMinutes(
						{ ...instance, event: next },
						deltaMinutes
					);
				}
				onChange?.(next, next.id);
				return;
			}

			if (activeData.type === "resize") {
				const deltaMinutes =
					Math.round(delta.y / minuteHeight / 15) * 15;
				if (deltaMinutes === 0) return;
				const next = resizeInstanceByMinutes(instance, deltaMinutes);
				onChange?.(next, next.id);
			}
		},
		[onChange, readOnly]
	);

	const viewProps: CalendarViewRenderProps = useMemo(
		() => ({
			cursorDate,
			instances,
			users,
			onEventClick: openEdit,
			onEventChange: (event) => onChange?.(event, event.id),
			onCreate: openCreate,
			setCursorDate,
			setView,
			readOnly
		}),
		[
			cursorDate,
			instances,
			users,
			openEdit,
			onChange,
			openCreate,
			setCursorDate,
			setView,
			readOnly
		]
	);

	// Close editor when dates array reference changes to avoid stale drafts.
	useEffect(() => {
		if (editorOpen && editorMode === "edit" && editorEvent) {
			const fresh = dates.find((d) => d.id === editorEvent.id);
			if (fresh && fresh !== editorEvent) {
				setEditorEvent(fresh);
			}
		}
	}, [dates, editorOpen, editorMode, editorEvent]);

	return (
		<div className="calendar_root">
			<CalendarHeader
				view={view}
				setView={setView}
				cursorDate={cursorDate}
				setCursorDate={setCursorDate}
				onCreateClick={() => openCreate({})}
				readOnly={readOnly}
			/>
			<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
				<div className="calendar_view">
					{view.value === "year" && (
						<CalendarYearView {...viewProps} />
					)}
					{view.value === "month" && (
						<CalendarMonthView {...viewProps} />
					)}
					{view.value === "week" && (
						<CalendarWeekView {...viewProps} />
					)}
					{view.value === "day" && <CalendarDayView {...viewProps} />}
				</div>
			</DndContext>
			<CalendarEventSlideIn
				isOpen={editorOpen}
				onClose={closeEditor}
				onSave={handleSave}
				onDelete={onDelete ? handleDelete : undefined}
				event={editorEvent}
				users={users}
				mode={editorMode}
			/>
		</div>
	);
};

export default Calendar;
