import DatePicker from '@/_UI/interfaces/Date/DatePicker';
import React, { useCallback } from 'react';
import { MultiDateSelectInterfaceProps } from '../types';
import CreateButton from '@/_UI/interfaces/CreateButton';
import { formatISO9075 } from 'date-fns';
import getUpcomingDates from '../functions/getUpcomingDates';
import { DateObjectWithNextDates } from '@/types';

const MultiDateSelectInterface = ({initialValue, category, onChange}: MultiDateSelectInterfaceProps) => {
	const dateTransformHandler = useCallback((date: string, index?: number) => {
		const datesCopy = [...initialValue.dates];
		if (category === 'opportunity') {
			if (typeof index === 'number') {
				datesCopy[index] = date;
			} else {
				datesCopy.push(date);
			}
		}
		
		if (category === 'fixed') {
			if (typeof index === 'number') {
				datesCopy[index] = date;
			} else {
				datesCopy.push(date);
			}
		}

		const dateObject: DateObjectWithNextDates = {
			...initialValue,
			dates: [...datesCopy],
			next_dates: getUpcomingDates(datesCopy).map(date => formatISO9075( new Date(date), {representation: 'date'}))
		};

		onChange(dateObject);
	}, [initialValue, category]);

	return (
		<>
			<label>
				Individuelle Daten
			</label>
			{initialValue?.dates.map((date: string, index: number) => (
				category === 'opportunity' ? 
					<div className='row_container' key={date}>
						<DatePicker
							defaultValue={date}
							onChange={(value) => dateTransformHandler(value, index)}
							type='week'
							label='Woche wählen'
							id='week'
						/>
					</div>
					:
					<div className='row_container' key={date}>
						<DatePicker
							defaultValue={date || ''}
							onChange={(value) => dateTransformHandler(value, index)}
							type='datetime-local'
							label='Termin wählen'
							id='date'
						/>
					</div>
			))}
			<CreateButton
				text='Neues Datum hinzufügen'
				size='small'
				onClick={() => dateTransformHandler('')}
				disabled={initialValue.dates.includes('')}
			/>
		</>
	);
};

export default MultiDateSelectInterface;