import { useMemo } from "react";
import { DayData } from "../types";
import { convertMillisecondsToString } from "@repo/provider";

const ColumnWorkingHours = ({
	type,
	date
}: {
	type: DayData["type"];
	date: DayData;
}) => {
	const hours = useMemo(() => {
		let hoursInt = 0;
		date?.time?.forEach((timeValue) => {
			if (timeValue) {
				hoursInt += timeValue.duration - timeValue.pause;
			}
		});
		return hoursInt;
	}, [date]);

	if (type === "work" && date.time) {
		return (
			<div style={{ float: "right" }}>
				<span style={{ textAlign: "right" }}>
					{convertMillisecondsToString(hours)}
				</span>
			</div>
		);
	}

	if (type === "absence" && date.default_time) {
		if (date.time?.find((time) => time.type === "compensation_times")) {
			return (
				<div style={{ textAlign: "right", float: "right" }}>
					{convertMillisecondsToString(0)}
				</div>
			);
		}
		return (
			<div style={{ textAlign: "right", float: "right" }}>
				{convertMillisecondsToString(
					date.default_time.duration - date.default_time.pause
				)}{" "}
				({convertMillisecondsToString(date.default_time.duration)})
			</div>
		);
	}
	return null;
};

export default ColumnWorkingHours;
