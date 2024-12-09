import React, { useEffect, useState } from 'react';
import ReactSelect from 'react-select';
import { SelectType } from './types';
import styles from './Select.module.scss';
import { ErrorDisplay } from '@/_UI/surfaces';
import customStyles from './constants/styles';

const Select = ({onChange, value, placeholder, options, isMulti = false, isDisabled = false, isClearable = false, label, id, errors, width = 150}: SelectType) => {
	const [doc, setDoc] = useState<HTMLElement | null>(null);
	
	const valueBoundryHandler = (value: object | string | null) => {
		if (typeof value === 'object' && value !== null) {
			return value;
		} else if (typeof value === 'string' || typeof value === 'number') {
			return options?.find(option => option.value === value) || null;
		}
		return value;
	};

	useEffect(() => {
		const element = document?.body;
		if (element) {
			setDoc(element);
		}
	}, []);

	return (
		<>
			{label && <label htmlFor={id}>{label}</label>}
			<ReactSelect
				id={id}
				value={valueBoundryHandler(value)}
				onChange={(inputValue, action) => onChange(inputValue, action)}
				options={options}
				isMulti={isMulti}
				isDisabled={isDisabled}
				isClearable={isClearable}
				placeholder={placeholder}
				className={styles.react_select_container}
				classNamePrefix="react-select"
				styles={customStyles({width})}
				// menuPortalTarget={doc}
				menuPosition="fixed"  
				menuPlacement="auto"
			/>
			<ErrorDisplay errors={errors} id={id} />
		</>
	);
};

export default Select;