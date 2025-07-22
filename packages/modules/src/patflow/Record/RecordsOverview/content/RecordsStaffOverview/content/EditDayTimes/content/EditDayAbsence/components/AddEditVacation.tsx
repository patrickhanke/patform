import { FC } from "react";
import { AddEditVacationProps } from "../types";
import { findDefaultTimeForDate, getDateString } from "@repo/provider";

const AddEditVacation: FC<AddEditVacationProps> = ({ date, records }) => {
	const defaultTime = findDefaultTimeForDate(date, records);
	return (
		<div>
			<div className="light_box flex col gap-sm">
				<div className="horizontal_container">
					<div className={"label"}>Start</div>
					<p>
						{getDateString(defaultTime.default_time?.start).date} -{" "}
						{getDateString(defaultTime.default_time?.start).time}
					</p>
				</div>
				<div className="horizontal_container">
					<div className={"label"}>Ende</div>
					<p>
						{getDateString(defaultTime.default_time?.end).date} -{" "}
						{getDateString(defaultTime.default_time?.end).time}
					</p>
				</div>
			</div>
		</div>
	);
};

export default AddEditVacation;
