import { FC, useMemo, useState } from "react";
import { GET_TASK_TIME, getDateString } from "@repo/provider";
import { DateSelectInterfaceTask, Loader, StateDisplay } from "@repo/ui";
import { formatISO9075 } from "date-fns";
import { getISOWeek, startOfISOWeek, endOfISOWeek } from "date-fns";
import { Task } from "@repo/types";
import { useQuery } from "@apollo/client";

const TaskDate: FC<TaskDateProps> = ({
	taskId,
	tasksRefetch,
	isEditable = true
}) => {
	const [showInterface, setShowInterface] = useState(false);
	const { data } = useQuery(GET_TASK_TIME, {
		variables: { id: taskId }
	});
	const nextDate = useMemo(() => {
		let value = "Kein Termin";
		let is_overdue = false;
		let allDates = [];
		let color = "light";

		if (data) {
			const task = data.objects.getTask;
			if (
				task.dates.length > 0 &&
				(task.state === "assigned" || task.state === "created")
			) {
				const datesCopy = [...data.objects.getTask.dates];
				allDates = datesCopy;
				const timeCopy: Task["time"] = { ...data.objects.getTask.time };
				const date = timeCopy.dates?.find(
					(dateToFind: string) =>
						formatISO9075(dateToFind, {
							representation: "date"
						}) === datesCopy[0]
				);
				if (date) {
					if (new Date(date).getTime() < new Date().getTime()) {
						is_overdue = true;
					}
					if (timeCopy.category.value === "fixed") {
						if (date.length > 10) {
							value = `${getDateString(date).date} - ${getDateString(date).time} - D`;
						} else {
							value = `${getDateString(date).date} - D`;
						}
					}
					if (timeCopy.category.value === "opportunity") {
						const weekDate = new Date(date);
						const week = getISOWeek(weekDate);
						const firstDay = startOfISOWeek(weekDate);
						const lastDay = endOfISOWeek(weekDate);
						const firstDayStr = `${firstDay.getDate().toString().padStart(2, "0")}.${(firstDay.getMonth() + 1).toString().padStart(2, "0")}`;
						const lastDayStr = `${lastDay.getDate().toString().padStart(2, "0")}.${(lastDay.getMonth() + 1).toString().padStart(2, "0")}`;
						value = `KW ${week} (${firstDayStr} - ${lastDayStr}) - T`;
					}
					if (timeCopy.category.value === "interval") {
						color = "yellow";
					}
					if (
						timeCopy.category.value === "fixed" &&
						new Date(date).getTime() < new Date().getTime()
					) {
						color = "red";
					}
					if (timeCopy.category.value === "opportunity") {
						color = "blue";
					}
				}
			} else if (
				task.state === "executed" ||
				task.state === "completed" ||
				task.state === "archived"
			) {
				const timeCopy: Task["time"] = { ...data.objects.getTask.time };
				if (timeCopy.dates.length > 0) {
					const date = timeCopy.dates[timeCopy.dates.length - 1];

					if (date) {
						if (timeCopy.category.value === "fixed") {
							if (date.length > 10) {
								value = `${getDateString(date).date} - ${getDateString(date).time} - D`;
							} else {
								value = `${getDateString(date).date} - D`;
							}
						}
						if (timeCopy.category.value === "opportunity") {
							const weekDate = new Date(date);
							const week = getISOWeek(weekDate);
							const firstDay = startOfISOWeek(weekDate);
							const lastDay = endOfISOWeek(weekDate);
							const firstDayStr = `${firstDay.getDate().toString().padStart(2, "0")}.${(firstDay.getMonth() + 1).toString().padStart(2, "0")}`;
							const lastDayStr = `${lastDay.getDate().toString().padStart(2, "0")}.${(lastDay.getMonth() + 1).toString().padStart(2, "0")}`;
							value = `KW ${week} (${firstDayStr} - ${lastDayStr}) - T`;
						}
						if (timeCopy.category.value === "interval") {
							color = "green";
						}
						if (
							timeCopy.category.value === "fixed" &&
							new Date(date).getTime() < new Date().getTime()
						) {
							color = "green";
						}
						if (timeCopy.category.value === "opportunity") {
							color = "green";
						}
						// value = `${getDateString(date).date} - ${getDateString(date).time} - D`;
					}
				} else {
					value = "Aufgabe erledigt";
				}
			} else {
				value = "Kein Termin";
			}
		}

		return {
			allDates,
			value,
			is_overdue,
			color
		};
	}, [data]);

	if (data) {
		const task = data.objects.getTask;
		const taskIsEditable =
			task.state === "assigned" || task.state === "created";

		return (
			<>
				<div
					onClick={() => {
						if (!isEditable || !taskIsEditable) return;
						setShowInterface(!showInterface);
					}}
					style={{
						cursor: isEditable ? "pointer" : "default"
					}}
				>
					<StateDisplay
						label={nextDate.value}
						color={nextDate.color}
						icon="clock"
					/>
				</div>

				<DateSelectInterfaceTask
					taskId={taskId}
					showDateInterface={showInterface}
					setShowDateInterface={setShowInterface}
					tasksRefetch={tasksRefetch}
				/>
			</>
		);
	}

	return <Loader width="0px" height="18px" />;
};

export default TaskDate;
