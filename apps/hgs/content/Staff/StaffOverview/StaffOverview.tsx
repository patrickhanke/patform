'use client';

import { useQuery } from '@apollo/client';
import React from 'react';
import useTableColumns from './hooks/useTableColumns';
import { FIND_ALL_STAFF } from '@/queries';
import { SiteHeader } from '@repo/ui';
import Table from '@/app/(application)/content/Table';

const StaffOverview = () => {
	const columns = useTableColumns();
	const {data}  = useQuery(FIND_ALL_STAFF,{
		notifyOnNetworkStatusChange: true
	});

	return (
		<>
			<SiteHeader title='Mitarbeiter' />
			<div className='site_content'> 
				<div className="content_element no_padding">
					<Table columns={columns} data={data?.objects?.find_User?.results || []} />
				</div>
			</div>
		</>
	);
};

export default StaffOverview;