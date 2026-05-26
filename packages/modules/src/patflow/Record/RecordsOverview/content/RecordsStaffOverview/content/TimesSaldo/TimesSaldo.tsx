import { FC, useCallback, useMemo } from "react";
import { convertMillisecondsToString, getMonthData } from "@repo/provider";
import { MonthData, TimesSaldoProps } from "./types";
import getMonthsSaldo from "./functions/getMonthsSaldo";

const TimesSaldo: FC<TimesSaldoProps> = ({ days, month, year, records }) => {
	const monthData = useMemo(() => {
		return getMonthData({
			days,
			year,
			records,
			month
		});
	}, [days, year, records]);

	console.log({ monthData });

	const findMonthData: () => MonthData | null = useCallback(() => {
		const monthToFind = monthData.find((m) => m.id === month.id);
		console.log({ monthToFind });
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
					<p>{findMonthData()?.target}</p>
				</div>
				<div className="horizontal_container">
					<label>Arbeitszeit</label>
					<p>{findMonthData()?.monthTimes}</p>
				</div>
				<div className="horizontal_container">
					<label>Saldo</label>
					<p>{findMonthData()?.monthSaldo}</p>
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
