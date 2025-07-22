import { cloneDeep, set } from "lodash-es";
import { FC, useCallback } from "react";
import { AbsenceTime } from "@repo/types";
import { AddEditCompensationTimesProps } from "../types";
import { useDebounceCallback } from "usehooks-ts";
import { convertDateToString } from "@repo/provider";
import AddEditBreak from "./AddEditBreak";

const AddEditCompensationTimes: FC<AddEditCompensationTimesProps> = ({
	time,
	date,
	timeChangeHandler,
	defaultTime
}) => {
	const updateHandler = useCallback(
		(key: string, value: string | object[]) => {
			const timeCopy: AbsenceTime = cloneDeep(time);
			if (!time) {
				return;
			}
			set(timeCopy, key, value);

			timeChangeHandler(timeCopy);
		},
		[time]
	);

	const debounced = useDebounceCallback(updateHandler, 600);

	return (
		<div className="vertical_container gap-sm">
			<AddEditBreak
				time={time}
				updateHandler={(key, value) => {
					debounced(key, value);
				}}
				defaultTime={defaultTime}
			/>
			<div className="horizontal_container">
				<label htmlFor={"start"}>Start</label>
				<input
					aria-label="Time"
					id={"start"}
					name={"start"}
					type="datetime-local"
					// onChange={(e) => timeChangeHandler(dayKey as string, {...time, start: e.target.value as D})}
					onChange={(e) => {
						if (e.target.value) {
							debounced(
								"start",
								convertDateToString(e.target.value)
							);
						}
					}}
					defaultValue={time?.start || ""}
					step={undefined}
					disabled={!date}
				/>
			</div>
			<div className="horizontal_container">
				<label htmlFor={"end"}>Ende</label>
				<input
					aria-label="Time"
					id={"end"}
					name={"end"}
					type="datetime-local"
					onChange={(e) => {
						if (e.target.value) {
							debounced(
								"end",
								convertDateToString(e.target.value)
							);
						}
					}}
					defaultValue={time?.end || ""}
					step={undefined}
					disabled={!date}
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
		</div>
	);
};

export default AddEditCompensationTimes;
