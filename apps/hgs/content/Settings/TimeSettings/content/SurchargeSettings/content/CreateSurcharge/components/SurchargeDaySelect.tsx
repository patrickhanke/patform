import React, { useCallback } from 'react';
import { SurchargeDaySelectProps } from '../types';
import '../CreateSurcharge.scss';
import { weekdays } from '@/provider';

const SurchargeDaySelect: React.FC<SurchargeDaySelectProps> = ({surchargeChangeHandler, newSurcharge, holidays = []}) => {
	const dayChangeHandler = useCallback((day: string) => { 
		if(newSurcharge.day_value.includes(day)) {
			surchargeChangeHandler('day_value', newSurcharge.day_value.filter(dayToFind => dayToFind !== day));
		}
		else {
			surchargeChangeHandler('day_value', [...newSurcharge.day_value, day]);
		}
	}, [newSurcharge]);
    
	return (
		<div className='create_surcharge_container' >
			<h3>Feiertage</h3>
			{holidays.map((day) => (
				<button
					onClick={() => dayChangeHandler(day.objectId)}
					className='day_select_container'
					data-isselected={newSurcharge.day_value.findIndex(dayToFind => dayToFind === day.objectId) !== -1}
					key={day.objectId}
				>
					<span>{day.name}</span>
				</button>
			))}
			<h3>Wochentage</h3>
			{weekdays.map((day) => (
				<button 
					onClick={() => dayChangeHandler(day.value)}
					className='day_select_container'
					data-isselected={newSurcharge.day_value.findIndex(dayToFind => dayToFind === day.value) !== -1}
					key={day.value}
				>
					{day.label}
				</button>
			))
                        
			}

		</div>
	);
};

export default SurchargeDaySelect;