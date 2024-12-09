import React from 'react';
import { TableData } from '../types';
import { StateDisplay } from '@/_UI';
import { Absence } from '@/types';

const ColumnType = ({type, absenceType} : {type: TableData['type'], absenceType?: Absence['type']}) => {
	if (type === 'absence' && absenceType) {
		return (
			<StateDisplay
				state={absenceType}
				type='AbsenceType'
				color='light'
			/>
		);
	}
	if (type === 'work') {
		return (
			<StateDisplay
				state={type}
				type='DayTime'
				color='green'
				label='Arbeitszeit'
			/>
		);
	}
	return null;
};

export default ColumnType;