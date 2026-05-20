import { isArray, set } from "lodash-es";
import {
	convertDateToString,
	findDefaultTimeForDate,
	getWorktimeDuration
} from "@repo/provider";
import { CreateTimesFromAbsence } from "../types";
import { v4 as generateUuid } from "uuid";
import { WorkingTime } from "../../../types";
import { DayTime } from "@repo/types";

const createTimeFromAbsence: CreateTimesFromAbsence = (
	start,
	end,
	date,
	records,
	times,
	timeId
) => {
	console.log({ start, end, date, records, times, timeId });
	const timeCopy: DayTime = {
		type: "regular",
		state: "created",
		start: start,
		end: end,
		duration: 0,
		pause: 0,
		breaks: [],
		comment: ""
	};

	if (start && end) {
		const defaultTime = findDefaultTimeForDate(date, records);

		let totalDuration = 0;
		if (defaultTime?.default_time?.duration) {
			totalDuration =
				defaultTime?.default_time?.duration -
				defaultTime?.default_time?.pause;
		}

		let currentDuration = 0;

		if (isArray(times) && timeId) {
			const currentTimes = times.filter((t) => t.day_id !== timeId);

			currentTimes.forEach((time) => {
				currentDuration += time.duration - time.pause;
			});
		}

		const absenceDuration = getWorktimeDuration(start, end);

		currentDuration += absenceDuration;

		const breakArray = [];
		let pauseTime = 0;
		if (currentDuration > totalDuration) {
			const pauseDuration = currentDuration - totalDuration;

			const pauseStart = new Date(end).getTime() - pauseDuration;
			const pauseId = generateUuid();

			breakArray.push({
				start: convertDateToString(new Date(pauseStart).toISOString()),
				end: end,
				id: pauseId
			});

			pauseTime = getWorktimeDuration(
				convertDateToString(new Date(pauseStart)),
				end
			);
		}

		console.log({ timeCopy });

		set(timeCopy, "duration", getWorktimeDuration(start, end));
		set(timeCopy, "breaks", breakArray);
		set(timeCopy, "pause", pauseTime);
	}

	return timeCopy;
};

export default createTimeFromAbsence;
