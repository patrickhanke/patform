import { useQuery } from '@apollo/client';
import { generateGraphQLQuery } from '@provider';
import React, { useMemo, useState } from 'react'
import { AddEditServiceState, ServiceData } from './types';
import { Property } from '@types';
import AddEditService from './content/AddEditService';
import useServiceTableColumns from './hooks/useServiceTableColumns';
import { Table } from '@repo/ui';
import { paramsHandler } from '@repo/provider';

const Services = ({projectId}: {projectId: string}) => {
    const [addEditService, setAddEditService] = useState<AddEditServiceState | null>(null);
    
    const {data, refetch}  = useQuery(generateGraphQLQuery({
		type: 'find' , 
		objectName: 'Property', 
		fields: ['objectId', 'name', 'services']}), {
        variables: {params: paramsHandler({projectId})}
    })

	const columns = useServiceTableColumns({setAddEditService});

    const tableData =  useMemo(() => {
        if (data) {
            const properties = data.objects.findProperty.results;
            console.log(properties);
            const services: ServiceData[]  = [];
            
            properties.forEach((property: Property) =>{ 
                const propertyObject: ServiceData = {
                    objectId: property.objectId,
                    name: property.name,
                    ...property.services as Property['services']
                }
                services.push(propertyObject);
            });

            return services;
        }

        return [];
    }, [data]);

    return (
        <>
            <div className="content_element no_padding">
                <Table columns={columns} data={tableData} />
            </div>
            {!!addEditService &&
                <AddEditService 
                    title={`${addEditService.propertyName} - ${addEditService.serviceName}`} 
                    addEditService={addEditService} 
                    setAddEditService={setAddEditService} 
                    propertyId={addEditService.propertyId} 
                    serviceId={addEditService.serviceId}
                    refetch={refetch}
                />
            }
        </>
    )
}

export default Services