import { FC } from "react";
import { AbsenceDayProps, IntervalDay } from "../types";
import { StateDisplay } from "@repo/ui";
import { weekdays } from "@repo/provider";
import { getDay } from "date-fns";

const AbsenceDay: FC<AbsenceDayProps> = ({ days, overlap, startAfterEnd }) => {
	const getWeekday = (date: string) => {
		return weekdays.find(
			(weekday) => weekday.day === getDay(new Date(date))
		);
	};

	const getStateLabel = (state: IntervalDay["state"]) => {
		if (state === "keep") {
			return "Ungeändert";
		}
		if (state === "change") {
			return "Ändern";
		}
		if (state === "create") {
			return "Erstellen";
		}
		if (state === "delete") {
			return "Löschen";
		}
		return undefined;
	};

	const getStateColor = (state: IntervalDay["state"]) => {
		if (state === "change") {
			return "yellow";
		}
		if (state === "create") {
			return "green";
		}
		if (state === "delete") {
			return "red";
		}
		return "gray";
	};

	if (startAfterEnd) {
		return <div className="error">Startzeit muss vor Endzeit liegen</div>;
	}

	return (
		<>
			<table>
				<thead>
					<tr>
						<th>Tag</th>
						<th>Datum</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{days.map((day) => (
						<tr
							key={day.date}
							style={{ opacity: !day.state ? 0.3 : 1 }}
						>
							<td>{getWeekday(day.date)?.short}</td>
							<td>{day.date}</td>
							<td className="button_container">
								{getStateLabel(day.state) && (
									<StateDisplay
										label={getStateLabel(day.state) || ""}
										color={getStateColor(day.state)}
									/>
								)}
								{overlap.includes(day.date) && (
									<StateDisplay
										label="Überschneidung"
										color="orange"
									/>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
};

export default AbsenceDay;
