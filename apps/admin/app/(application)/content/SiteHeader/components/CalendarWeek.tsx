import { getWeek } from 'date-fns';
import React from 'react';
import styles from '../SiteHeader.module.scss';
import { IoCalendarOutline } from 'react-icons/io5';

const CalendarWeek = () => {
	const week = getWeek(new Date());

	return (
		<div
			role='button'
			aria-hidden="true"
			tabIndex={0}
			className={styles.week_container}
		>
			<IoCalendarOutline />
			<h4 style={{fontSize: '12px', fontWeight: 600}}>KW: {week}</h4>
		</div>
	);
};

export default CalendarWeek;