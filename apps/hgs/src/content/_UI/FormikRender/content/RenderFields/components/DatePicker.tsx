import React, { Ref, forwardRef } from 'react';

import { getIsoFromDate } from '@/provider';
import de from 'date-fns/locale/de';
import styles from '../RenderFields.module.scss';
import { DatePickerType } from '@/types';
import { DatePicker } from '@/_UI/interfaces';


const DatePickerForm = ({ value = getIsoFromDate(new Date()), onChange, labelBefore = false, showTime = true, showMonthDropdown = true, showYearDropdown = true, showAsButton = true, isDisabled = false }: DatePickerType) => {
	
	return (
		<div className={styles.datepicker_content} data-labelbefore={labelBefore} >
			<DatePicker defaultValue={value} onChange={value => onChange(value)} />
		</div>
	);
};
export default DatePickerForm;
