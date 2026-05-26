import { absence_type_options, weekdays } from "@repo/provider";
import { getWeek } from "date-fns";

export type DayCellType = "work" | "absence" | "none" | "initial";

export interface DayCellProps {
	isHeader?: boolean;
	type: DayCellType;
	absenceType?: string;
	isWeekend?: boolean;
	isHoliday?: boolean;
	day?: Date;
}

const DayCell = ({
	isHeader,
	type,
	absenceType,
	isWeekend,
	isHoliday,
	day
}: DayCellProps) => {
	const colorMap: Record<string, string> = {
		red: "#ef4444",
		blue: "#3b82f6",
		yellow: "#eab308",
		orange: "#f97316",
		green: "#22c55e"
	};

	const getCellColor = () => {
		if (type === "work") {
			return colorMap.green;
		}
		if (type === "absence" && absenceType) {
			const option = absence_type_options.find(
				(opt) => opt.value === absenceType
			);
			return option?.color ? colorMap[option.color] : "#e5e7eb";
		}
		if (isWeekend) {
			return "#f2f2f2";
		}
		if (isHoliday) {
			return "#dbeafe";
		}
		return "transparent";
	};

	const cellStyle = {
		backgroundColor: getCellColor()
	};

	const currentWeek = getWeek(new Date(), { weekStartsOn: 1 });
	const week = day ? getWeek(day, { weekStartsOn: 1 }) : null;

	return (
		<div
			className="record-calendar-day-cell"
			style={cellStyle}
			data-current-week={currentWeek === week}
			data-is-header={isHeader}
		>
			{isHeader && (
				<>
					<p>
						{day?.getDate()?.toString()} <br />
					</p>
					<p>
						{
							weekdays.find(
								(weekday) => weekday.day === day?.getDay()
							)?.short
						}
					</p>
				</>
			)}
		</div>
	);
};

export default DayCell;
