/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { FC } from "react";
import modi_options from "./constants/modi_options";
import clsx from "clsx";
import DateCategories from "./components/DateCategories";
import SingleDateSelectInterface from "./components/SingleDateSelectInterface";
import MultiDateSelectInterface from "./components/MultiDateSelectInterface";
import IntervalDateSelectInterface from "./components/IntervalDateSelectInterface";
import { DateSelectProps } from "./types";
import "./date_select.scss";
import IntervalInfo from "./components/IntervalInfo";

import { DateObjectWithNextDates } from "@repo/types";
import { Select } from "@repo/ui";
import modi_options_service from "./constants/midi_options_service";

const DateSelect: FC<DateSelectProps> = ({
	date,
	setDate,
	isService = false
}) => {
	return (
		<>
			<div className={"date_select_content"}>
				<div>
					<Select
						label="Interval wählen"
						value={date.type}
						options={
							isService ? modi_options_service : modi_options
						}
						onChange={(value) => setDate({ ...date, type: value })}
					/>
					{date.type.value === "single" && (
						<div className={clsx("info_container", "margin_top")}>
							<p>
								{" "}
								Hier kann für eine Aufgabe ein individueller
								Termin festgelegt werden.{" "}
							</p>
						</div>
					)}
					{date.type.value === "multi" && (
						<div className={clsx("info_container", "margin_top")}>
							<p>
								{" "}
								Hier können indiviuelle Termine für eine Aufgabe
								festgelegt werden.{" "}
							</p>
						</div>
					)}
					{(date.type.value === "weekly" ||
						date.type.value === "monthly") && (
						<div className={clsx("info_container", "margin_top")}>
							<p>
								{" "}
								Hier können Intervalle für eine Aufgabe
								festgelegt werden{" "}
							</p>
						</div>
					)}
				</div>

				<div>
					<label>Kategorie wählen</label>
					<DateCategories
						value={date.category}
						onChange={(value) =>
							setDate({ ...date, category: value })
						}
					/>
				</div>
				<div>
					{date.type.value === "single" && (
						<SingleDateSelectInterface
							date={date}
							category={date.category.value}
							onChange={(newDate: DateObjectWithNextDates) => {
								setDate(newDate);
							}}
						/>
					)}
					{date.type.value === "multi" && (
						<MultiDateSelectInterface
							date={date}
							category={date.category.value}
							onChange={(newDate: DateObjectWithNextDates) => {
								setDate(newDate);
							}}
						/>
					)}
					{(date.type.value === "weekly" ||
						date.type.value === "monthly") && (
						<IntervalDateSelectInterface
							date={date}
							category={date.category.value}
							onChange={(newDate: DateObjectWithNextDates) =>
								setDate(newDate)
							}
						/>
					)}
					{date.type.value === "weekly" ||
						(date.type.value === "monthly" && (
							<IntervalInfo dates={date.dates} />
						))}
				</div>
			</div>
		</>
	);
};

export default DateSelect;
