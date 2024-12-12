import React from 'react';
import { DateDisplayComponent } from './types';
import styles from './DateDisplay.module.scss';
import { getDateStringsFromIso } from '@repo/provider';
import { IoCalendarOutline } from 'react-icons/io5';
import { CiClock2 } from 'react-icons/ci';

const DateDisplay = ({date, displayType} : DateDisplayComponent) => {
	return (
		<div className={styles.date_display_container}>
			{displayType === 'date' || displayType === 'date-and-time' && <div className={styles.date_element}><IoCalendarOutline /> {getDateStringsFromIso(date).datum}</div>}
			{displayType === 'time' || displayType === 'date-and-time' && <div className={styles.date_element}><CiClock2 /> {getDateStringsFromIso(date).uhrzeit}</div>}
		</div>
	);
};

export default DateDisplay;