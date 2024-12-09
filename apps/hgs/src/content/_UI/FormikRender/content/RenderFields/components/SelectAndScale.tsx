import React, { useCallback, useMemo } from 'react';
import styles from '../RenderFields.module.scss';
import Checkbox from './Checkbox';
import { FormComponents } from '@/types/_UI';

const SelectAndScale = ({field, value, setFieldValue} : FormComponents.FormSelectAndScaleComponent) => {
	const renderNumbers = useMemo(() => {
		const numberArray = [];
		for(let n = 1; n <= Number(field.options?.scale_end_value); n+=1 ) {
			numberArray.push({
				value: n,
				label: n.toString()
			});
		}  
		
		return numberArray;
	}, [field]);

	const setScaleValue = useCallback((key: string, newValue: number | string) => {
		const valuesCopy = [...value];
		
		if (valuesCopy.length === 0){
			valuesCopy.push('');
			valuesCopy.push(NaN);
		}
		
		if (key === 'select') {
			setFieldValue(field.name, [newValue, valuesCopy[1] ]);
		}
		if (key === 'scale') {
			setFieldValue(field.name, [valuesCopy[0], newValue ]);
		}
	}, [field, value]);

	return (
		<>
			<div className={styles.select_and_scale_container}>
				<div className={styles.select_container}>
					{field.options.select_options.map(option => 
						<Checkbox
							key={option.id}
							option={option}
							value={value[0]}
							valueChangeHandler={() => setScaleValue('select', option.id)}
						/>
					)}
				</div>
				<label>
					{field.options.scale_label}
				</label>
				<div className={styles.scale_container} >
					{renderNumbers.map(numberObject => (
						<div 
							key={numberObject.label} 
							className={styles.scale_number}
							data-selected={numberObject.value === value[1]}
							onClick={() => setScaleValue('scale', numberObject.value)}
						>
							{numberObject.label}
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default SelectAndScale;