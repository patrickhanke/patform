import { useMemo } from "react";
import { convertMillisecondsToString } from "@repo/provider";
import { DayData } from "../types";

const ColumnWorkingSaldo = ({ date }: { date: DayData }) => {
	const saldo = useMemo(() => {
		const defaultTimeSpan =
			(date.default_time?.duration || 0) -
			(date.default_time?.pause || 0);

		if (date.times.length === 0 && date.is_working_day) {
			return -defaultTimeSpan;
		}
		return date?.times?.reduce((acc, time) => {
			return acc + time.saldo;
		}, 0);
	}, [date]);

	if (date.is_working_day || saldo !== 0) {
		return (
			<div>
				<span>{convertMillisecondsToString(saldo)}</span>
			</div>
		);
	}
	return null;
};

export default ColumnWorkingSaldo;
