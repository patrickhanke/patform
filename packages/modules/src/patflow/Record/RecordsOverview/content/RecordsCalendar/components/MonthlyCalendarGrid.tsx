import WorkerRow from "./WorkerRow";
import { eachDayOfInterval, endOfMonth, startOfMonth } from "date-fns";
import DayCell from "./DayCell";
import { MonthlyCalendarGridProps } from "../types";

const MonthlyCalendarGrid = ({
	workers,
	month,
	days
}: MonthlyCalendarGridProps) => {
	const monthStart = startOfMonth(month);
	const monthEnd = endOfMonth(month);

	const interval = eachDayOfInterval({
		start: monthStart,
		end: monthEnd
	});

	return (
		<div className="monthly-calendar-grid">
			<div className="calendar-header">
				<div className="header-worker-label">Mitarbeiter</div>
				<div className="header-days">
					{interval.map((day, index) => (
						<DayCell key={index} type="none" day={day} isHeader />
						// <div key={index} className="day-header">
						// 	{day.getDate()}
						// </div>
					))}
				</div>
			</div>
			<div className="calendar-body">
				{workers.map((worker) => {
					const workerDays = days.filter(
						(day) => day.user.objectId === worker.objectId
					);
					return (
						<WorkerRow
							key={worker.objectId}
							worker={worker}
							interval={interval}
							days={workerDays}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default MonthlyCalendarGrid;
