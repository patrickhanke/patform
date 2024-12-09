import React, { useMemo } from 'react';
import styles from '../RenderFields.module.scss';
import { FormComponents } from '@/types/_UI';

const Scale = ({field, values, setFieldValue}: FormComponents.FormScaleComponent) => {
	const renderNumbers = useMemo(() => {
		const numberArray = [];
		for(let n = field.options?.scale_start_value; n <= Number(field.options?.scale_end_value); n+=1 ) {
			numberArray.push({
				value: n,
				label: n.toString()
			});
		}  

		return numberArray;
	}, [field]);

	return (
		<div className={styles.scale_container}>
			{renderNumbers.map(numberObject => (
				<div 
					key={numberObject.label} 
					data-selected={numberObject.value === values[field.name]}
					onClick={() => setFieldValue(field.name, numberObject.value, true)}
					className={styles.scale_number}
				>
					{numberObject.label}
				</div>
			))}
		</div>
	);
};

export default Scale;