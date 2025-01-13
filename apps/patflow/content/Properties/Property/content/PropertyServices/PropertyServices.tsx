import { useQuery } from '@apollo/client';
import React from 'react';
import useTableColumns from './hooks/useTableColumns';
import { FIND_PROPERTY_SERVICES } from '@queries';
import { Table } from '@repo/ui';

const PropertyServices = ({objectId}: {objectId: string}) => {
	const {data} = useQuery(FIND_PROPERTY_SERVICES, {variables: {id: objectId}});
	const columns = useTableColumns();
     
	return (
		<div className='site_content'>
			<Table columns={columns} data={data ? data.objects.findService.results : []} />
		</div>
	);
};

export default PropertyServices;