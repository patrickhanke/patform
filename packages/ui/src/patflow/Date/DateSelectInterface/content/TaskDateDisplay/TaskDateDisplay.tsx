import { FC } from "react";
import { TaskDateDisplayProps } from "./types";
import { date_category_options, modi_options } from "../DateSelect";
import { getDateString } from "@repo/provider";

const TaskDateDisplay: FC<TaskDateDisplayProps> = ({ time }) => {
	const getCategory = (categoryValue: string) => {
		const category = date_category_options.find(
			(option) => option.value === categoryValue
		);
		if (category) {
			return category.label;
		}
		return "Unbekannt";
	};

	const getType = (typeValue: string) => {
		const type = modi_options.find((option) => option.value === typeValue);
		if (type) {
			return type.label;
		}
		return "Unbekannt";
	};

	return (
		<div className="flex col gap-md">
			<div className="horizontal_container">
				<p>
					<strong>Typ:</strong>
				</p>{" "}
				<p>{getType(time.type.value)}</p>
			</div>
			<div className="horizontal_container">
				<p>
					<strong>Kategorie:</strong>
				</p>{" "}
				<p>{getCategory(time.category.value)}</p>
			</div>
			<div className="horizontal_container">
				<p>
					<strong>Datum /Daten:</strong>
				</p>{" "}
				<div>
					{Array.isArray(time.dates) && time.dates.length > 0 ? (
						time.dates.map((date, idx) => (
							<p key={idx}>{getDateString(date).date}</p>
						))
					) : (
						<p>Keine Termine</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default TaskDateDisplay;
