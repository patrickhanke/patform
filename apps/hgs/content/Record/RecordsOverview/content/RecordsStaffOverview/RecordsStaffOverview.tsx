import React, { useCallback, useMemo } from 'react';
import { DayData, RecordsStaffOverviwProps, StaffOption, TableData } from './types';
import SiteHeaderContent from './components/SiteHeaderContent';
import { eachDayOfInterval, formatISO9075, isWeekend } from 'date-fns';
import useTableColumns from './hooks/useTableColumns';
import { Row } from '@tanstack/react-table';
import site_states from './constants/site_states';
import StaffRecord from './content/StaffRecord';
import { months } from '@/provider';
import useGetDay from './hooks/useGetDay';
import { SiteHeader, Table } from '@repo/ui';
import { SiteState } from '@repo/types';

const RecordsStaffOverview = ({year} : RecordsStaffOverviwProps) => {
	const [selectedMonth, setSelectedMonth] = React.useState<typeof months[number]>(months.find(month => month.id === new Date().getMonth()) as typeof months[number]);
	const [selectedUser, setSelectedUser] = React.useState<StaffOption | null>(null);
	const [displayState, setDisplayState] = React.useState<SiteState>(site_states[0] as SiteState);
	const {days} = useGetDay({year, user: selectedUser?.value});
	const columns = useTableColumns();
	

	const siteHeaderContent = useMemo(() => (
		<SiteHeaderContent 
			displayStates={site_states}
			displayState={displayState}
			setDisplayState={setDisplayState}
			setSelectedMonth={setSelectedMonth}
			selectedMonth={selectedMonth}
			setSelectedUser={setSelectedUser}
			selectedUser={selectedUser}
		/>
	), [selectedMonth, selectedUser, displayState]);

	const rowStyles = useCallback((row: Row<TableData>) => {
		if (isWeekend(row.original.date)) {
			return {backgroundColor: '#f0f0f0'};
		}
		return {backgroundColor: 'transparent'};
	}, []);

	const tableData = useMemo(() => {
		const interval: DayData[] = [];
		const startDay = new Date(year, selectedMonth.id, 1);
		const endDay = new Date(year, selectedMonth.id + 1, 0);
		const dayInterval = eachDayOfInterval({
			start: startDay,    
			end: endDay
		}, {step: 1});

		dayInterval.forEach((element: Date) =>{
			const daysToFind = days.filter(day => day.date === formatISO9075(element, {representation: 'date'}));
			
			if (daysToFind.length === 1 && daysToFind[0]) {
				interval.push({
					date: daysToFind[0].date,
					is_working_day: daysToFind[0].is_working_day,
					default_time: daysToFind[0].default_time,
					time: daysToFind[0].time,
					absence: daysToFind[0].absence,
					type: daysToFind[0].type
				});
			} else if (daysToFind.length > 1 && daysToFind[0]) {
				interval.push({
					date: formatISO9075(element, {representation: 'date'}),
					is_working_day: true,
					default_time: daysToFind[0].default_time,
					time: daysToFind.map(day => day.time),
					absence: null,
					type: daysToFind[0].type
				});
				
			} 
			else {
				interval.push({
					date: formatISO9075(element, {representation: 'date'}),
					is_working_day: false,
					default_time: null,
					time: undefined,
					absence: null,
					type: 'initial'
				});
			}
		
		}); 
		
		return interval;
	}, [days, selectedMonth, year]);

	return (
		<>
			<SiteHeader isSubHeader siteHeaderContent={siteHeaderContent} />
			<div className='site_content'>
				{selectedUser ? ( 
					<>
						{displayState.value === 'table' && (
							<div className='content_element no_padding'>
								<Table data={tableData} columns={columns} rowStyles={rowStyles} />
							</div>
						)}
						{displayState.value === 'list' && ( 
							<StaffRecord
								days={days}
								month={selectedMonth}
								year={year}
								user={selectedUser}
							/>
						)}
					</>
				) :
					<div>
						<p>Bitte wählen Sie einen Mitarbeiter aus</p>
					</div>	
				}
			</div>
		</>
	);
};

export default RecordsStaffOverview;