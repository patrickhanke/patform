import React, { useCallback, useEffect, useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import styles from '../RenderFields.module.scss';
import { useDebounceValue, useOnClickOutside } from 'usehooks-ts';

const ColorPicker = ({color, valueChangeHandler } : {color: string, valueChangeHandler: (value: string) => void, disabled: boolean }) => {
	const [debouncedValue, setPickerValue] = useDebounceValue(color, 400);

	const popover = useRef(null);
	const [isOpen, toggle] = useState(false);

	const close = useCallback(() => toggle(false), []);
	useOnClickOutside(popover, close);

	useEffect(() => {
		if (debouncedValue !== color ) {
			valueChangeHandler(debouncedValue);
		}
	}, [debouncedValue]);

	// useEffect(() => {
	// 	setPickerValue(color);
	// }, [color]);
    
	return (
		<div className={styles.picker}>
			<div
				className={styles.swatch}
				style={{ backgroundColor: color }}
				onClick={() => toggle(true)}
			/>

			{isOpen && (
				<div className={styles.popover} ref={popover}>
					<HexColorPicker color={color} onChange={value => setPickerValue(value)} />
				</div>
			)}
		</div>
		// <div className={styles.picker}>
		// 	<HexColorPicker color={debouncedValue} onChange={setPickerValue}    />
		// 	<label>
		// 		Hex: {' '}
		// 		<HexColorInput color={debouncedValue} onChange={setPickerValue} style={{marginTop: '12px'}} />
		// 	</label>
		// </div>
	);
};

export default ColorPicker;