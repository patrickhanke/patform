'use client';

import { useContext, useState } from 'react';
import { CreateClass, Page, Table, useCreateColumns }  from '@repo/ui';
import { NewsClass } from '@repo/types';
import { AppContext } from '@repo/provider';
import useFindNews from './hooks/useFindEvent';
import createEvent from './constants/createEvent';

const EventOverview = () => {
	const {currentModule} = useContext(AppContext);
	const [filters] = useState([]);
	const {news, refetch} = useFindNews({moduleId: currentModule.objectId, filters});

	const columns = useCreateColumns<NewsClass>({
		data:[
			{id: 'image', type: 'image', label: 'Bild'},
			{id: 'title', type: 'edit_string', label: 'Titel'},
			{id: 'text', type: 'edit_textfield', label: 'Text'}
		],
		fields: currentModule.fields,
		className: 'News',
		refetch,
		categories: currentModule?.categories
	});

	return (
		<Page 
			title={currentModule.name}
			pageHeaderContent={
				<CreateClass
					initialData={undefined}
					fields={createEvent.fields}
					className={createEvent.className}
					refetch={refetch}
				/>
			}
			emptyContent={true}
			createClass={createEvent}
			refetch={refetch}
		>
			<Table 
				columns={columns}
				data={news || []}
			/>
		</Page>
	);
};

export default EventOverview;