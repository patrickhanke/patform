import { useRef, useState } from 'react';
import { RgbaStringColorPicker } from 'react-colorful';
import '../styles.scss';
import { useOnClickOutside } from 'usehooks-ts';

const ColorPicker = ({value = '', onChange, isOverlay = false, alignRight = false} : {value: string, onChange: (value: string) => void, isOverlay?: boolean, alignRight?: boolean }) => {
	const [isOpen, setIsOpen] = useState(false);
	const ref = useRef(null);
	useOnClickOutside(ref, () => setIsOpen(false));

	

	return (
		<div className={'color_picker_picker'}>
			{isOverlay ? 
				<>
					<div
						className={'color_picker_swatch'}
						style={{ backgroundColor: value }}
						onClick={() => setIsOpen(true)}
					/>
					{isOpen && (
						<div className={'color_picker_popover'} data-align_right={alignRight} ref={ref}>
							<label>
								Hex: {' '}
								<RgbaStringColorPicker
									color={value}
									onChange={onChange}
									style={{marginTop: '12px', right: 0}}
								/>
							</label>
						</div> 
					)}
				</>
			
				:
				<>
					{/* <HexColorPicker color={debouncedValue} onChange={setPickerValue}   /> */}
					<label>
						<RgbaStringColorPicker color={value} onChange={onChange} style={{marginTop: '12px'}} />
					</label>
				
				</>
			}
		</div>
	);
};

export default ColorPicker;