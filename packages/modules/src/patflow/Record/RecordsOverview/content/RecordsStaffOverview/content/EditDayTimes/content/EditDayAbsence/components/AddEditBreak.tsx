import { FC, useCallback } from "react";
import { StatelessToggle } from "@repo/ui";
import { useDebounceCallback } from "usehooks-ts";
import { v4 as generateUuid } from "uuid";
import { AddEditBreakProps } from "../types";
import { convertDateToString } from "@repo/provider";

const AddEditBreak: FC<AddEditBreakProps> = ({
	time,
	updateHandler,
	defaultTime
}) => {
	console.log({ time });
	const addPause = useCallback(() => {
		if (time) {
			let pauseDuration = 0;
			if (defaultTime.pause) {
				pauseDuration = defaultTime.pause;
			}

			console.log({ time });

			const pauseStart = new Date(time.end).getTime() - pauseDuration;
			const breakArray = [];
			const pauseId = generateUuid();
			breakArray.push({
				start: convertDateToString(new Date(pauseStart)),
				end: time.end,
				id: pauseId
			});
			updateHandler("breaks", breakArray);
		}
	}, [time, defaultTime]);

	return (
		<div>
			<div className={"label"}>Ganztägig</div>
			<StatelessToggle
				onChange={(value) => {
					console.log(value);
					if (typeof value === "boolean") {
						if (value === true) {
							addPause();
						} else {
							updateHandler("breaks", []);
						}
					}
				}}
				value={time?.state === "full"}
			/>
		</div>
	);
};

export default AddEditBreak;
