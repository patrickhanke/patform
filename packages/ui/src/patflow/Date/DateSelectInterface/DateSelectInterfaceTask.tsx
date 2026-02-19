"use client";

import { useCallback, useEffect, useState } from "react";
import DateSelect from "./content/DateSelect";
import { useDataHandler, useGetData } from "@repo/provider";
import modi_options from "./content/DateSelect/constants/modi_options";
import date_category_options from "./content/DateSelect/constants/date_category_options";
import { DateSelectInterfaceTaskProps } from "./types";
import { formatISO9075 } from "date-fns";
import { DateInterval, DateObjectWithNextDates } from "@repo/types";
import { SlideInRight } from "@repo/ui";
import { TaskDateDisplay } from "./content/TaskDateDisplay";

const DateSelectInterfaceTask = ({
	taskId,
	showDateInterface,
	setShowDateInterface,
	tasksRefetch
}: DateSelectInterfaceTaskProps) => {
	const { updateData } = useDataHandler();
	const [loading, setLoading] = useState(false);

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

	const {
		data: taskData,
		loading: queryLoading,
		refetch
	} = useGetData({
		objectName: "Task",
		fields: ["objectId", "time", "state", "dates", "type", "category"],
		id: taskId
	});

	useEffect(() => {
		refetch();
	}, [showDateInterface]);

	const dataHandler = useCallback(
		async (timeValue: DateObjectWithNextDates) => {
			const timeValueCopy = { ...timeValue };

			const next_dates: string[] = [];

			timeValueCopy.dates.forEach((date: string) => {
				const isodate = formatISO9075(new Date(date), {
					representation: "date"
				});
				if (
					!next_dates.includes(isodate) &&
					new Date(date).getTime() > new Date().getTime()
				) {
					next_dates.push(isodate);
				}
			});

			setLoading(true);
			await updateData({
				className: "Task",
				objectId: taskId,
				updateObject: {
					type: timeValue.type.value,
					category: timeValue.category.value,
					dates: next_dates,
					time: timeValue
				}
			});
			if (tasksRefetch) {
				tasksRefetch();
			}
			setLoading(false);
			setShowDateInterface(false);
		},
		[taskId]
	);

	const state = taskData?.state || undefined;

	return (
		<SlideInRight
			isOpen={showDateInterface}
			setIsOpen={setShowDateInterface}
			header="Zeiten bearbeiten"
			size="small"
			preventClickOutside={state && state === "assigned" ? true : false}
		>
			{state && state === "assigned" ? (
				<DateSelect
					initialValue={taskData?.time || initialTime}
					dataHandler={dataHandler}
					setShowSlideIn={setShowDateInterface}
					loading={loading || queryLoading}
				/>
			) : (
				<TaskDateDisplay time={taskData?.time || initialTime} />
			)}
		</SlideInRight>
	);
};

export default DateSelectInterfaceTask;
