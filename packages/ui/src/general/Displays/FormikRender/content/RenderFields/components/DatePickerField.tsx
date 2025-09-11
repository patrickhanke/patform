import { FC } from "react";

import styles from "../RenderFields.module.scss";
import { DatePicker } from "@repo/ui";
import { DatePickerFieldProps } from "../types";

const DatePickerField: FC<DatePickerFieldProps> = ({
	value,
	onChange,
	type
}) => {
	return (
		<div className={styles.datepicker_content}>
			<DatePicker
				defaultValue={value}
				onChange={(value) => onChange(value)}
				type={type}
			/>
		</div>
	);
};

export default DatePickerField;
