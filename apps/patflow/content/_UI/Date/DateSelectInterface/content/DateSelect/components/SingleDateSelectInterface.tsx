import React, { useCallback } from 'react';
import { SingleDateSelectInterfaceProps } from '../types';
import { formatISO9075 } from 'date-fns';
import { DateObjectWithNextDates } from '@types';
import { DatePicker } from '@repo/ui';

const SingleDateSelectInterface = ({date, category, onChange}: SingleDateSelectInterfaceProps) => {
	const dateTransformHandler = useCallback((dateString: string) => {
		const dateObject: DateObjectWithNextDates = {
			...date,
			dates: [],
			next_dates: []
		};
		
		if (category === 'opportunity') {
			dateObject.dates = [formatISO9075( new Date(dateString))];
			dateObject.next_dates = [formatISO9075( new Date(dateString), {representation: 'date'})];
		}
		if (category === 'fixed') {
			dateObject.dates = [dateString];
			dateObject.next_dates = [formatISO9075( new Date(dateString), {representation: 'date'})];
		}

		onChange(dateObject);
	}, [category]);

	return (
		<>
			<h3>
				Individuelles Datum
			</h3>
			{category === 'opportunity' ? 
				<div className='row_container'>
					<DatePicker
						defaultValue={date.dates[0] ? formatISO9075(new Date(date.dates[0]), {representation: 'date'}) : ''}
						onChange={dateTransformHandler}
						type='week'
						label='Woche auswählen'
						id='week'
					/>
				</div>
				:
				<div className='row_container'>
					<DatePicker
						defaultValue={date.dates[0] || ''}
						onChange={dateTransformHandler}
						type='datetime'
						label='Termin wählen'
						id='date'
					/>
				</div>
			}
		</>
	);
};

export default SingleDateSelectInterface;