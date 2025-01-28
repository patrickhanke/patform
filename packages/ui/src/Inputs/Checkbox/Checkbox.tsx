import React from 'react';
import styles from './Checkbox.module.scss';

interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label }) => {
	const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChange(event.target.checked);
	};

	return (
		<label className={styles.checkbox_container}>
			<input
				type="checkbox"
				checked={checked}
				onChange={handleCheckboxChange}
			/>
			<span className="checkmark"></span>
			{label && <span className="label-text">{label}</span>}
		</label>
	);
};

export default Checkbox;