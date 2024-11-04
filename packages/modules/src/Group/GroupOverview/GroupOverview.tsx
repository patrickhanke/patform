'use client';

import { useContext, useState } from 'react';
import { Page, Table, useCreateColumns } from '@repo/ui';
import { AppContext } from '@repo/provider';
import { GroupClass } from '@repo/types';
import useFindGroup from './hooks/useFindGroup';
import createGroup from './constants/createGroup';

const GroupOverview = () => {
	const {currentModule} = useContext(AppContext);

	const [filters] = useState([]);
	const {groups, refetch} = useFindGroup({moduleId: currentModule.objectId, filters});

	const columns = useCreateColumns<GroupClass>({
		data:[
			{id: 'image', type: 'edit_image', label: 'Portrait'},
			{id: 'title', type: 'edit_string', label: 'Name'},
			{id: 'state', type: 'edit_string', label: 'Status'}
		],
		fields: currentModule.fields,
		className: 'Group',
		refetch,
		categories: currentModule?.categories
	});


	return (
		<Page 
			title={currentModule.name}
			emptyContent={true}
			createClass={createGroup}
			refetch={refetch}
		>
			<Table 
				columns={columns}
				data={groups || []}
			/>
		</Page>
	);
};

export default GroupOverview;