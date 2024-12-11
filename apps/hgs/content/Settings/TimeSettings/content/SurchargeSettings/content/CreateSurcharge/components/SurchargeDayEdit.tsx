import React from 'react';
import { SurchargeDayEditProps } from '../types';
import { weekdays } from '@provider';
import { Divider } from '@content';
import { Holiday, Weekdays } from '@types';

const SurchargeDayEdit: React.FC<SurchargeDayEditProps> = ({newSurcharge, holidays = [], surchargeChangeHandler}) => {
	const daysArray = [...holidays, ...weekdays];   
	const findDay: (day: string) => Holiday | Weekdays[number] | undefined = (day: string) => daysArray.find(dayToFind => (dayToFind.objectId === day ));
    
	return (
		<>
			<div className='horizontal_container'>
				<label htmlFor='value'>Wert</label>
				<input
					type='number'
					id='value'
					defaultValue={newSurcharge.value}
					onChange={e => surchargeChangeHandler('value', Number(e.target.value))}
				/>
			</div>
			<div className='create_surcharge_container'>
				<Divider text='Ausgewählte Tage' />
				{newSurcharge.day_value.length > 0 ? newSurcharge.day_value.map((id) => (
					<p key={id}> - {findDay(id)?.name || id}</p>
				))
					: 
					<p>
                    Noch keine Tage ausgewählt
					</p>
				}
			</div>
		</>
	);
};

export default SurchargeDayEdit;