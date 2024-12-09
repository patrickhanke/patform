import {DateSelectWithExternalState, Icon, SlideInModal, TextInput, TimeDisplay, WorkerSelectWithState} from '@/content/_UI';
import ObjectSelectWithState from '@/_UI/interfaces/Selects/ObjectSelect/ObjectSelectWithState';
import { AppContext, UserContext, useDataHandler } from '@/provider';
import clsx from 'clsx';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import styles from './CreateTask.module.scss';
import {TicketSelectWithState} from '@/content/_UI';
import modi_options from '@/_UI/interfaces/Date/DateSelectInterface/content/DateSelect/constants/modi_options';
import date_category_options from '@/_UI/interfaces/Date/DateSelectInterface/content/DateSelect/constants/date_category_options';
import { CreateTask as CreateTaskType, CreateTaskProps, DateObjectWithNextDates, ErrorMessage, CreateTaskUpdateObject, DateObject } from '@/types';
import initial_task from './constants/initial_task';

const CreateTask = ({refetch, button, initialData}: CreateTaskProps) => {
	const {createData, updateData} = useDataHandler();
	const {user} = useContext(UserContext);
	const {roleUsers} = useContext(AppContext);
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showDate, setShowDate] = useState(false);

	const [errors, setErrors] = useState([] as unknown as ErrorMessage[]);
	const [task, setTask ] =  useImmer<CreateTaskType>(initial_task);

	const [date, setDate] = useState({
		type: modi_options[0],
		category: date_category_options[0],
		interval: 1,
		start_date: '',
		end_date: '',
		dates: [''],
		weekday: '',
		time: '',
		next_dates: []
	} as DateObjectWithNextDates);

	useEffect(() => {
		if (initialData) {
			setTask(draft => {
				Object.keys(initialData).forEach((key) => { 
					draft[key as keyof CreateTaskType] = initialData[key as keyof CreateTaskProps['initialData']];
				});
			});
		}
	}, [initialData, isOpen]);

	useEffect(() => {
		const errorArray : ErrorMessage[] = [];
		if (!task.title) {
			errorArray.push({message: 'Bitte eine Aufgabe angeben', key: 'task_title', id: 'task_title'});
		}
		if (!task.property) {
			errorArray.push({message: 'Bitte ein zugehöriges Objekt angeben', key: 'taks_object', id: 'taks_object'});
		}
		if (!date.next_dates || date.next_dates.length === 0) {
			errorArray.push({message: 'Bitte das Datum vollständig ausfüllen', key: 'taks_date', id: 'taks_date'});
		}
		setErrors(errorArray);
	}, [task, date]);

	const createTask = useCallback(async () => {
		setLoading(true);
		const updateObject: CreateTaskUpdateObject  = {
			title: task.title,
			created_by: {__type: 'Pointer', className: '_User', objectId: user?.objectId},
			description: task.description,
			documents: task.documents,
			state: task.state,
			assigned_staff: task.assigned_staff,
			comments: [],
			images: [],
			type: date.type.value,
			category: date.category.value,
			dates: date.next_dates,
			time: date
		};

		if (task.ticket) {
			updateObject['ticket'] = {__type: 'Pointer', className: 'Ticket', objectId: task.ticket};
		}

		if (task.property) {
			updateObject['property'] = {__type: 'Pointer', className: 'Property', objectId: task.property};
		}

		await createData({
			className: 'Task',
			updateObject,
			afterSaveHandler(objectId) {
				if (task.ticket) {
					updateData({
						className: 'Ticket',
						objectId: task.ticket,
						updateObject: {
							task: {__type: 'Pointer', className: 'Task', objectId}
						}
					});
				}
			},
			message: {type: 'task_created', users: roleUsers.admin}
		});
		if (refetch) {
			refetch();
		}
		setShowDate(false);
		setIsOpen(false);
		setTask(initial_task);
		setLoading(false);
	}, [task, date]);

	return (
		<>
			{button ? button({onClick: () => setIsOpen(true)}) :
				<button 
					className={clsx( 'full_button', 'green', 'md', styles.create_task_button) } 
					onClick={() => setIsOpen(true)}
				>
					<Icon type='plus' strokeWidth={1} size={12} />
					Neue Aufgabe erstellen
				</button>
			}
			<SlideInModal
				isOpen={isOpen}
				cancel={() => setIsOpen(false)}
				confirm={() => createTask()}
				header='Aufgabe erstellen'
				disabled={[false, (errors.length > 0 || loading)]}
				errors={errors}
				secondaryContent={showDate ? 
					<DateSelectWithExternalState
						initialValue={date}
						dataHandler={setDate}
					/>
					: 
					null
				}
			> 
				<div className={clsx(styles.create_task_container, 'flexbox_column_with_gap')}>
					<div className={styles.main_inputs_container}>
						<div className={styles.inputs_container}>
							<TextInput
								label='Aufgabe'
								id={'title'}
								onChange={(value) => setTask(draft => {
									draft.title = value;
								})}
								errors={errors}
							/>
							<TicketSelectWithState
								label='Ticket auswählen'
								selectedTicket={task?.ticket}
								setSelectedTicket={(value) => setTask(draft => {
									if (!value?.value) {
										draft.ticket = undefined;
									}
									draft.ticket = value?.value;
								})}
								disabled={initialData ? Object.keys(initialData).includes('ticket') : false}
							/>
							<ObjectSelectWithState
								label='Objekt auswählen'
								selectedObject={task?.property}
								setSelectedObject={(value) => setTask(draft => {
									draft.property = value.value;
								})}
								key='task_property_select'
								disabled={ initialData ? Object.keys(initialData).includes('property') : false}
							/>
							<TextInput
								label='Beschreibung'
								id='description'
								onChange={(value) => setTask(draft => {
									draft.description = value;
								})}
								type='textarea'
								width='100%'
								isTextArea
							/>
							<WorkerSelectWithState
								label='Arbeiter auswählen'
								selectedWorkers={task.assigned_staff}
								setSelectedWorkers={(value) => setTask(draft => {
									draft.assigned_staff = value.map((worker) => worker.value);
								})}
								width={'100%'}
							/>
							<div>
								<label>
									Datum für die Aufgabe festlegen 
								</label>
								<TimeDisplay date={date} onClick={() => setShowDate(true)} />
							</div>
						</div>
					</div>
				</div>
			</SlideInModal>
		</>
	);
};

export default CreateTask;