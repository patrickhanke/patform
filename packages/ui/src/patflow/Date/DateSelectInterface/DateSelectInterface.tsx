"use client";

import { FC, useCallback, useEffect, useState } from "react";
import DateSelect from "./content/DateSelect";
import { useDataHandler } from "@repo/provider";
import modi_options from "./content/DateSelect/constants/modi_options";
import date_category_options from "./content/DateSelect/constants/date_category_options";
import { DateSelectInterfaceProps } from "./types";
import { formatISO9075 } from "date-fns";
import { isArray } from "lodash-es";
import { DateInterval, ErrorMessage } from "@repo/types";
import { SlideIn } from "@repo/ui";
import { TaskDateDisplay } from "./content/TaskDateDisplay";
import { useImmer } from "use-immer";

const DateSelectInterface: FC<DateSelectInterfaceProps> = (props) => {
	const { task, isService = false, tasksRefetch, setExternalDate } = props;
	const { updateData } = useDataHandler();
	const [loading, setLoading] = useState(false);

	const [errors, setErrors] = useState<ErrorMessage[]>([]);

	const initialTime = {
		type: modi_options[0] as DateInterval,
		category: date_category_options[0],
		interval: {
			number: 1,
			unit: "weeks"
		},
		start_date: "",
		end_date: "",
		dates: [""],
		weekday: "",
		time: ""
	};

	const taskData = task;

	const [date, setDate] = useImmer(taskData?.time || initialTime);

	const dataHandler = useCallback(async () => {
		const timeValueCopy = { ...date };

		const next_dates: string[] = [];
		timeValueCopy.dates.forEach((dateString: string) => {
			const isodate = formatISO9075(new Date(dateString), {
				representation: "date"
			});
			if (!next_dates.includes(isodate)) {
				next_dates.push(isodate);
			}
		});

		setLoading(true);
		await updateData({
			className: "Task",
			objectId: taskData.objectId,
			updateObject: {
				type: date.type.value,
				category: date.category.value,
				dates: next_dates,
				time: date
			}
		});
		if (tasksRefetch) {
			tasksRefetch();
		}
		setLoading(false);
		if (!props.isInline) {
			props.setShowDateInterface(false);
		}
	}, [taskData?.objectId]);

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

		if (isArray(date.dates)) {
			const now = new Date();
			const invalidDates = date.dates.filter(
				(d: string) => d && new Date(d) < now
			);
			if (invalidDates.length > 0) {
				errorArray.push({
					message: "Bitte nur zukünftige Daten angeben",
					key: "date",
					id: "date_future"
				});
			}
		}

		setErrors(errorArray);
	}, [date]);

	const state = taskData?.state || undefined;

	useEffect(() => {
		if (setExternalDate) {
			setExternalDate(date);
		}
	}, [date]);

	if (props.isInline) {
		return (
			<DateSelect date={date} isService={isService} setDate={setDate} />
		);
	}

	const { showDateInterface, setShowDateInterface } = props;

	return (
		<SlideIn
			isOpen={showDateInterface}
			cancel={() => setShowDateInterface(false)}
			confirm={() => dataHandler()}
			header="Zeiten bearbeiten"
			size="small"
			preventClickOutside={state && state === "assigned" ? true : false}
			errors={errors}
			loading={loading}
		>
			{state &&
			(state === "assigned" ||
				state === "created" ||
				state === "executed") ? (
				<DateSelect
					date={date}
					isService={isService}
					setDate={setDate}
				/>
			) : (
				<TaskDateDisplay time={taskData?.time || initialTime} />
			)}
		</SlideIn>
	);
};

export default DateSelectInterface;
