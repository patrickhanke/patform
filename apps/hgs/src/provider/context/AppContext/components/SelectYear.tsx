import { Icon } from '@/_UI';
import React, { useMemo } from 'react';
import { SelectYearProps, YearOptions } from '../types';
import { StylesConfig } from 'react-select';
import ReactSelect from 'react-select';

const customStyles = ({width}: {width: string | number}): StylesConfig<YearOptions[number]> => ({
	control: provided => ({
		...provided,
		minHeight: 0,
		border: 'none',
		outline: 'none',
		boxShadow: 'none',
		backgroundColor: 'transparent',
		width
	}),
	valueContainer: provided => ({
		...provided,
		padding: '0px'
	}),
	container: provided => ({
		...provided,
		position: 'relative'
	}),
	clearIndicator: () => ({
		padding: '4px'
	}),
	option: (provided) => ({
		...provided,
		fontFamily: 'Roboto',
		fontWeight: 400,
		fontSize: '10px'
	}),

	menu: provided => ({ 
		...provided, 
		zIndex: 999,
		fontFamily: 'Roboto',
		fontWeight: 400,
		fontSize: '12px'
	}),
	singleValue: provided => ({
		...provided,
		fontFamily: 'Roboto',
		fontWeight: 400,
		fontSize: '12px'
	}),	
	multiValueLabel: provided => ({
		...provided,
		fontFamily: 'Roboto',
		fontWeight: 400,
		fontSize: '12px'
	})	,
	dropdownIndicator: (provided, state) => ({
		...provided,
		padding: '0px', 
		display: !state.isDisabled ? 'auto' : 'none',
		transform: 'scale(0.8)'
	}),
	indicatorSeparator: provided => ({
		...provided,
		display: 'none'
	}),
	indicatorsContainer: (provided, state) => ({
		...provided,
		display: state.isDisabled ? 'none' : 'flex'
	}),
	placeholder: provided => ({ 
		...provided,
		fontFamily: 'Roboto',
		color: '#999999'
	}),
	input: provided => ({
		...provided,
		margin: 0
	})	,
	menuPortal: base => ({ ...base, zIndex: 9999 })
});


const SelectYear = ({year, setYear}: SelectYearProps) => {
    
	const yearOptions:YearOptions  =  useMemo(() => {
		const options: YearOptions = [];
		for (
			let i = new Date().getFullYear() - 1; 
			i <= new Date().getFullYear() + 1; 
			i+=1
		) {
			options.push({
				value: i,
				label: i.toString()
			});
		}
		return options;
    
	}, []);

	return (
		<div className='horizontal_container'>
			<Icon type='calendar' size={12} />
			<ReactSelect<YearOptions[number]>
				options={yearOptions}
				onChange={(value) => {
					if (!value) {
						return;
					}
					setYear(value.value as number);
				}}
				styles={customStyles({width: 60 })}
				isClearable={false}
				value={yearOptions.find(option => option.value === year) || {value: year, label: year.toString()}}
			/>
		</div>
		
	);
};

export default SelectYear;