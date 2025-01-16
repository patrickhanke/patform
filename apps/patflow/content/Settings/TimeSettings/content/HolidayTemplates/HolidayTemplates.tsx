import React from 'react';
import { HolidaysProps } from './types';
import { generateGraphQLQuery } from '@repo/provider';
import { useQuery } from '@apollo/client';
import useHolidayColumns from './hooks/useHolidayColumns';
import CreateHolidayTemplate from './content/CreateHolidayTemplate';
import { Table } from '@repo/ui';

const HolidayTemplates: React.FC<HolidaysProps> = ({projectId, createHolidayTemplate, setCreateHolidayTemplate, holidays}) => {
	const { data, refetch } = useQuery(
		generateGraphQLQuery({type: 'find', objectName: 'Template', fields: ['objectId', 'name', 'label', 'type', 'holidays']}),
		{variables:{params: {type: {_eq: 'holiday'}, project: {_eq: projectId}}}}
	);

	const columns = useHolidayColumns({refetch, holidays});

	return (
		<>
			<div className='content_element no_padding'>
				<Table
					data={data?.objects.findTemplate.results || []}
					columns={columns}
				/>
			</div>
			<CreateHolidayTemplate 
				templates={data?.objects.findTemplate.results || []} 
				createTemplate={createHolidayTemplate} 
				setCreateTemplate={setCreateHolidayTemplate}  
				refetch={refetch}
				holidays={holidays}
			/>
		</>
	);
};

export default HolidayTemplates;