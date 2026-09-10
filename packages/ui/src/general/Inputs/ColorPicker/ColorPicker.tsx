"use client";

import { FC, useEffect, useState } from "react";
import {
	ColorPicker as ChakraColorPicker,
	HStack,
	parseColor,
	Portal
} from "@chakra-ui/react";
import { ColorPickerProps } from "./types";

const DEFAULT_COLOR = "#000000";

const parseSafeColor = (value?: string) => {
	try {
		if (value?.trim()) return parseColor(value);
	} catch {
		// fall through
	}
	return parseColor(DEFAULT_COLOR);
};

const colorToCss = (color: ReturnType<typeof parseColor>) => {
	const hexa = color.toString("hexa");
	if (!hexa || hexa.toLowerCase().endsWith("ff")) {
		return color.toString("hex");
	}
	return color.toString("rgba");
};

const PickerBody = () => (
	<>
		<ChakraColorPicker.Area />
		<HStack gap="2">
			<ChakraColorPicker.EyeDropper size="xs" variant="outline" />
			<ChakraColorPicker.Sliders />
		</HStack>
		<ChakraColorPicker.Input />
	</>
);

const ColorPicker: FC<ColorPickerProps> = ({
	value = "",
	onChange,
	isOverlay = false
}) => {
	const [color, setColor] = useState(() => parseSafeColor(value));

	useEffect(() => {
		setColor(parseSafeColor(value));
	}, [value]);

	return (
		<ChakraColorPicker.Root
			size="sm"
			value={color}
			format="rgba"
			onValueChange={(details) => {
				setColor(details.value);
				onChange(colorToCss(details.value));
			}}
			inline={!isOverlay}
		>
			<ChakraColorPicker.HiddenInput />
			{isOverlay ? (
				<>
					<ChakraColorPicker.Control>
						<ChakraColorPicker.Trigger data-fit-content>
							<ChakraColorPicker.ValueSwatch boxSize="7" />
						</ChakraColorPicker.Trigger>
					</ChakraColorPicker.Control>
					<Portal>
						<ChakraColorPicker.Positioner style={{ zIndex: 2000 }}>
							<ChakraColorPicker.Content>
								<PickerBody />
							</ChakraColorPicker.Content>
						</ChakraColorPicker.Positioner>
					</Portal>
				</>
			) : (
				<ChakraColorPicker.Content>
					<PickerBody />
				</ChakraColorPicker.Content>
			)}
		</ChakraColorPicker.Root>
	);
};

export default ColorPicker;
