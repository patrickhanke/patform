import React, { useCallback } from 'react';
import styles from './Toggle.module.scss';

const StatelessToggle = ({ onChange, value, disabled = false }: { onChange: (value: boolean) => void, value: boolean, disabled?: boolean }) => {
    
	const dataHandler = useCallback(async () => {
		onChange(!value);
	}, [value]);

	return (
		<div className={styles['toggle-container']}>
			<label className={styles['toggle-switch']}>
				<input
					type="checkbox"
					checked={value}
					onChange={dataHandler}
					disabled={disabled}
				/>
				<span className={styles['toggle-slider']}></span>
			</label>
		</div>
	);
};

export default React.memo(StatelessToggle);
