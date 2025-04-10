"use client";

import { useRef, useState, FC, useEffect } from "react";
import { HexColorInput, RgbaStringColorPicker } from "react-colorful";
import "./styles.scss";
import { useDebounceValue, useOnClickOutside } from "usehooks-ts";
import { ColorPickerProps } from "./types";

const ColorPicker: FC<ColorPickerProps> = ({
	value = "",
	onChange,
	isOverlay = false
}) => {
	const [color, setColor] = useDebounceValue(value, 1000);
	const [isOpen, setIsOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const swatchRef = useRef<HTMLDivElement>(null);
	useOnClickOutside(ref, () => setIsOpen(false));

	useEffect(() => {
		if (color && color !== value) {
			onChange(color);
		}
	}, [color]);

	const getPopoverPosition = () => {
		if (!swatchRef.current) return { top: 0, left: 0 };
		const rect = swatchRef.current.getBoundingClientRect();
		return {
			top: rect.bottom + window.scrollY,
			left: rect.left + window.scrollX
		};
	};

	return (
		<div className={"color_picker_picker"}>
			{isOverlay ? (
				<>
					<div
						className={"color_picker_swatch"}
						style={{ backgroundColor: value }}
						onClick={() => setIsOpen(true)}
						ref={swatchRef}
					/>
					{isOpen && (
						<div
							className={"color_picker_popover"}
							ref={ref}
							style={{
								position: "fixed",
								...getPopoverPosition()
							}}
						>
							<div>
								<RgbaStringColorPicker
									color={value}
									onChange={setColor}
									style={{ marginTop: "12px", right: 0 }}
								/>
								<div
									style={{
										width: "200px",
										position: "relative"
									}}
								>
									<HexColorInput
										color={value}
										onChange={setColor}
									/>
								</div>
							</div>
						</div>
					)}
				</>
			) : (
				<>
					{/* <HexColorPicker color={debouncedValue} onChange={setPickerValue}   /> */}
					<label>
						<RgbaStringColorPicker
							color={value}
							onChange={setColor}
							style={{ marginTop: "12px" }}
						/>
					</label>
				</>
			)}
		</div>
	);
};

export default ColorPicker;
