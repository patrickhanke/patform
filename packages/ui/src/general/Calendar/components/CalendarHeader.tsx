"use client";

import { FC, useMemo } from "react";
import {
	addDays,
	addMonths,
	addYears,
	endOfWeek,
	format,
	startOfWeek
} from "date-fns";
import { SwitchButtons } from "../../Buttons";
import view_settings from "../constants/view_settings";
import type { CalendarHeaderProps, CalendarView } from "../types";

const CalendarHeader: FC<CalendarHeaderProps> = ({
	view,
	setView,
	cursorDate,
	setCursorDate,
	onCreateClick,
	readOnly
}) => {
	const title = useMemo(() => {
		if (view.value === "year") {
			return format(cursorDate, "yyyy");
		}
		if (view.value === "month") {
			return format(cursorDate, "LLLL yyyy");
		}
		if (view.value === "week") {
			const start = startOfWeek(cursorDate, { weekStartsOn: 1 });
			const end = endOfWeek(cursorDate, { weekStartsOn: 1 });
			return `${format(start, "dd.MM.")} – ${format(end, "dd.MM.yyyy")}`;
		}
		return format(cursorDate, "EEEE, dd.MM.yyyy");
	}, [cursorDate, view]);

	const step = (direction: 1 | -1) => {
		setCursorDate((current) => {
			if (view.value === "year") return addYears(current, direction);
			if (view.value === "month") return addMonths(current, direction);
			if (view.value === "week") return addDays(current, 7 * direction);
			return addDays(current, direction);
		});
	};

	return (
		<div className="calendar_header">
			<div className="calendar_header_nav">
				<button
					type="button"
					className="calendar_today_button"
					onClick={() => setCursorDate(new Date())}
				>
					Heute
				</button>
				<button
					type="button"
					className="calendar_nav_button"
					onClick={() => step(-1)}
					aria-label="Zurück"
				>
					‹
				</button>
				<button
					type="button"
					className="calendar_nav_button"
					onClick={() => step(1)}
					aria-label="Weiter"
				>
					›
				</button>
				<span className="calendar_header_title">{title}</span>
			</div>
			<div className="calendar_header_actions">
				<SwitchButtons
					buttonStates={view_settings}
					currentStates={view}
					changeHandler={(value) => setView(value as CalendarView)}
				/>
				{!readOnly && (
					<button
						type="button"
						className="calendar_create_button"
						onClick={onCreateClick}
					>
						+ Termin
					</button>
				)}
			</div>
		</div>
	);
};

export default CalendarHeader;
