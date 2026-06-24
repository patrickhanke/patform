import { AbsenceTime, AbsenceType, Day } from "@repo/types";

const FULL_DAY_ABSENCE_TYPES: AbsenceType[] = [
	"vacation",
	"compensation_times"
];

const isAbsenceTime = (time: Day["time"]): time is AbsenceTime => {
	if (!time || !("state" in time)) {
		return false;
	}

	return (
		time.type === "illness" ||
		time.type === "vacation" ||
		time.type === "compensation_times" ||
		time.type === "payed_absence"
	);
};

export const isFullDayAbsenceDay = (day: Day): boolean => {
	if (day.type !== "absence" || !day.time) {
		return false;
	}

	if (isAbsenceTime(day.time)) {
		if (FULL_DAY_ABSENCE_TYPES.includes(day.time.type)) {
			return true;
		}

		return day.time.state === "full";
	}

	if (day.absence && day.default_time?.type === "regular") {
		if (FULL_DAY_ABSENCE_TYPES.includes(day.absence.type)) {
			return true;
		}

		return (
			day.time.start === day.default_time.start &&
			day.time.end === day.default_time.end
		);
	}

	return false;
};

export const dayHasFullDayAbsence = (
	date: string,
	days?: Day[]
): boolean => {
	if (!days?.length) {
		return false;
	}

	return days
		.filter((day) => day.date === date)
		.some(isFullDayAbsenceDay);
};

export const getSaldo: (
	time: Day["time"],
	default_time: Day["default_time"]
) => number = (time, default_time) => {
	let saldo = 0;

	if (time && time.duration && default_time?.duration) {
		const timeSpan = time.duration - time.pause;
		const defaultTimeSpan = default_time.duration - default_time.pause;
		saldo = timeSpan - defaultTimeSpan;
	}

	return saldo;
};
