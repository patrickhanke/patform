import { useQuery } from '@apollo/client';
import { FIND_ALL_STAFF } from '@queries';
import { ElementSelectInterface } from '@repo/ui'
import { Task, Worker } from '@types';
import React, { FC, useMemo } from 'react'
import { PropertyOptions, SelectWorkerProps } from '../types';
import { DisplayWorker } from 'content/_UI/Workers';

const SelectWorker: FC<SelectWorkerProps> = ({setTask, task}) => {
    const {data: workerData} = useQuery(FIND_ALL_STAFF);

	const elements = useMemo(() => {
		const workerOptionsArray: PropertyOptions[] = [];
		if (workerData) {
			workerData.objects.find_User.results.forEach((worker: Worker) => {
				if (worker) {
					workerOptionsArray.push({
						value: worker.objectId,
						id: worker.objectId,
						label: `${worker.first_name} ${worker.family_name}`,
                        element: <DisplayWorker
                            workerId={worker.objectId} 
                        />
					});
				}
			});
		}
        workerOptionsArray.sort((a, b) => a.label?.localeCompare(b.label));

		return workerOptionsArray;
	}, [workerData]);

    return (
        <ElementSelectInterface
            title='Arbeiter auswählen'
            elements={elements}
            selectedElements={task.assigned_staff.map(element => elements.find((el) => el.value === element))}
            onSelect={(values) => {
                if (values.length > 0) {
                    setTask((task: Task) => ({
                        ...task,
                        assigned_staff: values.map((value) => value.value)
                    }))
                } else if (values.length === 0) {
                    setTask((task: Task) => ({
                        ...task,
                        assigned_staff: []
                    }))
                }
            }}
            max={5}
        />
  )
}

export default SelectWorker