import DatePicker from '@/_UI/interfaces/Date/DatePicker';
import { Select } from '@/_UI/interfaces/Selects';
import React from 'react';
import { IntervalDateSelectInterfaceProps } from '../types';
import getDatesFromInterval from '../functions/getDatesFromInterval';
import week_interval_options from '../constants/week_interval_options';
import month_interval_options from '../constants/month_interval_options';
import { DateObject, DateObjectWithNextDates } from '@/types';

type keys = keyof DateObjectWithNextDates;

type value = DateObjectWithNextDates[keys];
type DateObjectCopy = {[key in keys]?: value};

const IntervalDateSelectInterface = ({initialValue, onChange}: IntervalDateSelectInterfaceProps) => {
	const dateTransformHandler = (key: keyof DateObject  , value: value) => {
		const dateObjectCopy: DateObjectCopy = { ...initialValue };
		dateObjectCopy[key] = value;


		dateObjectCopy['dates'] = getDatesFromInterval(dateObjectCopy as DateObjectWithNextDates ).allDates;
		dateObjectCopy['next_dates'] = getDatesFromInterval(dateObjectCopy as DateObjectWithNextDates ).nextDates;

		onChange(dateObjectCopy as DateObjectWithNextDates);
	};

	return (
		<div>
			<DatePicker 
				defaultValue={initialValue.start_date || ''}
				onChange={value => dateTransformHandler('start_date', value)}
				type={'datetime-local'}
				id='start_date'
				label='Startwoche'
			/>
			<DatePicker 
				defaultValue={initialValue.start_date || ''}
				onChange={value => dateTransformHandler('end_date', value)}
				type={'week'}
				id='end_date'
				label='Endwoche'
				disabled={initialValue.start_date === ''}
			/>
			<Select
				label='Interval'
				options={initialValue.type.value === 'weekly' ? week_interval_options : month_interval_options}
				value={initialValue.interval}
				onChange={value => dateTransformHandler('interval', value.value)}
				isDisabled={initialValue.start_date === ''}
				isClearable
			/>
		</div>
	);
};

export default IntervalDateSelectInterface;