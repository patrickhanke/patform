import { ColumnWorkingTimeProps } from "../types";
import { getDateString } from "@repo/provider";
import EditDayTimes from "../content/EditDayTimes";
import { FC } from "react";

const ColumnWorkingTime: FC<ColumnWorkingTimeProps> = ({
	type,
	time,
	date,
	refetch,
	userId
}) => {
	const isEditable = true;

	console.log(time);

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
									refetch={refetch}
									userId={userId}
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
