import React, { FC, useCallback, useState } from 'react'
import { TourCellProps } from '../types'
import styles from '../Tour.module.scss';
import { useDataHandler } from '@repo/provider';
import { generateGraphQLQuery } from '@provider';
import { useQuery } from '@apollo/client';
import { cloneDeep, set } from 'lodash';
import { IconButton, UserDisplay } from '@repo/ui';
import { DisplayWorker } from 'content/_UI';

const TourCell: FC<TourCellProps> = ({services, id, serviceName, propertyId, propertyName, refetch, userId}) => {
    const {updateData} = useDataHandler()
    const [loading, setLoading] = useState(false);  

    const {data} = useQuery(generateGraphQLQuery({
        objectName: 'Property', 
        type: 'get',
        fields: ['services', 'objectId']
    }),
    {
        variables: {
            id: propertyId
        }
    })

    const service = services[id];

    const addServiceToUserHandler =  useCallback(async () => {
        setLoading(true);
        if (data) {
            const property = data.objects.getProperty;
            console.log(property);
            const propertyServices = cloneDeep(property.services);
            const services = propertyServices || {};
            set(services, `${id}.assigned_staff`, [userId] );
            // services[id] = service;
            console.log(services);
            await updateData({
                className: 'Property',
                objectId: propertyId,
                updateObject: {
                    objectId: propertyId,
                    services: services
                },
                onError: () => {
                    setLoading(false);
                }
            })
        }
        await refetch();
        setLoading(false);
    }, [service])
    
    if (!service) {
        return (
            <div className={styles.no_service} />
        )
    }

    if (service.assigned_staff.includes(userId)) {
        return (
            <div>
                <DisplayWorker workerId={service.assigned_staff[0]} onlyImage />
            </div>
        )
    }
  
    return (
        <div>
            <IconButton
                icon="plus"
                color='green'
                onClick={addServiceToUserHandler}
                disabled={loading}

            />
        </div>
  )
}

export default TourCell