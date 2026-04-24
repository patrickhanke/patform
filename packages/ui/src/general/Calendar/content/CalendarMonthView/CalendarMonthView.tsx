"use client";

import { FC, useMemo } from "react";
import {
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	formatISO9075,
	isSameMonth,
	isToday,
	startOfMonth,
	startOfWeek
} from "date-fns";
import { useDroppable } from "@dnd-kit/core";
import { weekdays } from "@repo/provider";
import type { CalendarViewRenderProps } from "../../types";
import CalendarEventChip from "../../components/CalendarEventChip";
import { instancesByDate } from "../../functions/expandEvents";

const CalendarMonthView: FC<CalendarViewRenderProps> = ({
	cursorDate,
	instances,
	users,
	onEventClick,
	onCreate,
	readOnly
}) => {
	const days = useMemo(() => {
		const start = startOfWeek(startOfMonth(cursorDate), {
			weekStartsOn: 1
		});
		const end = endOfWeek(endOfMonth(cursorDate), { weekStartsOn: 1 });
		return eachDayOfInterval({ start, end });
	}, [cursorDate]);

	const weeks = useMemo(() => {
		const rows: Date[][] = [];
		for (let i = 0; i < days.length; i += 7) {
			rows.push(days.slice(i, i + 7));
		}
		return rows;
	}, [days]);

	const byDate = useMemo(() => instancesByDate(instances), [instances]);

	return (
		<div className="calendar_month_grid">
			<div className="calendar_weekday_row">
				{weekdays.map((weekday) => (
					<div
						key={weekday.value}
						className="calendar_weekday_cell"
					>
						{weekday.short}
					</div>
				))}
			</div>
			{weeks.map((week, index) => (
				<div
					className="calendar_month_week"
					key={`week-${index}`}
				>
					{week.map((day) => (
						<MonthDayCell
							key={day.toISOString()}
							day={day}
							cursorDate={cursorDate}
							dayInstances={
								byDate[
									formatISO9075(day, {
										representation: "date"
									})
								] || []
							}
							users={users}
							onEventClick={onEventClick}
							onCreate={onCreate}
							readOnly={readOnly}
						/>
					))}
				</div>
			))}
		</div>
	);
};

type MonthDayCellProps = {
	day: Date;
	cursorDate: Date;
	dayInstances: CalendarViewRenderProps["instances"];
	users?: CalendarViewRenderProps["users"];
	onEventClick: CalendarViewRenderProps["onEventClick"];
	onCreate: CalendarViewRenderProps["onCreate"];
	readOnly?: boolean;
};

const MonthDayCell: FC<MonthDayCellProps> = ({
	day,
	cursorDate,
	dayInstances,
	users,
	onEventClick,
	onCreate,
	readOnly
}) => {
	const iso = formatISO9075(day, { representation: "date" });
	const { setNodeRef, isOver } = useDroppable({
		id: `day-${iso}`,
		data: { type: "day", date: iso }
	});

	const visible = dayInstances.slice(0, 3);
	const hidden = dayInstances.length - visible.length;

	return (
		<div
			ref={setNodeRef}
			className="calendar_month_day"
			data-out_of_month={!isSameMonth(day, cursorDate)}
			data-is_today={isToday(day)}
			data-is_drop_target={isOver}
			onClick={() => {
				if (!readOnly) onCreate({ date: iso });
			}}
		>
			<div className="calendar_day_number">{day.getDate()}</div>
			<div className="calendar_month_events">
				{visible.map((instance) => (
					<CalendarEventChip
						key={`${instance.id}-${instance.date}`}
						instance={instance}
						users={users}
						onClick={onEventClick}
						draggable={!readOnly}
					/>
				))}
				{hidden > 0 && (
					<span className="calendar_more_events">
						+{hidden} weitere
					</span>
				)}
			</div>
		</div>
	);
};

export default CalendarMonthView;
