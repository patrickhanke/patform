'use client';

import './styles.scss';
import { SwitchButtonsProps } from './types';

const SwitchButtons = ({buttonStates, currentStates, changeHandler, underlineButtons}: SwitchButtonsProps) => {
	return (
		<div className={'buttons_container'} data-underline_buttons={underlineButtons}>
			{buttonStates.map((button, index) => 
				<button
					key={button.value}
					data-isfirst={index === 0}
					data-islast={index + 1 === buttonStates.length }
					data-isactive={currentStates?.value === button.value}
					data-isdisabled={button.disabled === true}
					disabled={button.disabled === true}
					onClick={() => changeHandler(button)}
					style={{whiteSpace: 'nowrap'}}
				>
					{button.label}
				</button>
			)}
		</div>
	);
};

export default SwitchButtons;