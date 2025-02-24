import React, { FC, useMemo } from 'react'
import useTourTableColumns from './hooks/useTourTableColumns'
import { useQuery } from '@apollo/client'
import { generateGraphQLQuery, paramsHandler } from '@repo/provider'
import { ServiceData, TourProps } from './types'
import { Property } from '@types'
import { Table } from '@repo/ui'

const Tour: FC<TourProps> = ({projectId, workerId}) => {
    const {data, refetch}  = useQuery(generateGraphQLQuery({
		type: 'find' , 
		objectName: 'Property', 
		fields: ['objectId', 'name', 'services', 'assigned_staff']}), {
        variables: {params: paramsHandler({projectId})}
    })

    const tableData =  useMemo(() => {
        if (data && workerId) {
            const properties = data.objects.findProperty.results;
            console.log(properties);
            const services: ServiceData[]  = [];
            
            properties.forEach((property: Property) =>{ 
                const propertyObject: ServiceData = {
                    objectId: property.objectId,
                    name: property.name,
                    ...property.services
                }
                if (property.assigned_staff.includes(workerId)) {
                    services.push(propertyObject);
                }
            });

            return services;
        }

        return [];
    }, [data, workerId]);

    const columns = useTourTableColumns({workerId, refetch})

    return (
        <div>
            <Table columns={columns} data={tableData} cellBorders />
        </div>
    )
}

export default Tour