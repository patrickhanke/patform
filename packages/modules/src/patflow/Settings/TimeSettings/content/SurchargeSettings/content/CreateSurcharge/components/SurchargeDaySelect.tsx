import React, { useCallback } from "react";
import { SurchargeDaySelectProps } from "../types";
import "../CreateSurcharge.scss";
import { surchargeIncludesHoliday, weekdays } from "@repo/provider";

const SurchargeDaySelect: React.FC<SurchargeDaySelectProps> = ({
	surchargeChangeHandler,
	newSurcharge,
	holidays = []
}) => {
	const dayChangeHandler = useCallback(
		(day: string, formerId?: string) => {
			if (
				newSurcharge.data.day_value.includes(day) ||
				(formerId && newSurcharge.data.day_value.includes(formerId))
			) {
				surchargeChangeHandler(
					"data.day_value",
					newSurcharge.data.day_value.filter(
						(dayToFind) => dayToFind !== day && dayToFind !== formerId
					)
				);
			} else {
				surchargeChangeHandler("data.day_value", [
					...newSurcharge.data.day_value,
					day
				]);
			}
		},
		[newSurcharge, surchargeChangeHandler]
	);

	return (
		<div className="create_surcharge_container">
			<h3>Feiertage</h3>
			{holidays.map((day) => (
				<button
					onClick={() => dayChangeHandler(day.objectId, day.former_id)}
					className="day_select_container"
					data-isselected={surchargeIncludesHoliday(
						newSurcharge.data.day_value,
						day
					)}
					key={day.objectId}
				>
					<span>{day.name}</span>
				</button>
			))}
			<h3>Wochentage</h3>
			{weekdays.map((day) => (
				<button
					onClick={() => dayChangeHandler(day.value)}
					className="day_select_container"
					data-isselected={
						newSurcharge.data.day_value.findIndex(
							(dayToFind) => dayToFind === day.value
						) !== -1
					}
					key={day.value}
				>
					{day.label}
				</button>
			))}
		</div>
	);
};

export default SurchargeDaySelect;

