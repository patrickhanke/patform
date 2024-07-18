import React, { ForwardRefRenderFunction } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';

import { getIsoFromDate } from '@/provider';
import de from 'date-fns/locale/de';
import styles from '../RenderFields.module.scss';
import { CustomInputType, DatePickerType } from '../types';

registerLocale('de', de);

const CustomInput: ForwardRefRenderFunction<HTMLButtonElement, CustomInputType> = (({ value }, ref) => (
	<button 
		ref={ref} 
	>
        {getIsoFromDate(value) || 'Datum wählen'}
    </button>
));

const DatePicker = ({ value = new Date(), onChange, labelBefore = false, label, showTime = true, showMonthDropdown = true, showYearDropdown = true, showAsButton = true, isDisabled = false }: DatePickerType) => (
	<div className={styles.toggle_container} data-labelBefore={labelBefore} >
		{label && <label htmlFor={label.toLowerCase()} > {label} </label>}
		<ReactDatePicker
			showTimeSelect={showTime}
			todayButton
			locale={de}
			selected={value || null || undefined}
			onChange={(val : Date) => {
				onChange(getIsoFromDate(val));
			}}
			customInput={showAsButton ? <CustomInput value={undefined}/> : undefined}
			showFourColumnMonthYearPicker
			dateFormat={showTime ? 'dd.MM.yyyy HH:mm' : 'dd.MM.yyyy'}
			dateFormatCalendar="MMMM yyyy"
			yearDropdownItemNumber={60}
			scrollableYearDropdown
			showMonthDropdown={showMonthDropdown}
			showYearDropdown={showYearDropdown}
			disabled={isDisabled}
		/>
	</div>
);

export default DatePicker;