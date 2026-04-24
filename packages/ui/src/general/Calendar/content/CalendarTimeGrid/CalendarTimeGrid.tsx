"use client";

import { FC, useMemo } from "react";
import { formatISO9075, isToday } from "date-fns";
import { useDroppable } from "@dnd-kit/core";
import type {
	CalendarEventInstance,
	CalendarUser,
	CalendarViewRenderProps
} from "../../types";
import CalendarEventBlock from "../../components/CalendarEventBlock";
import CalendarEventChip from "../../components/CalendarEventChip";
import { instancesByDate } from "../../functions/expandEvents";

/**
 * Shared day/week time grid. Renders a fixed time axis plus one column per
 * supplied day. Full-day events go into a lane above the grid.
 */
const CalendarTimeGrid: FC<
	Omit<CalendarViewRenderProps, "setView"> & { days: Date[] }
> = ({ days, instances, users, onEventClick, onCreate, readOnly }) => {
	const byDate = useMemo(() => instancesByDate(instances), [instances]);
	const minuteHeight = 48 / 60; // 48px per hour
	const hours = useMemo(
		() => Array.from({ length: 24 }, (_, i) => i),
		[]
	);

	return (
		<div className="calendar_time_grid_root">
			<div className="calendar_allday_row">
				<div className="calendar_allday_axis">Ganztägig</div>
				{days.map((day) => {
					const iso = formatISO9075(day, {
						representation: "date"
					});
					const all = (byDate[iso] || []).filter(
						(i) => i.start_minutes === null
					);
					return (
						<div
							key={`allday-${iso}`}
							className="calendar_allday_day"
						>
							{all.map((instance) => (
								<CalendarEventChip
									key={`${instance.id}-${iso}`}
									instance={instance}
									users={users}
									onClick={onEventClick}
									draggable={!readOnly}
								/>
							))}
						</div>
					);
				})}
			</div>
			<div className="calendar_time_grid">
				<div className="calendar_time_axis">
					{hours.map((hour) => (
						<div
							key={`axis-${hour}`}
							className="calendar_time_axis_cell"
						>
							{String(hour).padStart(2, "0")}:00
						</div>
					))}
				</div>
				<div className="calendar_time_days">
					{days.map((day) => (
						<DayColumn
							key={day.toISOString()}
							day={day}
							dayInstances={(
								byDate[
									formatISO9075(day, {
										representation: "date"
									})
								] || []
							).filter((i) => i.start_minutes !== null)}
							users={users}
							onEventClick={onEventClick}
							onCreate={onCreate}
							minuteHeight={minuteHeight}
							hours={hours}
							readOnly={readOnly}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

type DayColumnProps = {
	day: Date;
	dayInstances: CalendarEventInstance[];
	users?: CalendarUser[];
	onEventClick: (instance: CalendarEventInstance) => void;
	onCreate: (prefill: { date?: string; start_minutes?: number }) => void;
	minuteHeight: number;
	hours: number[];
	readOnly?: boolean;
};

const DayColumn: FC<DayColumnProps> = ({
	day,
	dayInstances,
	users,
	onEventClick,
	onCreate,
	minuteHeight,
	hours,
	readOnly
}) => {
	const iso = formatISO9075(day, { representation: "date" });
	const { setNodeRef, isOver } = useDroppable({
		id: `day-${iso}`,
		data: { type: "day", date: iso }
	});

	const handleGridClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (readOnly) return;
		const rect = event.currentTarget.getBoundingClientRect();
		const y = event.clientY - rect.top;
		const minutes = Math.max(0, Math.round(y / minuteHeight / 15) * 15);
		onCreate({ date: iso, start_minutes: minutes });
	};

	return (
		<div
			ref={setNodeRef}
			className="calendar_time_day_column"
			data-is_today={isToday(day)}
			data-is_drop_target={isOver}
			onClick={handleGridClick}
		>
			{hours.map((hour) => (
				<div
					key={`${iso}-${hour}`}
					className="calendar_time_hour_cell"
				/>
			))}
			{dayInstances.map((instance) => (
				<CalendarEventBlock
					key={`${instance.id}-${iso}`}
					instance={instance}
					users={users}
					onClick={onEventClick}
					minuteHeight={minuteHeight}
					readOnly={readOnly}
				/>
			))}
		</div>
	);
};

export default CalendarTimeGrid;
