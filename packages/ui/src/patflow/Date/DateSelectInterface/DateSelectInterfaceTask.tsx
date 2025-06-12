"use client";

import React, { useCallback, useEffect, useState } from "react";
import DateSelect from "./content/DateSelect";
import { useDataHandler } from "@repo/provider";
import { useQuery } from "@apollo/client";
import { GET_TASK_TIME } from "@repo/provider";
import modi_options from "./content/DateSelect/constants/modi_options";
import date_category_options from "./content/DateSelect/constants/date_category_options";
import { DateSelectInterfaceTaskProps } from "./types";
import { formatISO9075 } from "date-fns";
import { DateInterval, DateObjectWithNextDates, Task } from "@repo/types";
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
	const [state, setState] = useState<Task["state"] | undefined>();

	const [time, setTime] = useState<Task["time"]>({
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
	});

	const { loading: queryLoading, refetch } = useQuery(GET_TASK_TIME, {
		variables: { id: taskId },
		onCompleted(data) {
			setTime(data.objects.getTask.time);
			setState(data.objects.getTask.state);
		},
		notifyOnNetworkStatusChange: true
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
		[taskId, time]
	);

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
					initialValue={time}
					dataHandler={dataHandler}
					setShowSlideIn={setShowDateInterface}
					loading={loading || queryLoading}
				/>
			) : (
				<TaskDateDisplay time={time} />
			)}
		</SlideInRight>
	);
};

export default DateSelectInterfaceTask;
