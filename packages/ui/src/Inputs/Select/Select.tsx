'use client';

import ReactSelect from 'react-select';
import { SelectType } from './types';
import './styles.scss';
import customStyles from './constants/styles';
import { ErrorDisplay } from '../../Displays';
import { isArray } from 'lodash';

const Select = ({onChange, value, placeholder, options, isMulti = false, isDisabled = false, isClearable = false, menuPosition = 'absolute', label, id, errors, width = 150}: SelectType) => {
	const valueBoundryHandler = (value: object | string | null) => {
		if (isArray(value)) {
			return value.map((val: string) => options?.find(option => option.value === val) || null);
		} else {

			if (typeof value === 'object' && value !== null) {
				return value;
			} else if (typeof value === 'string') {
				return options?.find(option => option.value === value) || null;
			}
		}
		return value;
	};

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
				className={'react_select_container'}
				classNamePrefix="react-select"
				styles={customStyles({width})}
				// menuPosition={menuPosition}
				menuPosition="fixed"  // This makes the menu position fixed
				menuPlacement="auto"	
			/>
			<ErrorDisplay errors={errors} id={id} />
		</>
	);
};

export default Select;