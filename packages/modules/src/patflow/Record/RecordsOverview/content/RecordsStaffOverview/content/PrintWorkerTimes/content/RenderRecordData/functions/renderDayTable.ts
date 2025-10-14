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
			let saldoInt = 0;
			let hoursInt = 0;
			let breaks = "";

			let weekday =
				weekdays.find((weekday) => weekday.day === getDay(day.date))
					?.short || "";

			if (day) {
				// has absence
				if (day.absence && day.absence.type && day.default_time) {
					console.log(day.absence);
					const absenceLabel =
						absence_type_options.find(
							(option) => option.value === day?.absence?.type
						)?.label || "frei";
					weekday += " - " + absenceLabel;

					hoursInt =
						day.default_time.duration - day.default_time.pause;
					saldoInt = 0;
				} else if (
					day &&
					day.default_time &&
					day.default_time.duration &&
					day.default_time.pause
				) {
					saldoInt =
						day.default_time.duration - day.default_time.pause;
					day?.time?.forEach((timeValue: DayDataTime) => {
						if (timeValue) {
							timeValue.breaks.forEach(
								(
									breakValue: DayDataTime["breaks"][number],
									index: number
								) => {
									if (index > 0) {
										breaks += " \n";
									}
									if (breakValue) {
										breaks += `${getDateString(breakValue.start).time} - ${getDateString(breakValue.end).time}`;
									} else {
										breaks += "-";
									}
								}
							);
							saldoInt -= timeValue.duration - timeValue.pause;
						}
					});
				} else if (
					day.time &&
					day.time.length > 0 &&
					!day.default_time
				) {
					day?.time?.forEach((timeValue: DayDataTime) => {
						if (timeValue) {
							console.log({ timeValue });
							timeValue.breaks.forEach(
								(
									breakValue: DayDataTime["breaks"][number],
									index: number
								) => {
									if (index > 0) {
										breaks += " / ";
									}
									if (breakValue) {
										breaks += `${getDateString(breakValue.start).time} - ${getDateString(breakValue.end).time}`;
									}
								}
							);
							saldoInt -= timeValue.duration - timeValue.pause;
						}
					});
				} else if (day && !day.default_time) {
					start = "FREI";
				}
			}

			if (day.time && day.time.length > 0) {
				day.time.forEach((time: DayDataTime, index: number) => {
					if (time && time?.start && time?.end) {
						if (index > 0) {
							start += " \n";
						}
						start += `${getDateString(time.start).time}`;
						if (index > 0) {
							end += " \n";
						}
						end += `${getDateString(time.end).time}`;
						hoursInt += time.duration - time.pause;
					}
				});
			}
			const target = day.default_time?.duration
				? day.default_time?.duration - day.default_time?.pause
				: 0;

			return [
				getDateString(day.date).date,
				weekday ? weekday : "",
				start,
				breaks,
				end,
				hoursInt ? convertMillisecondsToString(hoursInt) : "",
				target ? convertMillisecondsToString(target) : "",
				saldoInt ? convertMillisecondsToString(-saldoInt) : ""
			];
		}),

		styles: { fontSize: 8 },
		headStyles: { fillColor: [66, 139, 202] }
	});
};

export default renderDayTable;
