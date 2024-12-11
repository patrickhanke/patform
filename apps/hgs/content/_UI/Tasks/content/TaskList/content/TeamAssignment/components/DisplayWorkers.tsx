import { DisplayWorker, WorkersInterface } from '@content';
import { useDataHandler } from '@provider';
import { GET_TASK_WORKERS } from '@queries';
import { DisplayWorkersProps, Task, Worker } from '@types';
import { useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { cloneDeep, pull } from 'lodash';

import styles from '../TeamAssignment.module.scss';
import { formatISO9075 } from 'date-fns';
import { SlideInRight } from '@repo/ui';

const DisplayWorkers = ({taskId, refetchTask, taskState, showAsButton=false, selectWorkers= false} : DisplayWorkersProps) => {
	const [isOpen, setIsOpen] = useState(false);	
	const {updateData} = useDataHandler();
	const {data, refetch} = useQuery(GET_TASK_WORKERS, {
		variables: {id: taskId},
		notifyOnNetworkStatusChange: true
	});

	const taskStateHandler = useCallback(async (stateValue: Task['state']) => {
		await updateData({
			className: 'Task',
			objectId: taskId,
			updateObject: {
				state: stateValue
			}
		});
		refetchTask();
	}, [refetchTask]);

	const nextDate = useMemo(() => {
		let date;
		if (data) {
			const datesCopy = cloneDeep(data.objects.getTask.dates) || [];
			if (datesCopy.length > 0) {
				const timeCopy: Task['time'] = cloneDeep(data.	objects.getTask.time);
				date = timeCopy.dates?.find((dateToFind: string) =>  formatISO9075(dateToFind, {representation: 'date'}) === datesCopy[0]);
			}
		}

		return date;
	}, [data]);

	useEffect(() => {
		const workers = data?.objects.getTask.assigned_staff;
		
		if (workers && workers?.length === 0 && taskState !== 'created') {
			taskStateHandler('created');
		}
		if (workers && workers?.length > 0 && taskState === 'created') {
			taskStateHandler('assigned');
		}
	}, [taskState, data]);

	const changeWorkerHandler = useCallback(async (type: 'add' | 'remove', id: Worker['objectId']) => {
		const workerArray = cloneDeep(data?.objects.getTask.assigned_staff) || [];
		
		if (type === 'remove') {
			const newWorkerArray = pull(workerArray, id);
			
			await updateData({
				className: 'Task',
				objectId: taskId,
				updateObject: {
					assigned_staff: newWorkerArray
				}
			});
		}
		if (type === 'add') {
			await updateData({
				className: 'Task',
				objectId: taskId,
				updateObject: {
					assigned_staff: [...workerArray, id]
				}
			});
		}
		refetch();
	}, [data]);   
    
	const workerComponent = useMemo(() =>
		<WorkersInterface
			workers={data?.objects?.getTask?.assigned_staff || []}
			onChange={changeWorkerHandler}
			nextDate={nextDate}
		/>
	, [data, data?.objects?.getTask?.assigned_staff?.length, nextDate]);

	const staffNumber = data?.objects.getTask.assigned_staff.length || 0;

	if (data) return (!showAsButton ?
		<>
			{data.objects.getTask.assigned_staff.map((workerId: Worker['objectId']) => 
				<DisplayWorker
					key={workerId}
					workerId={workerId}
					nextDate={nextDate}
					showAvailability
					onlyImage={false}
				/>
			)}
			{(taskState === 'created' || taskState === 'assigned') &&  
				<button className='full_button sm light' onClick={() => setIsOpen(true)}> 
					+ Arbeiter ändern
				</button>
			}
			<SlideInRight isOpen={isOpen} setIsOpen={setIsOpen} header='Arbeiter auswählen'>
				{workerComponent}
			</SlideInRight>
		</>
		:
		<>
			{selectWorkers ? 
				<>
					<button className={'full_button sm light'} onClick={() => setIsOpen(true)}  >
						{/* <IoPersonCircleOutline size={24} color={'#efefef'} /> */}
						<div className={styles.button_workers_container}>
							{staffNumber> 0 ? data.objects.getTask.assigned_staff.map((workerId: Worker['objectId'], index: number) =>
								<div key={workerId} style={{width: 'fit-content', transform: `translateX(${-index * 12}px)`, overflow: 'visible', zIndex: index}}>
									<DisplayWorker
										workerId={workerId}
										nextDate={nextDate}
										showAvailability
										onlyImage={true}
									/>
								</div>
							): (
								<span>
									+ Arbeiter hinzufügen
								</span>
							)}
						</div>
					</button>
					<SlideInRight isOpen={isOpen} setIsOpen={setIsOpen} header='Arbeiter auswählen'>
						{workerComponent}
					</SlideInRight>
				</>
				:
				<div className={styles.button_workers_container}>
					{data.objects.getTask.assigned_staff.map((workerId: Worker['objectId'], index: number) =>
						<div key={workerId} style={{width: '12px', overflow: 'visible', zIndex: index}}>
							<DisplayWorker
								workerId={workerId}
								nextDate={nextDate}
								showAvailability
								onlyImage={true}
							/>
						</div>
					)}
				</div>
			}
		</>
	);
	return null;
};

export default DisplayWorkers;