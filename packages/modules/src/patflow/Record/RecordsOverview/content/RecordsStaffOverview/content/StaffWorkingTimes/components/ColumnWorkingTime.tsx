import { ColumnWorkingTimeProps } from "../types";
import { absence_type_options, getDateString } from "@repo/provider";
import { FC } from "react";
import EditDayTimes from "../../EditDayTimes";
import { StateDisplay } from "@repo/ui";

const ColumnWorkingTime: FC<ColumnWorkingTimeProps> = ({
	absence,
	type,
	time,
	date,
	refetch,
	userId,
	records
}) => {
	const isEditable = type !== "absence";

	const sortedTime = time
		? time.sort(
				(a, b) =>
					new Date(a.start).getTime() - new Date(b.start).getTime()
			)
		: [];

	if (type === "absence" && absence) {
		console.log({ sortedTime });
		console.log({ absence });

		return (
			<div className="button_container">
				<StateDisplay
					label={
						absence_type_options?.find(
							(option) => option.value === absence?.type
						)?.label || absence_type_options[0].label
					}
					color={
						absence_type_options?.find(
							(option) => option.value === absence?.type
						)?.color || absence_type_options[0].color
					}
				/>
				{sortedTime?.map((timeValue, index) => {
					if (!timeValue) {
						return null;
					}
					return (
						<>
							{isEditable ? (
								<EditDayTimes
									type="edit"
									date={date}
									dayId={timeValue.day_id}
									initialTime={timeValue}
									times={time || []}
									refetch={refetch}
									userId={userId}
									records={records}
								/>
							) : (
								<span key={getDateString(timeValue.start).time}>
									{getDateString(timeValue.start).time} -{" "}
									{getDateString(timeValue.end).time}{" "}
								</span>
							)}
							{time && index !== time.length - 1 && (
								<span> / </span>
							)}
						</>
					);
				})}
			</div>
		);
	}

	if (type === "work" && time) {
		return (
			<div className="button_container">
				{time.map((timeValue, index) => {
					if (!timeValue) {
						return null;
					}
					return (
						<>
							{isEditable ? (
								<EditDayTimes
									type="edit"
									date={date}
									dayId={timeValue.day_id}
									initialTime={timeValue}
									times={time}
									refetch={refetch}
									userId={userId}
									records={records}
								/>
							) : (
								<span key={getDateString(timeValue.start).time}>
									{getDateString(timeValue.start).time} -{" "}
									{getDateString(timeValue.end).time}{" "}
								</span>
							)}
							{index !== time.length - 1 && <span> / </span>}
						</>
					);
				})}
			</div>
		);
	}

	return null;
};

export default ColumnWorkingTime;
