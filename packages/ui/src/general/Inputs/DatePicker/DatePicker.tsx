"use client";

import { FC, useCallback, useEffect, useState } from "react";
import { DatePickerProps } from "./types";
import { useDebounceValue } from "usehooks-ts";
import { formatISO9075, startOfWeek } from "date-fns";
import transformWeekValue from "./functions/transformWeekValue";
import getDateFromWeek from "./functions/getDateFromWeek";

const supportsWeekInput = (): boolean => {
	if (typeof document === "undefined") return false;
	const input = document.createElement("input");
	input.setAttribute("type", "week");
	return input.type === "week";
};

const DatePicker: FC<DatePickerProps> = ({
	defaultValue,
	onChange,
	type,
	label,
	id,
	disabled = false,
	width = 180,
	min,
	max
}) => {
	const [debouncedValue, setDateValue] = useDebounceValue(
		defaultValue || "",
		500
	);
	const [weekInputSupported] = useState(supportsWeekInput);

	useEffect(() => {
		if (debouncedValue !== defaultValue) {
			onChange(debouncedValue);
		}
	}, [debouncedValue]);

	const timeChangeHandler = useCallback(
		(type: "date" | "time", value: string) => {
			if (type === "date") {
				return value.split("T")[1]
					? setDateValue(`${value}T${debouncedValue.split("T")[1]}`)
					: setDateValue(value);
			}
			if (type === "time") {
				return value.length === 5
					? setDateValue(`${debouncedValue.split("T")[0]}T${value}`)
					: setDateValue(`${debouncedValue.split("T")[0]}`);
			}
		},
		[debouncedValue]
	);

	useEffect(() => {
		setDateValue(defaultValue);
	}, [defaultValue]);

	return (
		<>
			{label && <label htmlFor={id}>{label}</label>}
			{type === "time" && (
				<input
					aria-label="Time"
					id={id}
					name={id}
					type={type}
					style={{ width }}
					onChange={(e) => setDateValue(e.target.value)}
					defaultValue={defaultValue}
					step={undefined}
					disabled={disabled}
				/>
			)}
			{type === "week" &&
				(weekInputSupported ? (
					<input
						aria-label="Date"
						id={id}
						name={id}
						type={type}
						style={{ width }}
						onChange={(e) => {
							if (e.target.value) {
								const year = Number(
									e.target.value.split("-W")[0]
								);
								const week = Number(
									e.target.value.split("-W")[1]
								);
								setDateValue(
									formatISO9075(
										getDateFromWeek(week, 0, year),
										{
											representation: "date"
										}
									)
								);
							} else {
								setDateValue("");
							}
						}}
						defaultValue={transformWeekValue(defaultValue)}
						step={undefined}
						disabled={disabled}
					/>
				) : (
					<input
						aria-label="Date"
						id={id}
						name={id}
						type="date"
						style={{ width }}
						onChange={(e) => {
							if (e.target.value) {
								const monday = startOfWeek(
									new Date(e.target.value),
									{
										weekStartsOn: 1
									}
								);
								setDateValue(
									formatISO9075(monday, {
										representation: "date"
									})
								);
							} else {
								setDateValue("");
							}
						}}
						defaultValue={defaultValue}
						step={undefined}
						disabled={disabled}
					/>
				))}
			{type === "date" && (
				<input
					aria-label="Date"
					id={id}
					name={id}
					type={"date"}
					style={{ width }}
					onChange={(e) => setDateValue(e.target.value)}
					defaultValue={defaultValue}
					step={undefined}
					disabled={disabled}
				/>
			)}
			{type === "datetime-local" && (
				<>
					<input
						aria-label="Date"
						id={id}
						name={id}
						type={"datetime-local"}
						style={{ width }}
						onChange={(e) => setDateValue(e.target.value)}
						defaultValue={defaultValue}
						step={undefined}
						disabled={disabled}
						min={min}
						max={max}
					/>
				</>
			)}
			{type === "datetime" && (
				<div className="flex col">
					<label htmlFor={id}>
						Datum <br />
						<input
							aria-label="Date"
							id={id}
							name={id}
							type={"date"}
							style={{ width: 110 }}
							onChange={(e) =>
								timeChangeHandler("date", e.target.value)
							}
							defaultValue={
								defaultValue.length > 10
									? defaultValue.split("T")[0]
									: defaultValue
							}
							step={undefined}
							disabled={disabled}
							min={min}
							max={max}
						/>
					</label>
					<label htmlFor={id}>
						Uhrzeit <br />
						<input
							aria-label="Time"
							id={id}
							name={id}
							type={"time"}
							style={{ width: 80 }}
							onChange={(e) =>
								timeChangeHandler("time", e.target.value)
							}
							defaultValue={
								defaultValue.length > 10
									? defaultValue.split("T")[1]
									: ""
							}
							step={undefined}
							disabled={isNaN(new Date(debouncedValue).getTime())}
						/>
					</label>
				</div>
			)}
		</>
	);
};

export default DatePicker;
