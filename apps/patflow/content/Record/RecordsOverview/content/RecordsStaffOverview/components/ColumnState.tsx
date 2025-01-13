import React from 'react';
import { TableData } from '../types';
import { Absence, DayTime } from '@types';
import { StateDisplay } from '@repo/ui';
import { absence_state_options } from '@provider';

const ColumnState = ({type, state} : {type: TableData['type'], state: Absence['state'] | DayTime['state'] | null }) => {

	if (type === 'absence' && state) {
		return (
			<StateDisplay
				state={state}
				type='state'
				stateOptions={absence_state_options}
			/>
		);
	}
	if (type === 'work' && state ) {
		return (
			<StateDisplay
				type='label'
				label='Gebucht'
				color='green'
			/>
		);
	}
	return null;
};

export default ColumnState;