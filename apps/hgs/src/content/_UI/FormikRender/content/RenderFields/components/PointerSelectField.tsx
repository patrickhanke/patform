import React, { useCallback } from 'react';
import styles from '../RenderFields.module.scss';
import { SelectType, optionType } from '@/types';
import {Select} from '@/content/_UI';
import { GroupBase, OptionsOrGroups } from 'react-select';

const PointerSelectField = ({field, getFieldMeta, values, setFieldValue}: SelectType )  => {
	console.log(field);
	console.log(values);
	
	const getOptions = useCallback(() : OptionsOrGroups<{ value: string; label: string; id: string; }, GroupBase<{ value: string; label: string; id: string; }>> | undefined => {
		if (typeof field.select_options !== 'function') {
			return field?.select_options?.map(option=>({...option, value: option.id || option.value}));
		}

		if (typeof field.select_options === 'function') {
			return field?.select_options(values)?.map(option=>({...option, value: option.id || option.value}));
		}
		
		return [];
	}, [values]);

	const getFieldValue = useCallback(() => {
		if (field?.value?.className) {
			return field.select_options.find(option => option.value === values[field.name]?.objectId);
		}
		if (!field?.value?.className && field.value) {
			return field.select_options.find(option => option.value === values[field.name]);
		}

		return undefined;
	}, [field, values]);

	return (
		<>
			<Select 
				onChange={(value: optionType) => setFieldValue(field.name, {__type: 'Pointer', className: field.classname, objectId: value.value }, true)}
				value={getFieldValue()}
				options={getOptions()}
				key={field.name}
				isDisabled={field.disabled ? field.disabled(values) : false}
				placeholder='auswählen...'
				isMulti={field.isMulti || false}
				isClearable={field.is_clearable || false}
			/>
			{getFieldMeta(field.name).touched && getFieldMeta(field.name).error ? 
				<div className={styles.error_message}>{getFieldMeta(field.name).error}</div>
				: 
				null
			}
		</>
	);
};

export default PointerSelectField;