import { DateTypes } from '@types';
import React from 'react';
import { MdEventRepeat } from 'react-icons/md';
import styles from './TimeDisplay.module.scss';
import clsx from 'clsx';

const TimeDisplay = ({date, onClick}: {date: DateTypes.DateObject, onClick?: () => void}) => {
	return (
		<button className={clsx('full_button', 'md', 'primary')} data-interval={date.type?.label ? true : false} onClick={onClick}>
			<MdEventRepeat /> 
			{date?.type ? 
				<div className={clsx(styles.interval, 'label')}>{date.type?.label}</div>
				: 
				<div className={clsx(styles.no_interval, 'label')}>Keine Angabe</div>
			}
		</button>
	);
};

export default TimeDisplay;