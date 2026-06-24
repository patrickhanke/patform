import { ColumnWorkingTimeProps, DayDataTime } from "../types";
import { absence_type_options, dateHasRecord, getDateString } from "@repo/provider";
import { FC } from "react";
import EditDayTimes from "../../EditDayTimes";
import { StateDisplay } from "@repo/ui";

const ColumnWorkingTime: FC<ColumnWorkingTimeProps> = ({
	isWorkingDay,
	times,
	date,
	days,
	refetch,
	userId,
	records
}) => {
	const isEditable = true;
	const hasRecordForDate = dateHasRecord(date, records);

	const sortedTime = times
		? times.sort(
				(a, b) =>
					new Date(a.time?.start).getTime() -
					new Date(b.time?.start).getTime()
			)
		: [];

	const getLabel = (timeValue: DayDataTime) => {
		let absenceType = "";
		if (timeValue.type === "absence") {
			absenceType =
				absence_type_options?.find(
					(option) => option.value === timeValue.absence?.type
				)?.label || absence_type_options[0].label;
		}
		if (absenceType) {
			return `${absenceType} - ${getDateString(timeValue.time?.start).time} - ${getDateString(timeValue.time?.end).time}`;
		}
		return `${getDateString(timeValue.time?.start).time} - ${getDateString(timeValue.time?.end).time}`;
	};

	const getColor = (timeValue: DayDataTime) => {
		if (timeValue.type === "absence") {
			return (
				absence_type_options?.find(
					(option) => option.value === timeValue.absence?.type
				)?.color || absence_type_options[0].color
			);
		}
		return "green";
	};

	return (
		<div className="button_container">
			{sortedTime.map((timeValue) => {
				if (timeValue.type === "absence") {
					return (
						<div
							key={timeValue.day_id}
							className="button_container"
						>
							<>
								{isEditable ? (
									<EditDayTimes
										days={days}
										type="edit"
										date={date}
										isWorkingDay={isWorkingDay}
										hasRecordForDate={hasRecordForDate}
										dayId={timeValue.day_id}
										initialTime={timeValue.time}
										times={times || []}
										refetch={refetch}
										userId={userId}
										records={records}
										absenceId={timeValue.absence?.objectId}
										color={getColor(timeValue)}
										label={getLabel(timeValue)}
									/>
								) : (
									<StateDisplay
										label={getLabel(timeValue)}
										color={getColor(timeValue)}
									/>
								)}
							</>
						</div>
					);
				}

				if (timeValue.type === "work") {
					return (
						<div
							key={timeValue.day_id}
							className="button_container"
						>
							<>
								{isEditable ? (
									<EditDayTimes
										days={days}
										type="edit"
										isWorkingDay={isWorkingDay}
										hasRecordForDate={hasRecordForDate}
										date={date}
										dayId={timeValue.day_id}
										initialTime={timeValue.time}
										times={times || []}
										refetch={refetch}
										userId={userId}
										records={records}
									/>
								) : (
									<StateDisplay
										label={getLabel(timeValue)}
										color={getColor(timeValue)}
									/>
								)}
							</>
						</div>
					);
				}
			})}
		</div>
	);
};

export default ColumnWorkingTime;
