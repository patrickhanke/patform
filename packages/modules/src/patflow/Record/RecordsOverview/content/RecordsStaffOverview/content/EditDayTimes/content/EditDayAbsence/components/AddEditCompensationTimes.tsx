import { cloneDeep, set } from "lodash-es";
import { FC, useCallback, useState } from "react";
import { AbsenceTime } from "@repo/types";
import { AddEditCompensationTimesProps } from "../types";
import { useDebounceCallback } from "usehooks-ts";
import { convertDateToString } from "@repo/provider";
import AddEditBreak from "./AddEditBreak";
import { InfoBox } from "@repo/ui";

const AddEditCompensationTimes: FC<AddEditCompensationTimesProps> = ({
	time,
	date,
	timeChangeHandler,
	defaultTime
}) => {
	const [pauseTime, setPauseTime] = useState<boolean>(false);
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
			<InfoBox text="Diese Zeit wird verwendet, um die Überstunden zu kompensieren. Sie dient rein informativen Zwecken und berechnet keine Zeiten." />
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
	);
};

export default AddEditCompensationTimes;
