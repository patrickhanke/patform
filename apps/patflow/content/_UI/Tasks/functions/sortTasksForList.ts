import { TaskSection } from '../types';
import { formatISO9075, getWeek, getYear, lastDayOfYear } from 'date-fns';
import { Task } from '@types';

const sortTasksForList: (array: Array<Task>) => TaskSection = (array: Array<Task>) => {
	const taskList: TaskSection = [];
	const getArchivedTasks = false;
	const arrayCopy = [...array];

	const sortedArray: Task[] = arrayCopy.sort((a, b) => {
		if (a.dates.length === 0) {
			return 1;
		}
		if (b.dates.length === 0) {
			return -1;
		}
		if (a.dates[0] && b.dates[0] && new Date(a.dates[0]).getTime() > new Date(b.dates[0]).getTime()) {
			return 1;
		}
		if (a.dates[0] && b.dates[0] && new Date(a.dates[0]).getTime() < new Date(b.dates[0]).getTime()) {
			return -1;
		}
		return 0;
	});

	for (let i = 0; i < sortedArray.length; i += 1) {
		const task: Task | undefined = sortedArray[i];

		if (task) {
			if (task.dates.length > 0) {
				task.dates.forEach((arrayDate: string) => {
					let date = '';
					let label: TaskSection[number]['label'] = 'Diese Woche';
					let titleValue: TaskSection[number]['value'] = 'this_week';

					const week = getWeek(new Date(arrayDate), {
						weekStartsOn: 1
					});
					const year = getYear(new Date(arrayDate));
					const currentWeek = getWeek(new Date(), { weekStartsOn: 1 });
					const currentYear = getYear(new Date());
					if (year === currentYear) {

						if (week === currentWeek) {
							date = formatISO9075(new Date(), {
								representation: 'date'
							});
							label = 'Diese Woche';
							titleValue = 'this_week';
						}

						if (week >= currentWeek + 1) {
							label = 'Ab nächster Woche';
							titleValue = 'next_week';
							date = arrayDate;
						}
						if (week < currentWeek) {
							label = 'Überfällig';
							titleValue = 'overdue';
							date = arrayDate;
						}
					} else if (year < currentYear) {
						label = 'Überfällig';
						titleValue = 'overdue';
						date = arrayDate;
					} else if (year > currentYear && currentWeek === getWeek(lastDayOfYear(new Date(currentYear)))) {
						label = 'Ab nächster Woche';
						titleValue = 'next_week';
						date = arrayDate;
					}

					const taskListIndex = taskList.findIndex(
						(taskListElement) => taskListElement.label === label
					);

					const taskWidthDate = {
						...task,
						date: arrayDate,
						id: `${task.objectId}-${arrayDate}`
					};

					if (label && date && taskListIndex === -1) {
						taskList.push({
							label: label,
							value: titleValue,
							date: date,
							data: [taskWidthDate]
						});
					} else if (date && taskListIndex !== -1 && taskList[taskListIndex]) {
						taskList[taskListIndex].data.push(taskWidthDate);
					}
				});
				if (task.state === 'created') {
					const taskWidthId = {
						...task,
						id: `${task.objectId}`
					};

					const taskListIndex = taskList.findIndex(
						(taskListElement) => taskListElement.label === 'Keine Zeitangabe'
					);
					if (taskListIndex === -1) {
						taskList.push({
							label: 'Keine Zeitangabe',
							value: 'no_date',
							date: '',
							data: [taskWidthId]
						});
					} else if (taskListIndex !== -1 && taskList[taskListIndex]) {
						taskList[taskListIndex].data.push(taskWidthId);
					}
				}
			}
		}
	}

	const sortedTaskList = taskList.sort((a, b) => {
		if (
			a.label === 'Überfällig' ||
			a.label === 'Diese Woche' ||
			a.label === 'Ab nächster Woche' ||
			a.label === 'Keine Zeitangabe'
		) {
			return -1;
		}
		if (
			b.label === 'Überfällig' ||
			b.label === 'Diese Woche' ||
			b.label === 'Ab nächster Woche' ||
			b.label === 'Keine Zeitangabe'
		) {
			return 1;
		}
		return new Date(a.date).getTime() - new Date(b.date).getTime();
	});

	return sortedTaskList;
};

export default sortTasksForList;
