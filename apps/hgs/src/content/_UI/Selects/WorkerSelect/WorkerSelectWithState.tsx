import React, { useMemo } from 'react';
import {Select} from '../Select';
import { useQuery } from '@apollo/client';
import { ApplicationTypes, UserTypes } from '@/types';
import { FIND_ALL_STAFF } from '@/queries';

type WorkerSelect = {
    value: string,
    id: string,
    label: string,
    portrait: ApplicationTypes.Image
}

const WorkerSelect = ({selectedWorkers, setSelectedWorkers, label, width = 180}: {selectedWorkers: string[], setSelectedWorkers: (W: WorkerSelect[])=> void, label?: string, width?: string | number }) => {
	const {data: workerData} = useQuery(FIND_ALL_STAFF);

	const workerOptions = useMemo(() => {
		const workerOptionsArray: WorkerSelect[] = [];
		if (workerData) {
			workerData.objects.find_User.results.forEach((worker: UserTypes.User) => {
				if (worker.is_worker) {
					workerOptionsArray.push({
						value: worker.objectId,
						id: worker.objectId,
						label: `${worker.first_name} ${worker.family_name}`,
						portrait: worker.portrait
					});
				}
			});
		}
		return workerOptionsArray;
	}, [workerData]);

	return (
		<div>
			<Select
				label={label || ''}
				id='workers'
				value={selectedWorkers.map((worker) => workerOptions.find((option) => option.value === worker))}
				options={workerOptions} 
				onChange={(values) => setSelectedWorkers(values)}
				isClearable
				isMulti
				width={width}
			/>
		</div>
	);
};

export default WorkerSelect;