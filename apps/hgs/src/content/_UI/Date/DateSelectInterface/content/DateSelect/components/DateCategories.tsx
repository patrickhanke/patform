import { SwitchButtons } from '@/_UI/surfaces';
import React from 'react';
import date_category_options from '../constants/date_category_options';
import { DateCategoriesProps } from '../types';

const DateCategories = ({initialValue, onChange}: DateCategoriesProps) => {
	return (
		<div>
			<SwitchButtons 
				buttonStates={date_category_options} 
				changeHandler={value => onChange(value)} 
				currentStates={initialValue || date_category_options[0]}
			/>
		</div>
	);
};

export default DateCategories;