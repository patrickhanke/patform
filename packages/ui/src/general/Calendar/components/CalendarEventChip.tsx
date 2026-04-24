"use client";

import { FC } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { CalendarEventChipProps } from "../types";
import getEventColor from "../functions/getEventColor";
import { formatMinutes } from "../functions/parseEventTime";

const CalendarEventChip: FC<CalendarEventChipProps & { draggable?: boolean }> =
	({ instance, users, onClick, compact = false, draggable = true }) => {
		const color = getEventColor(instance.event, users);
		const { attributes, listeners, setNodeRef, isDragging, transform } =
			useDraggable({
				id: `chip-${instance.id}-${instance.date}`,
				data: {
					type: "chip",
					instance
				},
				disabled: !draggable
			});

		const style: React.CSSProperties = {
			backgroundColor: color,
			transform: transform
				? `translate3d(${transform.x}px, ${transform.y}px, 0)`
				: undefined,
			opacity: isDragging ? 0.6 : undefined
		};

		return (
			<div
				ref={setNodeRef}
				className="calendar_event_chip"
				data-compact={compact}
				style={style}
				onClick={(e) => {
					e.stopPropagation();
					onClick?.(instance);
				}}
				{...listeners}
				{...attributes}
			>
				{instance.start_minutes !== null && !compact && (
					<span className="calendar_event_chip_time">
						{formatMinutes(instance.start_minutes)}
					</span>
				)}
				{compact && <span className="calendar_event_chip_dot" />}
				<span className="calendar_event_chip_label">
					{instance.event.label || "Ohne Titel"}
				</span>
			</div>
		);
	};

export default CalendarEventChip;
