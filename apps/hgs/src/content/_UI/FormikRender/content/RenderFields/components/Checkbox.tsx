import React from 'react';
import styles from '../RenderFields.module.scss';
import { Check } from 'lucide-react';
import { FormComponents } from '@/types/_UI';

const Checkbox = ({value, valueChangeHandler, option}: FormComponents.FormCheckboxContainer) => {
	return (
		<div className={styles.checkbox_container} onClick={() => valueChangeHandler()}>
			<div className={styles.checkbox} data-active={value === option.id} >
				<Check />
			</div>
			<p>
				{option.label}
			</p>
		</div>
	);
};

export default Checkbox;