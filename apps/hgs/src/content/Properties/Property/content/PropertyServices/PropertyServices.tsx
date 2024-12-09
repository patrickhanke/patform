import { useQuery } from '@apollo/client';
import React from 'react';
import Table from '@/_UI/surfaces/Table';
import useTableColumns from './hooks/useTableColumns';
import { FIND_PROPERTY_SERVICES } from '@/queries';

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