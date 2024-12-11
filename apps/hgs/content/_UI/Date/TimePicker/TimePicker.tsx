import React from 'react';
import { TimePickerProps } from './types';

const TimePicker = ({defaultValue, onChange, label, id, disabled = false, width = 150}: TimePickerProps) => {
	return (
		<>			
			<label htmlFor={id}>{label}</label>
			<input
				aria-label="Time"
				id={id} 
				name={id}
				type='time'
				style={{width}}
				onChange={(e) => onChange(e.target.value)}
				defaultValue={defaultValue}
				step={undefined}
				disabled={disabled}
			/>
		</>
	);
};

export default TimePicker;