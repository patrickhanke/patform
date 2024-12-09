import React from 'react';
import { TableData } from '../types';
import { StateDisplay } from '@/_UI';
import { Absence, DayTime } from '@/types';

const ColumnState = ({type, state} : {type: TableData['type'], state: Absence['state'] | DayTime['state'] | null }) => {

	if (type === 'absence' && state) {
		return (
			<StateDisplay
				state={state}
				type='Absence'
			/>
		);
	}
	if (type === 'work' && state ) {
		return (
			<StateDisplay
				label='Gebucht'
				color='green'
			/>
		);
	}
	return null;
};

export default ColumnState;