import React, { useCallback, useEffect, useMemo } from "react";
import { IntervalDateSelectInterfaceProps } from "../types";
import { DateObjectWithNextDates } from "@repo/types";
import { Select, DatePicker } from "@repo/ui";
import { cloneDeep, set } from "lodash-es";
import { formatISO9075 } from "date-fns";
import "../date_select.scss";
import getDatesFromInterval from "../functions/getDatesFromInterval";

type keys = keyof DateObjectWithNextDates;

type value = DateObjectWithNextDates[keys];
type DateObjectCopy = { [key in keys]?: value };

const IntervalDateSelectInterface = ({
	date,
	category,
	onChange
}: IntervalDateSelectInterfaceProps) => {
	const dateTransformHandler = useCallback(
		(
			key:
				| "start_date"
				| "end_date"
				| "interval.number"
				| "interval.unit",
			value: string | number
		) => {
			const dateObject: DateObjectWithNextDates = {
				...date,
				dates: [],
				next_dates: []
			};
			console.log(key);
			console.log(value);
			if (key) {
				set(dateObject, key, value);
			}

			const { nextDates } = getDatesFromInterval(dateObject);

			if (typeof nextDates[0] === "string") {
				if (category === "opportunity") {
					dateObject.dates = [nextDates[0]];
					dateObject.next_dates = [
						formatISO9075(nextDates[0], { representation: "date" })
					];
				}
				if (category === "fixed") {
					dateObject.dates = [nextDates[0]];
					dateObject.next_dates = [
						formatISO9075(new Date(nextDates[0]), {
							representation: "date"
						})
					];
				}
			}

			console.log({ dateObject });

			console.log(getDatesFromInterval(dateObject));
			onChange(dateObject);
		},
		[category, date]
	);

	const intervalSelectOptions = useMemo(
		() => [
			{
				value: "days",
				label: "Tage",
				isDisabled: category === "opportunity"
			},
			{
				value: "weeks",
				label: "Wochen"
			},
			{
				value: "months",
				label: "Monate"
			}
		],
		[category]
	);

	useEffect(() => {
		if (category === "opportunity" && date.interval.unit === "days") {
			const dateObjectCopy = cloneDeep(date) as DateObjectCopy;
			dateObjectCopy.interval.unit = "weeks";
			onChange(dateObjectCopy as DateObjectWithNextDates);
		}
	}, [category, date]);

	console.log({ date });

	return (
		<div>
			<h3 style={{ color: "red" }}>Muss noch getestet werden</h3>
			{category === "opportunity" ? (
				<>
					<div className="row_container">
						<DatePicker
							defaultValue={
								date.start_date
									? formatISO9075(new Date(date.start_date), {
											representation: "date"
										})
									: ""
							}
							onChange={(value) =>
								dateTransformHandler("start_date", value)
							}
							type="week"
							label="Startwoche auswählen"
							id="week"
						/>
						<DatePicker
							defaultValue={
								date.end_date
									? formatISO9075(new Date(date.end_date), {
											representation: "date"
										})
									: ""
							}
							onChange={(value) =>
								dateTransformHandler("end_date", value)
							}
							type="week"
							label="Endwoche auswählen (optional)"
							id="week"
						/>
					</div>
				</>
			) : (
				<div className="row_container">
					<DatePicker
						defaultValue={date.start_date || ""}
						onChange={(value) =>
							dateTransformHandler("start_date", value)
						}
						type="datetime"
						label="Startzeitpunkt wählen"
						id="date"
					/>
					<DatePicker
						defaultValue={date.end_date || ""}
						onChange={(value) =>
							dateTransformHandler("end_date", value)
						}
						type="datetime"
						label="Endzeitpunkt wählen (optional)"
						id="date"
					/>
				</div>
			)}
			<div>
				<label>Intervall festlegen</label>
				<div className={"interval_container"}>
					<p>Alle</p>
					<input
						type="number"
						value={date.interval.number}
						onChange={(e) =>
							dateTransformHandler(
								"interval.number",
								Number(e.target.value)
							)
						}
						style={{ width: "54px", margin: "0 0.5px" }}
					/>
					<Select
						// label='Interval'
						options={intervalSelectOptions}
						value={date.interval.unit}
						onChange={(value) =>
							dateTransformHandler("interval.unit", value.value)
						}
						isClearable={false}
					/>
				</div>
			</div>
		</div>
	);
};

export default IntervalDateSelectInterface;
