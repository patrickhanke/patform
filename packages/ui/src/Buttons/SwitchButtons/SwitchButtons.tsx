'use client';

import React from 'react';
import styles from './SwitchButtons.module.scss';
import { Icons } from '@repo/provider';
import { SwitchButtonProps } from './types';

const SwitchButtons: React.FC<SwitchButtonProps> = ({buttonStates, currentStates, changeHandler, underlineButtons = false}) => {
	return (
		<div className={styles.buttons_container} data-underline_buttons={underlineButtons}>

			{buttonStates.map((button, index) => 
				<button
					key={button.value}
					data-isfirst={index === 0}
					data-islast={index + 1 === buttonStates.length }
					data-isactive={currentStates.value === button.value}
					data-isdisabled={button.disabled === true}
					disabled={button.disabled === true}
					onClick={() => changeHandler(button)}
					style={{whiteSpace: 'nowrap'}}
				>
					{button.is_icon ? <Icons icon={button.label} /> : button.label}
				</button>
			)}
		</div>
	);
};

export default SwitchButtons;