"use client";

import React, { useMemo, useState } from "react";
import useCreateInterval from "./hooks/useCreateInterval";
import styles from "./Calendar.module.scss";
import CalendarDay from "./content/CalendarDay";
import { CalendarProps, Day } from "./types";
import { eachDayOfInterval, formatISO9075 } from "date-fns";
import CalendarHeader, { viewSettings } from "./content/CalendarHeader";
import { ViewState } from "./content/CalendarHeader/types";

const Calendar = ({ data }: CalendarProps) => {
	const [view, setView] = useState<ViewState>(
		viewSettings[0] as (typeof viewSettings)[0]
	);
	const [intervalIndex, setIntervalIndex] = useState(new Date().getMonth());
	const year = 2024;
	const interval = useCreateInterval({ view });

	const currentInterval: string[] = useMemo(() => {
		let dayInterval: Date[] = [];
		if (view.value === "monthly") {
			const start = new Date(year, intervalIndex, 1);
			const end = new Date(year, intervalIndex + 1, 0);
			dayInterval = eachDayOfInterval(
				{
					start,
					end
				},
				{ step: 1 }
			);
		}
		if (view.value === "quaterly") {
			const start = new Date(year, intervalIndex * 3, 1);
			const end = new Date(year, intervalIndex * 3 + 3, 0);
			dayInterval = eachDayOfInterval(
				{
					start,
					end
				},
				{ step: 1 }
			);
		}

		return dayInterval.map((day) =>
			formatISO9075(day, { representation: "date" })
		);
	}, [view, interval, intervalIndex, year]);

	return (
		<div className="calendar">
			<CalendarHeader
				view={view}
				setView={setView}
				intervalIndex={intervalIndex}
				setIntervalIndex={setIntervalIndex}
			/>
			<div className={styles.calendar_container}>
				{interval.length > 0 &&
					interval[intervalIndex].map((week) => (
						<div className={styles.days_container} key={week.id}>
							{week.days.map((day: Day) => (
								<CalendarDay
									key={day}
									day={day}
									currentInterval={currentInterval}
									data={data}
								/>
							))}
						</div>
					))}
			</div>
		</div>
	);
};

export default Calendar;
