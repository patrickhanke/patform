import { DisplayWorker } from '@content';
import { useDataHandler } from '@repo/provider';
import { FIND_ALL_STAFF, GET_TASK_WORKERS } from '@queries';
import { DisplayWorkersProps, Task, Worker } from '@types';
import { useQuery } from '@apollo/client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { cloneDeep } from 'lodash';

import styles from '../TeamAssignment.module.scss';
import { formatISO9075 } from 'date-fns';
import { ElementSelectInterface, SlideInRight } from '@repo/ui';
import { WorkerOption } from '../types';

const DisplayWorkers = ({taskId, refetchTask, taskState, showAsButton=false, selectWorkers= false} : DisplayWorkersProps) => {
	const [isOpen, setIsOpen] = useState(false);	
	const {updateData} = useDataHandler();
	const {data, refetch} = useQuery(GET_TASK_WORKERS, {
		variables: {id: taskId},
		notifyOnNetworkStatusChange: true
	});
    const {data: workerData} = useQuery(FIND_ALL_STAFF);


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

	const elements = useMemo(() => {
			const workerOptionsArray: WorkerOption[] = [];
			if (workerData) {
				workerData.objects.find_User.results.forEach((worker: Worker) => {
					if (worker) {
						workerOptionsArray.push({
							value: worker.objectId,
							id: worker.objectId,
							label: `${worker.first_name} ${worker.family_name}`,
							element: <DisplayWorker
								workerId={worker.objectId} 
								nextDate={nextDate}
								showAvailability
								showState
							/>
						});
					}
				});
			}
			workerOptionsArray.sort((a, b) => a.label?.localeCompare(b.label));
	
			return workerOptionsArray;
		}, [workerData]);
	
	const workerComponent = useMemo(() =>
		<ElementSelectInterface
            elements={elements}
            selectedElements={ data ? data.objects.getTask.assigned_staff.map((element: string) => elements.find((el) => el.value === element)) : []}
            onSelect={async (values) => {
				const workers = values.map((value) => value.value);
				await updateData({
					className: 'Task',
					objectId: taskId,
					updateObject: {
						assigned_staff: [...workers]
					}
				});
				refetch();
            }}
            max={5}
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