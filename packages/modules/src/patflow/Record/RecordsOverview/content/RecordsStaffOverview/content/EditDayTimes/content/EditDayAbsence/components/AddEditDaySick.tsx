import { cloneDeep, set } from "lodash-es";
import { FC, useCallback } from "react";
import { AbsenceTime } from "@repo/types";
import { AddEditDaySickProps } from "../types";
import { useDebounceCallback } from "usehooks-ts";
import { StatelessToggle } from "@repo/ui";
import { convertDateToString } from "@repo/provider";

const AddEditDaySick: FC<AddEditDaySickProps> = ({
	time,
	date,
	timeChangeHandler
}: {
	time: AbsenceTime;
	date: string;
	timeChangeHandler: (t: AbsenceTime) => void;
}) => {
	const updateHandler = useCallback(
		(key: string, value: string) => {
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
			<div className="horizontal_container">
				<div className={"label"}>Ganztägig</div>
				<StatelessToggle
					onChange={(value) => {
						if (typeof value === "boolean") {
							if (value === true) {
								debounced("state", "full");
							} else {
								debounced("state", "part");
							}
						}
					}}
					value={time?.state === "full"}
				/>
			</div>
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
					disabled={!date || time?.state === "full"}
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
					disabled={!date || time?.state === "full"}
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

export default AddEditDaySick;
