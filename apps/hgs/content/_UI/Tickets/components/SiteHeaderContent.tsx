import React, { useMemo } from 'react';
import { Select } from '../../Selects';
import { FIND_ALL_PROPERTY } from '@queries';
import { useQuery } from '@apollo/client';
import { SiteHeaderContentComponent } from '../types';
import styles from '../Tickets.module.scss';
import { filterChangeHandler, getDateStringsFromIso } from '@provider';
import { Property, Ticket } from '@types';
import { TextInput } from '@repo/ui';

const SiteHeaderContent = ({id, filters, setFilters, tickets}: SiteHeaderContentComponent) => {
	const {data: objectData} = useQuery(FIND_ALL_PROPERTY, {
		skip: !!id
	});

	const selectOptions = useMemo(() => {	
		const dateOptions = [] as {value: string, label: string}[];
		let objectOptions = [] as {value: string, label: string}[];


		if (objectData) {
			objectOptions =  objectData.objects.findProperty.results.map((property: Property) => ({value: property.objectId, label: property.name}));
		}


		if (tickets && dateOptions.length === 0) {
			tickets.forEach((ticket: Ticket) =>{ 
				if (!dateOptions.find(option => option.label === getDateStringsFromIso(ticket.createdAt).datum)) dateOptions.push({value: ticket.createdAt, label: getDateStringsFromIso(ticket.createdAt).datum});
			});
		}
		return ({dateOptions, objectOptions});
	}, [tickets]);

	return (
		<div className={styles.siteheader_content}>
			<TextInput 
				label=''
				id='objectId'
				defaultValue={filters.find(filterElement => filterElement.key === 'objectId')?.value as string || ''}
				onChange={(value) => setFilters(filterChangeHandler('objectId', value, '_eq', filters))}
				placeholder='Ticket ID...'
				width='120px'
			/>
			{!id && objectData &&
					<Select 
						label=''
						width='150px'
						options={selectOptions.objectOptions}
						value={filters.find(filterElement => filterElement.key === 'property')?.value || null }
						onChange={(value) => setFilters(filterChangeHandler('property', value.value, '_eq', filters))}
						placeholder='Objekt...'
						isClearable
					/>
			}
			{/* <Select 
					label=''
					options={ticket_state_options}
					value={filters.find(filterElement => filterElement.key === 'status')?.value }
					onChange={(value) => setFilters(filterChangeHandler('state', value?.value, '_eq', filters))}
					placeholder='Status...'
					isClearable
				/> */}
			<Select 
				label=''
				options={selectOptions.dateOptions}
				value={filters.find(filterElement => filterElement.key === 'createdAt')?.value || null }
				onChange={(value) => setFilters(filterChangeHandler('createdAt', value.value, '_gte', filters))}
				placeholder='Von...'
				isClearable
			/>
			<Select 
				label=''
				options={selectOptions.dateOptions}
				value={filters.find(filterElement => filterElement.key === 'createdAt')?.value || null }
				onChange={(value) => setFilters(filterChangeHandler('createdAt', value.value, '_lte', filters))}
				placeholder='Bis...'
				isClearable
			/>
		</div>
	);
};

export default SiteHeaderContent;