import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { EditRecordProps, WorkingTime, WorkingTimes } from './types';
import { DefaultDay, ErrorMessage } from '@types';
import RecordTimeDisplay from './components/RecordTimeDisplay';
import styles from './EditRecord.module.scss';
import { AppContext, createTime, findDefaultTimeForDate, getWorktimeDuration, useGetActiveRecord } from '@provider';
import { useDataHandler } from '@repo/provider';
import EditTime from './components/EditTime';
import { cloneDeep, pullAllBy, set } from 'lodash-es';
import { CreateButton, IconButton, SlideIn } from '@repo/ui';
import { generateUuid } from '@repo/provider';

const EditRecord = ({userId, selectedWeek, weekDays, refetch} : EditRecordProps) => {
	const [slidein, setSlideIn] = useState(false);
	const [workingTimes, setWorkingTimes] = useState<WorkingTimes>(weekDays);
	const [currentIndex, setCurrentIndex] = useState<number>(NaN);
	const {deleteData} = useDataHandler();
	const [disabled, setDisabled] = useState<[boolean, boolean]>([false, false]);
	const [errors, setErrors] = useState<ErrorMessage[]>([]);
	const {year} = useContext(AppContext);

	const {record} = useGetActiveRecord({year, userId});

	const itemValues = useMemo(() => workingTimes.map((time: WorkingTimes[number]) => Object.values(time).map(value => value) ).flat(), [workingTimes]);

	const errorHandler = useCallback((type: 'check' | 'reset', wt?: WorkingTimes) => {
		if (type === 'check' && wt) {
			const disabledArray: [boolean, boolean] = [false, false];
			const errorArray: ErrorMessage[] = [];
			wt.forEach((newTime, index) => {
				if (!newTime.date && newTime.type === 'work') {
					disabledArray[1] = true;
					errorArray.push({
						id: 'time',
						key: `time_${index}`,
						message: 'Bitte fehlendes Datum angeben'
					});
				} else if ((!newTime.time?.start || !newTime.time?.end) && newTime.type === 'work') {
					disabledArray[1] = true;
					errorArray.push({
						id: 'time',
						key: `time_${index}`,
						message: 'Bitte Start- und Endzeit angeben'
					});
				}
			});
			setDisabled(disabledArray);
			setErrors(errorArray);
		}
		if (type === 'reset') {
			setDisabled([false, false]);
			setErrors([]);
		}
	}, [workingTimes]);

	const timeChangeHandler = useCallback((day: WorkingTime) => {
		const newTimes = cloneDeep(workingTimes);
		
		const index = newTimes.findIndex((element: WorkingTime) => (element.id === day.id) || (element.objectId === day.objectId));
		const newTime = cloneDeep(day);

		if (day.time?.start && day.time?.end && index !== -1) {
			set(newTime, 'time.duration', getWorktimeDuration(day.time?.start, day.time?.end));
		}
		
		newTimes[index] = newTime;
		setWorkingTimes(newTimes);
		errorHandler('check', newTimes);	
	}, [itemValues, workingTimes]);

	const deleteDay = useCallback(async (type: 'objectId' | 'id', objectId: string) => {
		const newWorkingTimes = cloneDeep(workingTimes);
		
		if (type === 'objectId') {
			await deleteData({
				className: 'Day',
				objectId: objectId
			});
			pullAllBy(newWorkingTimes, [{objectId}], 'objectId');
		} else if (type === 'id') {
			pullAllBy(newWorkingTimes, [{id: objectId}], 'id');
		}
		setWorkingTimes(newWorkingTimes);
		errorHandler('check', newWorkingTimes);
		await refetch();
		setCurrentIndex(NaN);
	}, [workingTimes]);

	const confirmButtonHandler = useCallback(async () => {
		setDisabled([true, true]);

		const promise: Promise<void>[] = [];

		workingTimes.forEach((day: WorkingTimes[number]) => {
			if (record && record?.objectId) {
				const recordTime = findDefaultTimeForDate(day.date, [record]);
				promise.push( createTime({
					...day, 
					default_time: recordTime.default_time, 
					record_id: record?.objectId, 
					user_id: userId
				}));
			}
		});

		await Promise.all(promise);
		await refetch();
		setWorkingTimes(weekDays);
		setSlideIn(false);
		setDisabled([false, false]);
	}, [workingTimes, record]);

	const secondaryContent =  useMemo(() => {
		if (isNaN(currentIndex)) {
			return null;
		}
		const day = workingTimes[currentIndex];
		if (!day) {
			return null;
		}
		return (
			<EditTime
				key={currentIndex}
				day={day}
				timeChangeHandler={timeChangeHandler}
				workingTimes={workingTimes}
				selectedWeek={selectedWeek}
				deleteDay={deleteDay}
				userId={userId}
			/>
		);	
	}, [workingTimes, selectedWeek, currentIndex]);

	const createNewDay = useCallback(() => {
		const newDay: DefaultDay = {
			id: generateUuid(),
			date: '',
			year: new Date().getFullYear(),
			month: new Date().getMonth() + 1,
			absence: null,
			default_time: null,
			time: {
				start: '',
				end: '',
				duration: 0,
				pause: 0,
				type: 'regular',
				comment: '',
				state: 'created'
			},
			is_working_day: true,
			type: 'work',
			saldo: 0,
			surcharges: []
		};
		const newWorkingTimes = cloneDeep(workingTimes);
		newWorkingTimes.push(newDay);
		
		setWorkingTimes(newWorkingTimes);
		errorHandler('check', newWorkingTimes);
	}, [workingTimes]);

	useEffect(() => {
		setWorkingTimes(weekDays);
	}, [slidein]);

	return (
		<>
			<div>
				<IconButton icon='edit' onClick={() => setSlideIn(true)} />
			</div>
			<SlideIn
				header='Zeiten bearbeiten'
				confirm={() => confirmButtonHandler()}
				isOpen={slidein}
				cancel={() => {
					setCurrentIndex(NaN);
					setWorkingTimes(weekDays);
					errorHandler('reset');
					setSlideIn(false);
				}}
				secondaryContent={secondaryContent}
				showSecondaryContent={!isNaN(currentIndex)}
				disabled={disabled}
				errors={errors}
			> 
				<div className={styles.record_time_display_list}>
					{workingTimes.map((day: WorkingTimes[number], index: number) => (
						<RecordTimeDisplay
							key={day.objectId || day.id}
							day={day}
							setCurrentIndex={setCurrentIndex}
							currentIndex={currentIndex}
							index={index}
						/>
					))}
					<CreateButton onClick={() => createNewDay()} size='medium' text='Zeit hinzufügen' />
				</div>
			</SlideIn>
		</>
	);
};

export default EditRecord;