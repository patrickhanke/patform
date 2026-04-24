"use client";

import { FC, useMemo } from "react";
import {
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	formatISO9075,
	isSameMonth,
	isToday,
	startOfMonth,
	startOfWeek
} from "date-fns";
import { weekdays } from "@repo/provider";
import type { CalendarView, CalendarViewRenderProps } from "../../types";
import { instancesByDate } from "../../functions/expandEvents";

const CalendarYearView: FC<CalendarViewRenderProps> = ({
	cursorDate,
	instances,
	setCursorDate,
	setView
}) => {
	const year = cursorDate.getFullYear();

	const months = useMemo(() => {
		return Array.from({ length: 12 }, (_, monthIndex) => {
			const monthDate = new Date(year, monthIndex, 1);
			const start = startOfWeek(startOfMonth(monthDate), {
				weekStartsOn: 1
			});
			const end = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 1 });
			return {
				monthDate,
				days: eachDayOfInterval({ start, end })
			};
		});
	}, [year]);

	const byDate = useMemo(() => instancesByDate(instances), [instances]);

	const jumpTo = (day: Date) => {
		setCursorDate(day);
		setView({ value: "day", label: "Tag" } as CalendarView);
	};

	return (
		<div className="calendar_year_grid">
			{months.map(({ monthDate, days }) => (
				<div
					key={monthDate.toISOString()}
					className="calendar_year_month"
					onClick={() => {
						setCursorDate(monthDate);
						setView({ value: "month", label: "Monat" });
					}}
				>
					<div className="calendar_year_month_header">
						{format(monthDate, "LLLL")}
					</div>
					<div className="calendar_year_weekday_row">
						{weekdays.map((weekday) => (
							<div
								key={`${monthDate.toISOString()}-${weekday.value}`}
								className="calendar_year_weekday"
							>
								{weekday.short[0]}
							</div>
						))}
					</div>
					<div className="calendar_year_days">
						{days.map((day) => {
							const iso = formatISO9075(day, {
								representation: "date"
							});
							const count = byDate[iso]?.length || 0;
							return (
								<div
									key={iso}
									className="calendar_year_day"
									data-out_of_month={
										!isSameMonth(day, monthDate)
									}
									data-is_today={isToday(day)}
									onClick={(e) => {
										e.stopPropagation();
										jumpTo(day);
									}}
								>
									<span>{day.getDate()}</span>
									{count > 0 && (
										<div className="calendar_year_day_indicator">
											{Array.from({
												length: Math.min(count, 3)
											}).map((_, idx) => (
												<span
													key={idx}
													className="calendar_year_day_dot"
												/>
											))}
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
};

export default CalendarYearView;
