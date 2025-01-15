import React from 'react';
import { TableData } from '../types';
import { Absence } from '@types';
import { StateSelect } from '@repo/ui';
import { absence_type_options, daytime_state_options } from '@provider';

const ColumnType = ({type, absenceType} : {type: TableData['type'], absenceType?: Absence['type']}) => {
	if (type === 'absence' && absenceType) {
		return (
			<StateSelect
				state={absenceType}
				type='state'
				color='light'
				stateOptions={absence_type_options}
			/>
		);
	}
	if (type === 'work') {
		return (
			<StateSelect
				state={type}
				type='state'
				color='green'
				stateOptions={daytime_state_options}
			/>
		);
	}
	return null;
};

export default ColumnType;