'use client';

import React, { useCallback } from 'react';
import './styles.scss';
import { StatelessToggleProps } from './types';

const StatelessToggle = ({ onChange, value, disabled = false, label }: StatelessToggleProps) => {
    
	const dataHandler = useCallback(async () => {
		onChange(!value);
	}, [value]);

	return (
		<div className='toggle-container'>
			{label && <label >{label}</label>}
			<div className='toggle-switch'>
				<input
					type="checkbox"
					checked={value}
					onChange={dataHandler}
					disabled={disabled}
				/>
				<span className='toggle-slider'></span>
			</div>
		</div>
	);
};

export default StatelessToggle;
