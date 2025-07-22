import { useMemo } from "react";
import { convertMillisecondsToString } from "@repo/provider";
import { DayData } from "../types";

const ColumnWorkingSaldo = ({
	type,
	date
}: {
	type: DayData["type"];
	date: DayData;
}) => {
	const saldo = useMemo(() => {
		let saldoInt = 0;
		if (
			date &&
			date.default_time &&
			date.default_time.duration &&
			date.default_time.pause
		) {
			saldoInt = date.default_time.duration - date.default_time.pause;
			date?.time?.forEach((timeValue) => {
				if (timeValue) {
					saldoInt -= timeValue.duration - timeValue.pause;
				}
			});
		} else if (date) {
			date?.time?.forEach((timeValue) => {
				if (timeValue) {
					saldoInt -= timeValue.duration - timeValue.pause;
				}
			});
		}

		return -saldoInt;
	}, [date]);

	if (type === "work" && date.time) {
		return (
			<div>
				<span>{convertMillisecondsToString(saldo)}</span>
			</div>
		);
	}
	return null;
};

export default ColumnWorkingSaldo;
