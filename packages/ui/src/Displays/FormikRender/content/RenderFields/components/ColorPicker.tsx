import { useRef, useState, FC } from 'react';
import { HexColorInput, RgbaStringColorPicker } from 'react-colorful';
import '../styles.scss';
import { useOnClickOutside } from 'usehooks-ts';
import { ColorPickerProps } from '../types';

const ColorPicker: FC<ColorPickerProps> = ({value = '', label ='', onChange, isOverlay = false, isHorizontal = false}) => {
	const [isOpen, setIsOpen] = useState(false);
	const ref = useRef(null);
	useOnClickOutside(ref, () => setIsOpen(false));

	return (
		<div className={isHorizontal ? 'form_horizontal_container' : ''}>
			<label>{label ||''} </label>
			<div className={'color_picker_picker'}>
				{isOverlay ?
					<>
						<div
							className={'color_picker_swatch'}
							style={{ backgroundColor: value }}
							onClick={() => setIsOpen(true)}
						/>
						{isOpen && (
							<div className={'color_picker_popover'} data-align_right={isHorizontal} ref={ref}>
								<div>
									<RgbaStringColorPicker
										color={value}
										onChange={onChange}
										style={{marginTop: '12px', right: 0}}
									/>
									<div style={{width: '200px', position: 'relative'}}>
										<HexColorInput color={value} onChange={onChange} />
									</div>
								</div>
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
		</div>
	);
};

export default ColorPicker;