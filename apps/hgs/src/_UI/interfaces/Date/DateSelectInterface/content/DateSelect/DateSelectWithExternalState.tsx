import React, { useEffect } from 'react';
import {Select} from '@/_UI';
import { useImmer } from 'use-immer';
import { DateObjectWithNextDates } from '@/types';
import modi_options from './constants/modi_options';
import clsx from 'clsx';
import DateCategories from './components/DateCategories';
import date_category_options from './constants/date_category_options';
import SingleDateSelectInterface from './components/SingleDateSelectInterface';
import MultiDateSelectInterface from './components/MultiDateSelectInterface';
import IntervalDateSelectInterface from './components/IntervalDateSelectInterface';
import { DateSelectExternalStateProps } from './types';
import IntervalInfo from './components/IntervalInfo';

const DateSelectWithExternalState = ({initialValue, dataHandler} : DateSelectExternalStateProps) => {
	const initialDate = {
		type: initialValue?.type || modi_options[0],
		category: initialValue?.category || date_category_options[0],
		interval: initialValue?.interval || 1,
		start_date: initialValue?.start_date ||'',
		end_date: initialValue?.end_date ||'',
		dates: initialValue?.dates || [''],
		weekday: initialValue?.weekday || undefined,
		time: initialValue?.time || undefined
	} as DateObjectWithNextDates ;

	const [date, setDate] = useImmer(initialDate);

	useEffect(() => {
		dataHandler(date);
	}, [date]);

	return (
		<>
			<div className='flexbox_column_with_gap'>
				<div>
					<Select
						label='Interval wählen'
						value={date.type}
						options={modi_options}
						onChange={value => setDate(draft => {
							draft.type = value;
						})}
					/>
					{date.type.value === 'single' && 
						<div className={clsx('info_container', 'margin_top')}>
							<p> Hier kann für eine Aufgabe ein individueller Termin festgelegt werden. </p>
						</div>
					}
					{date.type.value === 'multi' && 
						<div className={clsx('info_container', 'margin_top')}>
							<p> Hier können indiviuelle Termine für eine Aufgabe festgelegt werden. </p>
						</div>
					}
					{(date.type.value === 'weekly' || date.type.value === 'monthly') && 
						<div className={clsx('info_container', 'margin_top')}>
							<p> Hier können Intervalle für eine Aufgabe festgelegt werden </p>
						</div>
					}
				</div>
				<div>
					<label>Kategorie wählen</label>
					<DateCategories 
						initialValue={date.category} 
						onChange={value => setDate(draft => {
							draft.category = value;
						})}
					/>
				</div>
				<div>
					{date.type.value === 'single' && <SingleDateSelectInterface initialValue={date} category={date.category.value} onChange={(newDate: DateObjectWithNextDates) => setDate(newDate)} />}
					{date.type.value === 'multi' &&  <MultiDateSelectInterface initialValue={date} category={date.category.value} onChange={(newDate: DateObjectWithNextDates) => setDate(newDate)} />}
					{(date.type.value === 'weekly' || date.type.value === 'monthly') &&  <IntervalDateSelectInterface initialValue={date} category={date.category.value} onChange={(newDate: DateObjectWithNextDates) => setDate(newDate)} />}
					{date.type.value === 'weekly' || date.type.value === 'monthly' && <IntervalInfo dates={date.dates} />}
				</div>
			</div>
			
		</>
	);
};

export default DateSelectWithExternalState;