import React from 'react';
import { DayData } from '../types';
import { convertMillisecondsToString } from '@provider';
import { isArray } from 'lodash';

const ColumnWorkingHours = ({type, date} : {type: DayData['type'], date: DayData}) => {
	if (type === 'work' && date.time) {
		if (isArray(date.time)) {
			return (
				<div>
					{date.time.map((timeValue, index, dateTimeArray) => {
						if (!timeValue) {
							return null;
						} else {

							return (
								<>
									<span key={timeValue.start}>{convertMillisecondsToString(timeValue.duration - timeValue.pause)} ({convertMillisecondsToString(timeValue.duration)})</span>
									{index !== dateTimeArray.length - 1 && <span> / </span>}
								</>
							);
						}
					})}
				</div>
			);
		} else return (
			<div>{convertMillisecondsToString(date.time.duration - date.time.pause)} ({convertMillisecondsToString(date.time.duration)})</div>
		);
	}
	if (type === 'absence' &&  date.default_time) {
		return (
			<div>{convertMillisecondsToString(date.default_time.duration - date.default_time.pause)} ({convertMillisecondsToString(date.default_time.duration)})</div>
		);
	}
	return null;
};

export default ColumnWorkingHours;