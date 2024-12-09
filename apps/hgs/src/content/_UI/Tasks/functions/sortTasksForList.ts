import {TaskSection} from '../types';
import {formatISO9075, getWeek, getYear, lastDayOfYear} from 'date-fns';
import { Task } from '@/types';

const sortTasksForList = (array: Array<Task>) => {
	const taskList: TaskSection = [];
	const getArchivedTasks =  false;
	const arrayCopy = [...array];

	const sortedArray = arrayCopy.sort((a, b) => {
		if (a.dates.length === 0) {
			return 1;
		}
		if (b.dates.length === 0) {
			return -1;
		}
		if (new Date(a.dates[0]).getTime() > new Date(b.dates[0]).getTime()) {
			return 1;
		}
		if (new Date(a.dates[0]).getTime() < new Date(b.dates[0]).getTime()) {
			return -1;
		}
		return 0;
	});

	for (let i = 0; i < sortedArray.length; i += 1) {
		if (sortedArray[i].dates.length > 0) {
			sortedArray[i].dates.forEach((arrayDate: string) => {
				let date = '';
				let titleDate: string | undefined;

				// if (sortedArray[i].time.category.value === 'opportunity') {
				const week = getWeek(new Date(arrayDate), {
					weekStartsOn: 1
				});
				const year = getYear(new Date(arrayDate));
				const currentWeek = getWeek(new Date(), {weekStartsOn: 1});
				const currentYear = getYear(new Date());
				if (year === currentYear) {

					if (week === currentWeek) {
						date = formatISO9075(new Date(), {
							representation: 'date'
						});
						titleDate = 'Diese Woche';
					}

					if (week >= currentWeek + 1) {
						titleDate = 'Ab nächster Woche';
						date = arrayDate;
					}
					if (week < currentWeek) {
						titleDate = 'Überfällig';
						date = arrayDate;
					}
				} else if (year < currentYear) {
					titleDate = 'Überfällig';
					date = arrayDate;
				} else if (year > currentYear && currentWeek === getWeek(lastDayOfYear(new Date(currentYear)))) {
					titleDate = 'Ab nächster Woche';
					date = arrayDate;
				} 

				// } else {
				// 	const timeCopy = cloneDeep(sortedArray[i].time);
				// 	date = timeCopy.dates?.find(
				// 		(dateToFind: string) =>
				// 			formatISO9075(dateToFind, {representation: 'date'}) === arrayDate
				// 	);

				// 	if (new Date(date).getTime() < new Date().getTime()) {
				// 		titleDate = 'Überfällig';
				// 	} else {
				// 		titleDate = getDateLabel(arrayDate);
				// 	}
				// }

				const taskListIndex = taskList.findIndex(
					(taskListElement) => taskListElement.title === titleDate
				);

				const taskWidthDate = {
					...sortedArray[i],
					date: arrayDate,
					id: `${sortedArray[i].objectId}-${arrayDate}`
				};

				if (titleDate && date && taskListIndex === -1) {
					taskList.push({
						title: titleDate,
						date: date,
						data: [taskWidthDate]
					});
				} else if (date && taskListIndex !== -1) {
					taskList[taskListIndex].data.push(taskWidthDate);
				} 
			});
		}
		if (sortedArray[i].state === 'created') {
			const taskWidthId = {
				...sortedArray[i],
				id: `${sortedArray[i].objectId}`
			};

			const taskListIndex = taskList.findIndex(
				(taskListElement) => taskListElement.title === 'Erstellt'
			);
			if (taskListIndex === -1) {
				taskList.push({
					title: 'Erstellt',
					date: '',
					data: [taskWidthId]
				});
			} else if (taskListIndex !== -1) {
				taskList[taskListIndex].data.push(taskWidthId);
			} 
		}
		if (sortedArray[i].state === 'executed') {
			const taskWidthId = {
				...sortedArray[i],
				id: `${sortedArray[i].objectId}`
			};

			const taskListIndex = taskList.findIndex(
				(taskListElement) => taskListElement.title === 'Erledigt'
			);
			if (taskListIndex === -1) {
				taskList.push({
					title: 'Erledigt',
					date: '',
					data: [taskWidthId]
				});
			} else if (taskListIndex !== -1) {
				taskList[taskListIndex].data.push(taskWidthId);
			} 
		}
		if (sortedArray[i].state === 'completed') {
			const taskWidthId = {
				...sortedArray[i],
				id: `${sortedArray[i].objectId}`
			};

			const taskListIndex = taskList.findIndex(
				(taskListElement) => taskListElement.title === 'Abgeschlossen'
			);
			if (taskListIndex === -1) {
				taskList.push({
					title: 'Abgeschlossen',
					date: '',
					data: [taskWidthId]
				});
			} else if (taskListIndex !== -1) {
				taskList[taskListIndex].data.push(taskWidthId);
			} 
		}
		if (sortedArray[i].state === 'archived' && getArchivedTasks) {
			const taskWidthId = {
				...sortedArray[i],
				id: `${sortedArray[i].objectId}`
			};

			const taskListIndex = taskList.findIndex(
				(taskListElement) => taskListElement.title === 'Archiviert'
			);
			if (taskListIndex === -1) {
				taskList.push({
					title: 'Archiviert',
					date: '',
					data: [taskWidthId]
				});
			} else if (taskListIndex !== -1) {
				taskList[taskListIndex].data.push(taskWidthId);
			} 
		}
	}

	const sortedTaskList = taskList.sort((a, b) => {
		if (
			a.title === 'Überfällig' ||
			a.title === 'Diese Woche' ||
			a.title === 'Nächste Woche' ||
			a.title === 'Übernächste Woche' ||
			a.title === 'Erledigt' ||
			a.title === 'Erstellt' || 
			a.title === 'Abgeschlossen'
		) {
			return -1;
		}
		if (
			b.title === 'Überfällig' ||
			b.title === 'Diese Woche' ||
			b.title === 'Nächste Woche' ||
			b.title === 'Übernächste Woche' ||
			a.title === 'Erledigt' ||
			a.title === 'Erstellt' || 
			a.title === 'Abgeschlossen'
		) {
			return 1;
		}
		return new Date(a.date).getTime() - new Date(b.date).getTime();
	});

	return sortedTaskList;
};

export default sortTasksForList;
