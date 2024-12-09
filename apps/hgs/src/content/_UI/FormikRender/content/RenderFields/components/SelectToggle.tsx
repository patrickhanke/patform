import React from 'react';
import styles from '../RenderFields.module.scss';

const SelectToggle = ({value, valueChangeHandler, disabled, labelBefore}) => {
	
	return (
		<div className={styles.select_toggle_content} data-labelbefore={labelBefore}>
			
			<div
				onClick={() => valueChangeHandler(false)}
				className={styles.select_toggle_button}
				data-isactive={value === false}
				disabled={disabled}
			>
                Nein
			</div>
			<div
				onClick={() => valueChangeHandler(true)}
				className={styles.select_toggle_button}
				data-isactive={value === true}
				disabled={disabled}
			>
                Ja
			</div>
		</div>
	);
};

export default SelectToggle;