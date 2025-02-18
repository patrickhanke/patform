import { useQuery } from '@apollo/client';
import { FIND_ALL_STAFF } from '@queries';
import { ElementSelectInterface, StateDisplay } from '@repo/ui'
import { CreateService, Service, Worker } from '@types';
import React, { FC, useMemo } from 'react'
import { PropertyOptions, SelectWorkerProps } from '../types';
import { DisplayWorker } from 'content/_UI/Workers';
import { generateGraphQLQuery } from '@repo/provider';
import styles from '../AddService.module.scss';

const SelectWorker: FC<SelectWorkerProps> = ({setService, service, propertyId}) => {
    const {data: workerData} = useQuery(FIND_ALL_STAFF);
    const {data: propertyData} = useQuery(generateGraphQLQuery({
		objectName: 'Property',
		fields: ['assigned_staff', 'objectId', 'name'],
		type: 'get'
	}), {
		variables: {id: propertyId},
		notifyOnNetworkStatusChange: true,
	}); 

	const elements = useMemo(() => {
		const workerOptionsArray: PropertyOptions[] = [];
		const propertyStaff = propertyData?.objects.getProperty?.assigned_staff || [];
        
        if (workerData) {
			workerData.objects.find_User.results.forEach((worker: Worker) => {
				if (worker) {
					workerOptionsArray.push({
						value: worker.objectId,
						id: worker.objectId,
						label: `${worker.first_name} ${worker.family_name}`,
                        element: 
                        <div className={styles.worker_display_container}>
                            <DisplayWorker
                                workerId={worker.objectId} 
                            />
                            {propertyData && propertyStaff.includes(worker.objectId) && (
                                <StateDisplay
                                    label={propertyData?.objects.getProperty.name}
                                    color='green'
                                />
                            )}
                            
                        </div>
					});
				}
			});
		}
        workerOptionsArray.sort((a, b) => a.label?.localeCompare(b.label));

		return workerOptionsArray;
	}, [workerData, propertyData]);

    return (
        <ElementSelectInterface
            title='Arbeiter auswählen'
            elements={elements}
            selectedElements={service.assigned_staff.map(element => elements.find((el) => el.value === element))}
            onSelect={(values) => {
                if (values.length > 0) {
                    setService((service: CreateService) => ({
                        ...service,
                        assigned_staff: values.map((value) => value.value)
                    }))
                } else if (values.length === 0) {
                    setService((service: CreateService) => ({
                        ...service,
                        assigned_staff: []
                    }))
                }
            }}
            max={5}
        />
  )
}

export default SelectWorker