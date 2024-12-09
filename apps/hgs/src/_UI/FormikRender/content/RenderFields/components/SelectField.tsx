import React, { useCallback } from 'react';
import styles from '../RenderFields.module.scss';
import { SelectType, optionType } from '@/types';
import {Select} from '@/_UI';
import { GroupBase, OptionsOrGroups } from 'react-select';

const SelectField = ({field, getFieldMeta, getSelectValue, values, setFieldValue, disabled}: SelectType )  => {

	const getOptions = useCallback(() : OptionsOrGroups<{ value: string; label: string; id: string; }, GroupBase<{ value: string; label: string; id: string; }>> | undefined => {
		if (typeof field.select_options !== 'function') {
			return field?.select_options?.map(option=>({...option, value: option.id || option.value}));
		}

		if (typeof field.select_options === 'function') {
			return field?.select_options(values)?.map(option=>({...option, value: option.id || option.value}));
		}
		
		return [];
	}, [values]);

	

	return (
		<>
			<Select 
			
				onChange={(value: optionType) => {
					if (field.side_effect && field.side_effect.length > 0) {
						field.side_effect.forEach(effect => {
							setFieldValue(effect.field, effect.value);
						});
					}
					if (value !== null) {
						setFieldValue(field.name, field.dataType === 'string' ?  value.value : value, true);
					}
					if (value === null) {
						setFieldValue(field.name, field.dataType === 'string' ?  '' : {}, true);
					}
				}}
				value={getSelectValue(values, field)}
				options={getOptions()}
				key={field.name}
				isDisabled={disabled}
				placeholder='auswählen...'
				isMulti={field.isMulti || false}
				isClearable={field.is_clearable || false}
				// menuPosition={field?.menu_position || 'absolute'}
				
			/>
			{getFieldMeta(field.name).touched && getFieldMeta(field.name).error ? 
				<div className={styles.error_message}>{getFieldMeta(field.name).error}</div>
				: 
				null
			}
		</>
	);
};

export default SelectField;