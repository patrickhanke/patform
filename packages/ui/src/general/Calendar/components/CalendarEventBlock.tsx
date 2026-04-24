"use client";

import { FC, useMemo } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { CalendarEventBlockProps } from "../types";
import getEventColor from "../functions/getEventColor";
import { formatMinutes } from "../functions/parseEventTime";

const CalendarEventBlock: FC<CalendarEventBlockProps> = ({
	instance,
	users,
	onClick,
	minuteHeight,
	leftPercent = 0,
	widthPercent = 100,
	readOnly
}) => {
	const color = useMemo(
		() => getEventColor(instance.event, users),
		[instance.event, users]
	);

	const moveDraggable = useDraggable({
		id: `move-${instance.id}-${instance.date}`,
		data: { type: "move", instance },
		disabled: readOnly
	});

	const resizeDraggable = useDraggable({
		id: `resize-${instance.id}-${instance.date}`,
		data: { type: "resize", instance },
		disabled: readOnly
	});

	if (instance.start_minutes === null || instance.end_minutes === null) {
		return null;
	}

	const baseTop = instance.start_minutes * minuteHeight;
	const baseHeight =
		(instance.end_minutes - instance.start_minutes) * minuteHeight;

	const dragDeltaY = moveDraggable.transform?.y ?? 0;
	const resizeDeltaY = resizeDraggable.transform?.y ?? 0;

	const top = baseTop + dragDeltaY;
	const height = Math.max(20, baseHeight + resizeDeltaY);

	const style: React.CSSProperties = {
		backgroundColor: color,
		top,
		height,
		left: `calc(${leftPercent}% + 2px)`,
		width: `calc(${widthPercent}% - 4px)`,
		right: "auto"
	};

	const isDragging =
		moveDraggable.isDragging || resizeDraggable.isDragging;

	return (
		<div
			ref={moveDraggable.setNodeRef}
			className="calendar_event_block"
			data-dragging={isDragging}
			style={style}
			onClick={(e) => {
				e.stopPropagation();
				onClick?.(instance);
			}}
			{...moveDraggable.listeners}
			{...moveDraggable.attributes}
		>
			<div className="calendar_event_block_title">
				{instance.event.label || "Ohne Titel"}
			</div>
			<div className="calendar_event_block_meta">
				{formatMinutes(instance.start_minutes)} –{" "}
				{formatMinutes(instance.end_minutes)}
			</div>
			{!readOnly && (
				<div
					ref={resizeDraggable.setNodeRef}
					className="calendar_event_resize_handle"
					{...resizeDraggable.listeners}
					{...resizeDraggable.attributes}
					onClick={(e) => e.stopPropagation()}
				/>
			)}
		</div>
	);
};

export default CalendarEventBlock;
