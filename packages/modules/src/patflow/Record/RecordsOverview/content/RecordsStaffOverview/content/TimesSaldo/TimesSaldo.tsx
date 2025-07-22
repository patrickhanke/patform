import { FC, useCallback, useMemo } from "react";
import {
	convertMillisecondsToString,
	createDateIntervalForMonth,
	findDefaultTimeForDate,
	months
} from "@repo/provider";
import { MonthData, TimesSaldoProps } from "./types";
import { Day } from "@repo/types";
import getMonthsSaldo from "./functions/getMonthsSaldo";

const TimesSaldo: FC<TimesSaldoProps> = ({ days, month, year, records }) => {
	const monthData = useMemo(() => {
		const dataArray: MonthData[] = [];
		let totalSaldo = 0;
		let totalTarget = 0;
		let totalTimes = 0;
		if (!days && records.length === 0) {
			return dataArray;
		}

		months.forEach((month) => {
			const dateInterval = createDateIntervalForMonth(year, month.id);
			let target = 0;
			let monthTimes = 0;
			const record_default_times = dateInterval.map((dateElement) =>
				findDefaultTimeForDate(dateElement, records)
			);
			record_default_times.forEach((element) => {
				let default_time = 0;
				if (element.default_time?.type === "regular") {
					default_time =
						element.default_time?.duration -
						element.default_time?.pause;
				}
				target += default_time;
			});
			if (days && records) {
				dateInterval.forEach((dayString) => {
					const dayArray = days.filter(
						(dayToFind: Day) => dayToFind.date === dayString
					);

					if (dayArray.length > 1) {
						dayArray.forEach((day: Day) => {
							if (day && day.type === "work") {
								const time = day.time;
								const timeSpan = time.duration - time.pause;
								monthTimes += timeSpan || 0;
							}
						});
					} else if (dayArray.length === 1) {
						const day = dayArray[0];
						if (day && day.type === "work") {
							const time = day.time;
							const timeSpan = time.duration - time.pause;
							monthTimes += timeSpan || 0;
						} else if (day && day.type === "absence") {
							if (day.is_working_day) {
								monthTimes += day.default_time
									? day.default_time.duration -
										day.default_time.pause
									: 0;
							}
						}
					}
				});
			}
			totalSaldo += monthTimes - target;
			totalTarget += target;
			totalTimes += monthTimes;
			dataArray.push({
				id: month.id,
				month: month.label,
				monthSaldoInt: monthTimes - target,
				monthSaldo: convertMillisecondsToString(monthTimes - target),
				target: convertMillisecondsToString(target),
				monthTimes: convertMillisecondsToString(monthTimes)
			});
		});

		dataArray.push({
			id: month.id,
			month: "Gesamt",
			monthSaldoInt: totalSaldo,
			monthSaldo: convertMillisecondsToString(totalSaldo),
			target: convertMillisecondsToString(totalTarget),
			monthTimes: convertMillisecondsToString(totalTimes)
		});

		return dataArray;
	}, [days, year, records]);

	const getMonthData: () => MonthData | null = useCallback(() => {
		const monthToFind = monthData.find((m) => m.id === month.id);
		if (monthToFind) {
			return monthToFind;
		}
		return null;
	}, [month, monthData]);

	return (
		<div>
			<h3>
				Zeitübersicht {month.label} {year.toString()}{" "}
			</h3>
			<div className="content_element">
				<div className="horizontal_container">
					<label>Saldo Vormonat</label>
					<p>
						{convertMillisecondsToString(
							getMonthsSaldo(0, month.id - 1, monthData)
						)}
					</p>
				</div>
				<div className="horizontal_container">
					<label>Sollzeit</label>
					<p>{getMonthData()?.target}</p>
				</div>
				<div className="horizontal_container">
					<label>Arbeitszeit</label>
					<p>{getMonthData()?.monthTimes}</p>
				</div>
				<div className="horizontal_container">
					<label>Saldo</label>
					<p>{getMonthData()?.monthSaldo}</p>
				</div>
				<div className="horizontal_container">
					<label>Zeitkonto</label>
					<p>
						{convertMillisecondsToString(
							getMonthsSaldo(0, month.id, monthData)
						)}
					</p>
				</div>
			</div>
		</div>
	);
};

export default TimesSaldo;
