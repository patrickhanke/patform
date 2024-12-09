import React, { useMemo } from 'react';
import styles from './CalendarHeader.module.scss';
import SwitchButtons from '@/_UI/surfaces/SwitchButtons';
import { CalendarHeaderProps, IntervalSelectOptions, ViewState } from './types';
import viewSettings from './constants/view_settings';
import months from '@/content/Record/RecordsOverview/content/WeeklyRecords/constants/months';
import { Select } from '@/_UI/interfaces';

const CalendarHeader = ({view, setView, intervalIndex, setIntervalIndex}: CalendarHeaderProps) => {

	const intervalSelectOptions: IntervalSelectOptions = useMemo(() => {
		const optionsArray = [];
		if (view.value=== 'monthly') {
			for (let i = 0; i < 12; i += 1) {
				optionsArray.push({value: i, label: months[i].label});
			}
		}
		if (view.value === 'quaterly') {
			for (let i = 0; i < 4; i += 1) {
				optionsArray.push({value: i, label: `Quartal ${i + 1}`});
			}
		}

		return optionsArray;
	}, [view]);	

	return (
		<div className={styles.calendar_header_container}>
			<SwitchButtons 
				buttonStates={viewSettings}
				currentStates={view}
				changeHandler={(value) => {
					setView(value as ViewState);
					setIntervalIndex(0);
				}}
			/>
			<Select 
				options={intervalSelectOptions}
				value={intervalIndex}
				onChange={(value) => setIntervalIndex(value.value)}
			/>

		</div>
	);
};

export default CalendarHeader;