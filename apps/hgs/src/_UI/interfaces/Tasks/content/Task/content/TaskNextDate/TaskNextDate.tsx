import React, { useCallback, useMemo } from 'react';
import styles from './TaskNextDate.module.scss';
import { DateSelectInterfaceTask, Loader, StateDisplay } from '@/_UI';
import { useQuery } from '@apollo/client';
import { GET_TASK_TIME } from '@/queries';
import { getDateString, useDataHandler } from '@/provider';
import Modal from '@/_UI/interfaces/Modal';
import { formatISO9075 } from 'date-fns';
import { Task } from '@/types';

const TaskNextDate = ({taskId, tasksRefetch}: {taskId: string, tasksRefetch?: () => void}) => {
	const [showModal, setShowModal] = React.useState(false);
	const [showInterface, setShowInterface] = React.useState(false);
	const {updateData} = useDataHandler();
	const {data, loading, refetch} = useQuery(GET_TASK_TIME, {
		variables: {id: taskId}
	});
	
	const nextDate = useMemo(() => {
		let value = 'Kein Termin';
		let is_overdue = false;
		let allDates = [];
		let color = 'light';

		if (data) {
			if (data.objects.getTask.dates.length > 0)  {
				const datesCopy = [...data.objects.getTask.dates];
				allDates = datesCopy;
				const timeCopy: Task['time'] = {...data.objects.getTask.time};
				const date = timeCopy.dates?.find((dateToFind: string) =>  formatISO9075(dateToFind, {representation: 'date'}) === datesCopy[0]);
				if (date) {
					if (new Date(date).getTime() < new Date().getTime()) {
						is_overdue = true;
					}
					if (timeCopy.category.value === 'fixed') {
						if (date.length > 10) {
							value = `${getDateString(date).date} - ${getDateString(date).time} - D`;
						} else {
							value = `${getDateString(date).date} - D`;
						}
					}
					if (timeCopy.category.value === 'opportunity') {
						value = `${getDateString(date).date} - T`;
					}
					if (timeCopy.category.value === 'fixed' && new Date(date).getTime() < new Date().getTime()) {
						color = 'red';
					}
					if (timeCopy.category.value === 'opportunity') {
						color = 'blue';
					}
				}
			} else {
				value = 'Kein Termin';
			}
		}

		return {
			allDates,
			value,
			is_overdue,
			color
		};
	}, [data]);

	const completeTask = useCallback(async () => {
		await updateData({
			className: 'Task',
			objectId: taskId,
			updateObject: {
				state: 'completed'
			}
		});
		if (refetch) {
			await refetch();
		}
	}, [taskId]);

	const nextDateSelectOptions = useMemo(() => {
		if (!data) return [];

		const taskState = data.objects.getTask.state;
		return [{
			value: 'date_done',
			label: 'Termin Erledigen',
			onClick: () => setShowModal(true),
			color: 'dark',
			isDisabled: nextDate?.allDates?.length > 0 ? false : true
		}, {
			value: 'edit_date',
			label: 'Datum Bearbeiten',
			onClick: () => setShowInterface(true),
			color: 'dark',
			isDisabled: false
		}, {
			value: 'close_task',
			label: 'Aufgabe Abschließen',
			onClick: () => completeTask(),
			color: 'dark',
			isDisabled: (taskState === 'executed' || taskState === 'completed') ? false : true
		},
		{
			value: 'archive_task',
			label: 'Aufgabe Archivieren',
			onClick: () => setShowInterface(true), 
			color: 'dark',
			isDisabled: taskState === 'completed' ? false : true
		},
		{
			value: 'delete_task',
			label: 'Aufgabe Löschen',
			onClick: () => setShowInterface(true),
			color: 'red',
			isDisabled:false
		}
	
		];
	}, [nextDate, data]);

	if (loading) return <Loader width='30px' height='18px' />;

	if (data) return (
		<>
			<div className={styles.object_container} >
				<StateDisplay<'no-state'>
					label={nextDate.value}
					color={nextDate.color}
					icon='calendar'
					customOptions={nextDateSelectOptions}
					displayInterface
					width={180}
					noBackground
				/>
			</div>
			<Modal
				header='Aufgabe erledigen'
				isOpen={showModal}
				confirmButtonHandler={async () => {
					const dateCopy = [...nextDate.allDates];
					dateCopy.splice(0, 1);
					await updateData({
						className: 'Task',
						objectId: taskId,
						updateObject: {
							dates: dateCopy
						}
					});
					await refetch();
					setShowModal(false);
				}}

				cancelButtonHandler={() => setShowModal(false)}
			>
				<p>
					Wollen Sie den Termin der Aufgabe erledigen?
				</p>
			</Modal>
			<DateSelectInterfaceTask
				taskId={taskId}
				showDateInterface={showInterface}
				setShowDateInterface={setShowInterface}
				tasksRefetch={tasksRefetch}
			/>
		</>
	);

	return <Loader width='0px' height='18px' />;
};

export default TaskNextDate;