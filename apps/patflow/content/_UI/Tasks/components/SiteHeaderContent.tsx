import React, { Suspense, useMemo } from 'react';
import { Property, StaffMember } from '@types';
import { FIND_ALL_PROPERTY, FIND_ALL_STAFF } from '@queries';
import { useQuery } from '@apollo/client';
import { SiteHeaderContentComponent } from '../types';
import styles from '../Tasks.module.scss';
import { filterChangeHandler } from '@provider';
import { Select, TextInput } from '@repo/ui';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const SiteHeaderContent = ({id, filters, setFilters, initialFilters}: SiteHeaderContentComponent) => {
	const {data: objectData} = useQuery(FIND_ALL_PROPERTY, {
		skip: !!id
	});

	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const {data: staffData} = useQuery(FIND_ALL_STAFF);
	const selectOptions = useMemo(() => {	
		let objectOptions = [] as {value: string, label: string}[];
		let staffOptions = [] as {value: string, label: string}[];

		if (objectData) {
			objectOptions =  objectData.objects.findProperty.results.map((property: Property) => ({value: property.objectId, label: property.name}));
		}
		if (staffData) {
			staffOptions =  staffData.objects.find_User.results.map((staff: StaffMember) => ({value: staff.objectId, label: `${staff.first_name} ${staff.family_name}`}));
		}
		
		return ({objectOptions, staffOptions});
	}, [objectData, staffData]);

	return (
		<div className={styles.siteheader_content}>
			<div className='button_container'>
				{/* <SwitchButtons
					buttonStates={[
						{label: 'extended_list', value: 'extended', is_icon: true},
						{label: 'small_list', value: 'compact', is_icon: true}
					]}
					currentStates={view}
					changeHandler={(value) => setView(value as ViewState)}
				/> */}
				<TextInput
					label=''
					id='objectId'
					defaultValue={filters.find(filterElement => filterElement.key === 'objectId')?.value as string || ''}
					onChange={(value) => setFilters(filterChangeHandler('objectId', value, '_eq', filters))}
					placeholder='Task ID...'
					width='120px'
				/>
				{/* <Select
					label=''
					width='150px'
					options={task_date_options}
					value={filters.find(filterElement => filterElement.key === 'dates')?.id }
					onChange={(value) => setFilters(filterChangeHandler('dates', getDateArray(value?.value).returnValue, getDateArray(value?.value).operator, filters, value?.value))}
					placeholder='Zeitraum...'
					isClearable
				/> */}
				{/* {siteType === 'active' &&
						<Select
							label=''
							width='150px'
							options={[...task_state_options.slice(0, 3)]}
							value={filters.find(filterElement => filterElement.key === 'status')?.value }
							onChange={(value) => setFilters(filterChangeHandler('state', value?.value, '_eq', filters))}
							placeholder='Status...'
							isClearable
						/>
				} */}
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
				{staffData &&
					<Select
						label=''
						width='150px'
						options={selectOptions.staffOptions}
						value={filters.find(filterElement => filterElement.key === 'assigned_staff')?.value || null }
						onChange={(value) => setFilters(filterChangeHandler('assigned_staff', value.value, '_in', filters))}
						placeholder='Mitarbeiter...'
						isClearable
					/>
				}
			</div>
			<button
			className='full_button md secondary'
			onClick={() => {
				if (searchParams.get('task')) {
					router.push(pathname);
				}
				setFilters(initialFilters());
			}}>
				Filter zurücksetzen
			</button>
		</div>
	);
};

export default SiteHeaderContent;