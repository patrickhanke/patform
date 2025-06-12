"use client";

import React, { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import modi_options from "./constants/modi_options";
import clsx from "clsx";
import DateCategories from "./components/DateCategories";
import date_category_options from "./constants/date_category_options";
import SingleDateSelectInterface from "./components/SingleDateSelectInterface";
import MultiDateSelectInterface from "./components/MultiDateSelectInterface";
import IntervalDateSelectInterface from "./components/IntervalDateSelectInterface";
import { DateSelectProps } from "./types";
import styles from "./DateSelect.module.scss";
import IntervalInfo from "./components/IntervalInfo";
import { formatISO9075 } from "date-fns";
import { isArray } from "lodash-es";
import { DateObjectWithNextDates, ErrorMessage } from "@repo/types";
import { ErrorDisplay, Select } from "@repo/ui";

const DateSelect = ({
	initialValue,
	dataHandler,
	setShowSlideIn,
	loading
}: DateSelectProps) => {
	const initialDate = {
		type: initialValue?.type || modi_options[0],
		category: initialValue?.category || date_category_options[0],
		interval: initialValue?.interval || 1,
		start_date: initialValue?.start_date || "",
		end_date: initialValue?.end_date || "",
		dates: initialValue?.dates || [""],
		weekday: initialValue?.weekday || undefined,
		time: initialValue?.time || undefined
	} as DateObjectWithNextDates;

	const [date, setDate] = useImmer(initialDate as DateObjectWithNextDates);
	const [errors, setErrors] = useState<ErrorMessage[]>([]);

	useEffect(() => {
		const errorArray: ErrorMessage[] = [];
		if (date.type.value === "single") {
			if (!date.dates[0]) {
				errorArray.push({
					message: "Bitte ein Datum angeben",
					key: "date",
					id: "date"
				});
			}
		}
		if (date.type.value === "multi") {
			if (!date.dates[0]) {
				errorArray.push({
					message: "Bitte mindestens ein Datum angeben",
					key: "date",
					id: "date"
				});
			}
		}
		if (date.type.value === "weekly" || date.type.value === "monthly") {
			if (!date.start_date) {
				errorArray.push({
					message: "Bitte eine Startwoche angeben",
					key: "start_date",
					id: "start_date"
				});
			}
		}
		function hasDuplicates(array: string[]) {
			const valuesSoFar = [];
			for (let i = 0; i < array.length; i += 1) {
				if (array[i] && array[i] !== "") {
					const value = formatISO9075(new Date(array[i] as string), {
						representation: "date"
					});
					if (valuesSoFar.indexOf(value) !== -1) {
						return true;
					}
					valuesSoFar.push(value);
				}
			}
			return false;
		}
		if (isArray(date.dates) && hasDuplicates(date.dates)) {
			errorArray.push({
				message: "Bitte keine doppelten Daten angeben",
				key: "date",
				id: "date"
			});
		}

		setErrors(errorArray);
	}, [date]);

	return (
		<>
			<div className={styles.date_select_content}>
				<div>
					<Select
						label="Interval wählen"
						value={date.type}
						options={modi_options}
						onChange={(value) =>
							setDate((draft) => {
								draft.type = value;
							})
						}
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
						date={date.category}
						onChange={(value) =>
							setDate((draft) => {
								draft.category = value;
							})
						}
					/>
				</div>
				<div>
					{date.type.value === "single" && (
						<SingleDateSelectInterface
							date={date}
							category={date.category.value}
							onChange={(newDate: DateObjectWithNextDates) =>
								setDate(newDate)
							}
						/>
					)}
					{date.type.value === "multi" && (
						<MultiDateSelectInterface
							date={date}
							category={date.category.value}
							onChange={(newDate: DateObjectWithNextDates) =>
								setDate(newDate)
							}
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
			<div className={clsx("slidein_footer", styles.footer)}>
				<ErrorDisplay errors={errors} />
				<div className="button_container">
					<button
						className={clsx("full_button", "primary", "md")}
						onClick={() => dataHandler(date)}
						disabled={errors.length > 0 || loading}
					>
						Speichern
					</button>
					<button
						className={clsx("full_button", "light", "md")}
						onClick={() => setShowSlideIn(false)}
						disabled={loading}
					>
						Abbrechen
					</button>
				</div>
			</div>
		</>
	);
};

export default DateSelect;
