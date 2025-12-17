import { TaskSection } from "../types";
import {
	addWeeks,
	addYears,
	endOfWeek,
	endOfYear,
	formatISO9075,
	startOfWeek
} from "date-fns";
import { Task } from "@repo/types";

const getInitialTaskSections = () => {
	const today = new Date();

	const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 });
	const endOfThisWeek = endOfWeek(today, { weekStartsOn: 1 });
	const startOfNextWeek = startOfWeek(addWeeks(today, 1), {
		weekStartsOn: 1
	});
	const endOfLastWeek = endOfWeek(addWeeks(today, -1), { weekStartsOn: 1 });
	const endOfNextYear = endOfYear(addYears(today, 1));

	return [
		{
			label: "Diese Woche",
			value: "this_week",
			date: formatISO9075(startOfThisWeek, { representation: "date" }),
			data: [],
			start: startOfThisWeek.getTime(),
			end: endOfThisWeek.getTime()
		},
		{
			label: "Ab nächster Woche",
			value: "next_week",
			date: formatISO9075(startOfNextWeek, { representation: "date" }),
			data: [],
			start: startOfNextWeek.getTime(),
			end: endOfNextYear.getTime()
		},
		{
			label: "Überfällig",
			value: "overdue",
			date: formatISO9075(endOfLastWeek, { representation: "date" }),
			data: [],
			start: new Date(2010, 1, 1).getTime(),
			end: endOfLastWeek.getTime()
		},
		{
			label: "Keine Zeitangabe",
			value: "no_date",
			date: "",
			data: [],
			start: NaN,
			end: NaN
		}
	] as TaskSection;
};

const sortTasksForList: (array: Array<Task>) => TaskSection = (
	array: Array<Task>
) => {
	const taskList: TaskSection = getInitialTaskSections();

	console.log({ taskList });
	const arrayCopy = [...array];

	const sortedArray: Task[] = arrayCopy.sort((a, b) => {
		if (a.dates.length === 0) {
			return 1;
		}
		if (b.dates.length === 0) {
			return -1;
		}
		if (
			a.dates[0] &&
			b.dates[0] &&
			new Date(a.dates[0]).getTime() > new Date(b.dates[0]).getTime()
		) {
			return 1;
		}
		if (
			a.dates[0] &&
			b.dates[0] &&
			new Date(a.dates[0]).getTime() < new Date(b.dates[0]).getTime()
		) {
			return -1;
		}
		return 0;
	});

	for (let i = 0; i < sortedArray.length; i += 1) {
		const task: Task | undefined = sortedArray[i];

		if (task) {
			if (task.dates.length > 0) {
				task.dates.forEach((arrayDate: string) => {
					const date = new Date(arrayDate).getTime();

					const taskSection = taskList.find((taskSection) => {
						return (
							date >= taskSection.start && date <= taskSection.end
						);
					});

					if (taskSection) {
						taskSection.data.push(task);
					}
				});
			}
			// else if (task.state === "created") {
			// 	const taskWidthId = {
			// 		...task,
			// 		id: `${task.objectId}`
			// 	};

			// 	const taskListIndex = taskList.findIndex(
			// 		(taskListElement) =>
			// 			taskListElement.label === "Keine Zeitangabe"
			// 	);
			// 	if (taskListIndex === -1) {
			// 		taskList.push({
			// 			label: "Keine Zeitangabe",
			// 			value: "no_date",
			// 			date: "",
			// 			data: [taskWidthId]
			// 		});
			// 	} else if (taskListIndex !== -1 && taskList[taskListIndex]) {
			// 		taskList[taskListIndex].data.push(taskWidthId);
			// 	}
			// }
		}
	}

	const sortedTaskList = taskList.sort((a, b) => {
		if (
			a.label === "Überfällig" ||
			a.label === "Diese Woche" ||
			a.label === "Ab nächster Woche" ||
			a.label === "Keine Zeitangabe"
		) {
			return -1;
		}
		if (
			b.label === "Überfällig" ||
			b.label === "Diese Woche" ||
			b.label === "Ab nächster Woche" ||
			b.label === "Keine Zeitangabe"
		) {
			return 1;
		}
		return new Date(a.date).getTime() - new Date(b.date).getTime();
	});

	return sortedTaskList;
};

export default sortTasksForList;
