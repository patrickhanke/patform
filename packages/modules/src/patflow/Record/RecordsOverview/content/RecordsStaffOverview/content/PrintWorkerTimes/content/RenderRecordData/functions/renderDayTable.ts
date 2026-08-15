import {
	absence_type_options,
	convertMillisecondsToString,
	getDateString,
	weekdays
} from "@repo/provider";
import autoTable from "jspdf-autotable";
import { getDay } from "date-fns";
import jsPDF from "jspdf";
import { DayData, DayDataTime } from "../types";

const getTarget = (day: DayData) => {
	if (
		day.is_working_day &&
		day.default_time?.duration &&
		day.default_time?.pause
	) {
		return day.default_time.duration - day.default_time.pause;
	}

	return 0;
};

const getHours = (times: DayDataTime[]) =>
	times.reduce((acc, time) => acc + time.worktime, 0);

const getSaldo = (day: DayData) => {
	const defaultTimeSpan =
		(day.default_time?.duration || 0) - (day.default_time?.pause || 0);

	if (day.times.length === 0 && day.is_working_day) {
		return -defaultTimeSpan;
	}

	return day.times.reduce((acc, time) => acc + time.saldo, 0);
};

const renderDayTable = ({
	doc,
	dayData
}: {
	doc: jsPDF;
	dayData: DayData[];
}) => {
	autoTable(doc, {
		startY: 60,
		head: [
			["Datum", "Tag", "Start", "Pause", "Ende", "Ist", "Soll", "Saldo"]
		],

		body: dayData.map((day) => {
			let start = "";
			let end = "";
			let breaks = "";

			let weekday =
				weekdays.find((weekdayOption) => weekdayOption.day === getDay(day.date))
					?.short || "";

			const absenceTimes = day.times.filter(
				(time) => time.type === "absence"
			);
			if (absenceTimes.length > 0) {
				const absenceLabels = absenceTimes
					.map(
						(timeValue) =>
							absence_type_options.find(
								(option) =>
									option.value === timeValue.absence?.type
							)?.label
					)
					.filter(Boolean);
				if (absenceLabels.length > 0) {
					weekday += " - " + absenceLabels.join(" / ");
				}
			}

			day.times.forEach((timeValue: DayDataTime, index: number) => {
				if (!timeValue.time?.start || !timeValue.time?.end) {
					return;
				}

				if (index > 0) {
					start += " \n";
					end += " \n";
				}
				start += getDateString(timeValue.time.start).time;
				end += getDateString(timeValue.time.end).time;

				timeValue.time.breaks?.forEach((breakValue, breakIndex) => {
					if (index > 0 || breakIndex > 0) {
						breaks += " \n";
					}
					if (breakValue) {
						breaks += `${getDateString(breakValue.start).time} - ${getDateString(breakValue.end).time}`;
					} else {
						breaks += "-";
					}
				});
			});

			const hoursInt = getHours(day.times);
			const target = getTarget(day);
			const saldo = getSaldo(day);

			return [
				getDateString(day.date).date,
				weekday,
				start,
				breaks,
				end,
				hoursInt ? convertMillisecondsToString(hoursInt) : "",
				day.is_working_day
					? convertMillisecondsToString(target || 0)
					: "",
				day.is_working_day || saldo !== 0
					? convertMillisecondsToString(saldo)
					: ""
			];
		}),

		styles: { fontSize: 8 },
		headStyles: { fillColor: [66, 139, 202] }
	});
};

export default renderDayTable;
