'use client';

import { SiteHeader } from '@/content/_UI';
import React, { useContext, useState } from 'react';
import useGetRecords from './hooks/useGetRecords';
import initialFilters from './constants/initialFilters';
import WeeklyRecords from './content/WeeklyRecords/WeeklyRecords';
import siteStates from './constants/site_states';
import RecordsCalendar from './content/RecordsCalendar';
import RecordsAbsence from './content/RecordsAbsence';
import RecordsStaffOverview from './content/RecordsStaffOverview';
import { AppContext } from '@/provider';
import { Filter } from '@/types';
import RecordsSettings from './content/RecordsSettings';

const RecordsOverview = () => {
	const {year} = useContext(AppContext);
	const [filters, setFilters] = React.useState(initialFilters(year) as Filter[]);
	const {records, loading, refetch} = useGetRecords({filters});
	const [siteState, setSiteState] = useState(siteStates[0]);

	if (!records) {
		return null;
	}

	return (
		<>
			<SiteHeader
				title='Zeiterfassung'
				hasSiteNavigation
				navItems={siteStates} 
				navCurrentItem={siteState} 
				navOnClick={setSiteState}
			/>
			
			{siteState.value === 'weeks' && ( 
				<WeeklyRecords
					records={records}
					refetch={refetch}
					loading={loading}
					filters={filters}
					setFilters={setFilters}
				/>
			)}
			{siteState.value === 'workers' && ( 
				<RecordsStaffOverview
					year={year}
				/>
			)}
			{siteState.value === 'absence' && ( 
				<RecordsAbsence
					records={records}
					refetch={refetch}
					loading={loading}
					filters={filters}
					setFilters={setFilters}
				/>
			)}
			{siteState.value === 'calendar' && ( 
				<RecordsCalendar
					records={records}
				/>
			)}
			{siteState.value === 'settings' && ( 
				<RecordsSettings />
			)}
		</>
	);
};

export default RecordsOverview;