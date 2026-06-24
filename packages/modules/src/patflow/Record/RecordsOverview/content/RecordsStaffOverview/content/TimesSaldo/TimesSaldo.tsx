import { FC, useCallback, useMemo } from "react";
import { getMonthData } from "@repo/provider";
import { MonthData, TimesSaldoProps } from "./types";

const TimesSaldo: FC<TimesSaldoProps> = ({ days, month, year, records }) => {
	const monthData = useMemo(() => {
		return getMonthData({
			days,
			year,
			records,
			month
		});
	}, [days, year, records, month]);

	const findMonthData: () => MonthData | null = useCallback(() => {
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
					<p>{findMonthData()?.previousMonthSaldo ?? "-"}</p>
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
					<p>{findMonthData()?.runningSaldo ?? "-"}</p>
				</div>
			</div>
		</div>
	);
};

export default TimesSaldo;
