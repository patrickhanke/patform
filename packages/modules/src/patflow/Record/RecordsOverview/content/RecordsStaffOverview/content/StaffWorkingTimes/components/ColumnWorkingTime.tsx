import { ColumnWorkingTimeProps } from "../types";
import { getDateString } from "@repo/provider";
import { FC } from "react";
import EditDayTimes from "../../EditDayTimes";

const ColumnWorkingTime: FC<ColumnWorkingTimeProps> = ({
	type,
	time,
	date,
	refetch,
	userId,
	records
}) => {
	const isEditable = true;

	const sortedTime = time
		? time.sort(
				(a, b) =>
					new Date(a.start).getTime() - new Date(b.start).getTime()
			)
		: [];

	if (type === "absence") {
		return (
			<div className="button_container">
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
