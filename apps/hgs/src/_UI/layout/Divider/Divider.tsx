import React from 'react';
import styles from './Divider.module.scss';
import { DividerProps } from './types';
import { differenceInDays, isToday, isYesterday } from 'date-fns';

const Divider = ({size ='medium', showLine = true, text, date, type = 'line'} : DividerProps) => {
	const getDate = (date: string | undefined) => {
		if (date === undefined) return;
		if (date === null) {
			return 'Kein Datum';
		}

		const dateObj = new Date(date);
		if (isToday(dateObj)) {
			return 'Heute';
		}
		if (isYesterday(dateObj)) {
			return 'Gestern';
		}
		if (differenceInDays(new Date(), dateObj) === 2) {
			return 'Vorgestern';
		}
		return dateObj.toLocaleDateString('de-DE');
	};

	if (type === 'block') {
		return (
			<div className={styles.divider_block} data-size={size} data-showline={showLine} >
				{text && <div className={styles.divider_block_text_container}><h4>{text}</h4></div>}
				{getDate(date) && <div className={styles.divider_block_text_container}><h4>{getDate(date)}</h4></div>}
			</div>
		);
	}

	return (
		<div className={styles.divider} data-size={size} data-showline={showLine} >
			{text && <div className={styles.text_container}>{text}</div>}
			{getDate(date) && <div className={styles.text_container}>{getDate(date)}</div>}
		</div>
	);
};

export default Divider;