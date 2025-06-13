import { getDateString } from "@repo/provider";
import {
	format,
	formatISO9075,
	millisecondsToMinutes,
	minutesToMilliseconds
} from "date-fns";
import { FC, useCallback } from "react";
import { EditTimeProps, WorkingTime } from "../types";
import { useDebounceCallback } from "usehooks-ts";
import { cloneDeep } from "lodash-es";
import "../styles.scss";

const EditTime: FC<EditTimeProps> = ({ time, timeChangeHandler, date }) => {
	console.log({ time });

	const updateHandler = useCallback(
		(
			key: "start" | "end" | "pause" | "comment" | "date",
			value: string
		) => {
			console.log(key, value);

			const timeCopy: WorkingTime = cloneDeep(time);
			if (!time) {
				return;
			}
			if (key === "start" || key === "end") {
				const editDate = new Date(date as string);
				const hours = value.split(":")[0];
				const minutes = value.split(":")[1];
				editDate.setHours(Number(hours));
				editDate.setMinutes(Number(minutes));
				const newDate = format(editDate, "yyyy-MM-dd'T'HH:mm:ss");

				timeCopy[key] = newDate;
			}
			if (key === "pause") {
				const pauseValue = minutesToMilliseconds(Number(value));
				timeCopy.pause = pauseValue;
			}
			if (key === "comment") {
				timeCopy.comment = value;
			}

			timeChangeHandler(timeCopy);
		},
		[time]
	);

	const debounced = useDebounceCallback(updateHandler, 600);

	return (
		<div>
			<div>
				<h3>{getDateString(formatISO9075(new Date(date))).date}</h3>
			</div>
			<form className="edit_day_edit_time_form" action="">
				<div className="row_container">
					<label htmlFor={"start"}>Start</label>
					<input
						aria-label="Time"
						id={"start"}
						name={"start"}
						type="time"
						// onChange={(e) => timeChangeHandler(dayKey as string, {...time, start: e.target.value as D})}
						onChange={(e) => debounced("start", e.target.value)}
						defaultValue={
							time?.start
								? formatISO9075(time.start, {
										representation: "time"
									}).slice(0, 5)
								: ""
						}
						step={undefined}
						disabled={!date}
					/>
				</div>
				<div className="row_container">
					<label htmlFor={"end"}>Ende</label>
					<input
						aria-label="Time"
						id={"end"}
						name={"end"}
						type="time"
						onChange={(e) => debounced("end", e.target.value)}
						defaultValue={
							time?.end
								? formatISO9075(time.end, {
										representation: "time"
									}).slice(0, 5)
								: ""
						}
						step={undefined}
						disabled={!date}
					/>
				</div>
				<div className="row_container">
					<label htmlFor={"pause"}>Pause</label>
					<input
						aria-label="Time"
						id={"pause"}
						name={"pause"}
						type="number"
						onChange={(e) => debounced("pause", e.target.value)}
						defaultValue={millisecondsToMinutes(time?.pause || 0)}
						step={undefined}
						disabled={false}
					/>
				</div>
				<div>
					<label htmlFor="comments">Kommentar</label>
					<textarea
						style={{ width: "100%" }}
						id={"comment"}
						name={"comment"}
						onChange={(e) => debounced("comment", e.target.value)}
						defaultValue={time?.comment}
						disabled={!date}
					/>
				</div>
			</form>
		</div>
	);
};

export default EditTime;
