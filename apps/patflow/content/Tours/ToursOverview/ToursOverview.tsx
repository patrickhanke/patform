'use client';

import React, { useMemo } from 'react';
import { Page, Table } from '@repo/ui';
import { useQuery } from '@apollo/client';
import usePropertyTableColumns from './hooks/usePropertyTableColumns';
import { generateGraphQLQuery } from '@provider';
import { Property } from '@types';
import { ServiceData } from './types';

const ToursOverview = () => {

	const {data, refetch}  = useQuery(generateGraphQLQuery({
		type: 'find' , 
		objectName: 'Property', 
		fields: ['objectId', 'name', 'services']})
	)
	const columns = usePropertyTableColumns({refetch});

	const tableData =  useMemo(() => {
		if (data) {
			const properties = data.objects.findProperty.results;
			console.log(properties);
			const services: ServiceData[]  = [];
			
			properties.forEach((property: Property) =>{ 
				const propertyObject: ServiceData = {
					objectId: property.objectId,
					name: property.name,
					...property.services
				}
				services.push(propertyObject);
			});

			return services;
		}

		return [];
	}, [data]);

	console.log(data);
	console.log(tableData);
	
	return (
		<Page title='Touren'>
			<div className="content_element no_padding">
				<Table columns={columns} data={tableData} />
			</div>
		</Page>
	);
};

export default ToursOverview;