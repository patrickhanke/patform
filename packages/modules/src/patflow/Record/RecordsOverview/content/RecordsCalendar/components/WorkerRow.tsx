import DayCell from "./DayCell";
import { formatISO9075, isWeekend } from "date-fns";
import { DisplayWorker } from "@repo/ui";
import { WorkerRowProps } from "../types";

const WorkerRow = ({ worker, interval, days }: WorkerRowProps) => {
	return (
		<div className="worker-row">
			<div className="worker-info">
				<DisplayWorker workerId={worker.objectId} />
			</div>
			<div className="worker-days">
				{interval.map((day, index) => {
					const dayData = days.find(
						(d) =>
							d.date ===
							formatISO9075(day, { representation: "date" })
					);
					const dayType = dayData?.type;
					const absenceType = dayData?.absence?.type;
					return (
						<DayCell
							key={index}
							type={dayType || "none"}
							absenceType={absenceType}
							isWeekend={isWeekend(day)}
							isHoliday={false}
							day={day}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default WorkerRow;
