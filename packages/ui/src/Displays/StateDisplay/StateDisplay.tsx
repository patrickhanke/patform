'use client';

import { FC } from 'react';
import { StateDisplayProps } from './types';
import styles from './StateDisplay.module.scss';
import {Icon} from '@repo/ui';

const StateDisplay: FC<StateDisplayProps> = ({
	label, 
	color, 
	icon, 
	onClick,
	width
}) => {
	console.log(color);
	
	return (
		<div 
			onClick={onClick} 
			className={styles.state_display_container}
			data-color={color}
			style={{width: width || 'fit-content'}}
		>
			{icon && <Icon type={icon} />}
			{label}
		</div>
	);
};

export default StateDisplay;