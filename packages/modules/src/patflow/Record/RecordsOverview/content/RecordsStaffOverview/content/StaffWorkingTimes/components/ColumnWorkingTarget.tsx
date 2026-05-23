import { useMemo } from "react";
import { convertMillisecondsToString } from "@repo/provider";
import { DayData } from "../types";

const ColumnWorkingTarget = ({
	isWorkingDay,
	date
}: {
	isWorkingDay: boolean;
	date: DayData;
}) => {
	console.log({ date });
	const target = useMemo(() => {
		if (
			isWorkingDay &&
			date?.default_time?.duration &&
			date?.default_time?.pause
		) {
			return date.default_time?.duration - date.default_time?.pause;
		}

		return 0;
	}, [date]);

	if (!isWorkingDay) {
		return null;
	}

	return <div>{convertMillisecondsToString(target || 0)}</div>;
};

export default ColumnWorkingTarget;
