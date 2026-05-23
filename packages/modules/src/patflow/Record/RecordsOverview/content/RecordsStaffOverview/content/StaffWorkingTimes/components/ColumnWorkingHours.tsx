import { useMemo } from "react";
import { DayDataTime } from "../types";
import { convertMillisecondsToString } from "@repo/provider";

const ColumnWorkingHours = ({ times }: { times: DayDataTime[] }) => {
	const hours = useMemo(() => {
		let hoursInt = 0;
		times.forEach((time) => {
			hoursInt += time.worktime;
		});
		return hoursInt;
	}, [times]);

	if (hours) {
		return (
			<div style={{ float: "right" }}>
				<span style={{ textAlign: "right" }}>
					{convertMillisecondsToString(hours)}
				</span>
			</div>
		);
	}

	// if (type === "absence" && date.default_time) {
	// 	if (date.times?.find((time) => time.time.type === "compensation_times")) {
	// 		return (
	// 			<div style={{ textAlign: "right", float: "right" }}>
	// 				{convertMillisecondsToString(0)}
	// 			</div>
	// 		);
	// 	}
	// 	return (
	// 		<div style={{ textAlign: "right", float: "right" }}>
	// 			{convertMillisecondsToString(
	// 				date.default_time.duration - date.default_time.pause
	// 			)}{" "}
	// 			({convertMillisecondsToString(date.default_time.duration)})
	// 		</div>
	// 	);
	// }
	return null;
};

export default ColumnWorkingHours;
