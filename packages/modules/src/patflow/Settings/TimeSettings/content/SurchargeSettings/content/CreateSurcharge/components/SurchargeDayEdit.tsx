import React from "react";
import { SurchargeDayEditProps } from "../types";
import { weekdays } from "@repo/provider";
import { Divider } from "@repo/ui";

const SurchargeDayEdit: React.FC<SurchargeDayEditProps> = ({
	newSurcharge,
	holidays = [],
	surchargeChangeHandler
}) => {
	const daysArray = [...holidays, ...weekdays];
	const findDay = (day: string) =>
		daysArray.find((dayToFind) => {
			if ("objectId" in dayToFind) {
				return (
					dayToFind.objectId === day || dayToFind.former_id === day
				);
			}
			return "value" in dayToFind && dayToFind.value === day;
		});
	const dayLabel = (id: string) => {
		const selected = findDay(id);
		if (!selected) {
			return id;
		}
		if ("name" in selected && selected.name) {
			return selected.name;
		}
		if ("label" in selected) {
			return selected.label;
		}
		return id;
	};

	return (
		<>
			<div className="horizontal_container">
				<label htmlFor="value">Wert</label>
				<input
					type="number"
					id="value"
					defaultValue={newSurcharge.data.value}
					onChange={(e) =>
						surchargeChangeHandler(
							"data.value",
							Number(e.target.value)
						)
					}
				/>
			</div>
			<div className="create_surcharge_container">
				<Divider text="Ausgewählte Tage" />
				{newSurcharge.data.day_value.length > 0 ? (
					newSurcharge.data.day_value.map((id) => (
						<p key={id}> - {dayLabel(id)}</p>
					))
				) : (
					<p>Noch keine Tage ausgewählt</p>
				)}
			</div>
		</>
	);
};

export default SurchargeDayEdit;
