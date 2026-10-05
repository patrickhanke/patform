"use client";

import { FC, useEffect, useMemo, useState } from "react";
import {
	ColorPicker as ChakraColorPicker,
	HStack,
	parseColor,
	Portal,
	Stack,
	Text
} from "@chakra-ui/react";
import { LuCheck } from "react-icons/lu";
import { useAppContext } from "@repo/provider";
import { PatstoreProjectColor } from "@repo/types";
import { ColorPickerProps, ProjectColorSwatch } from "./types";

const DEFAULT_COLOR = "#000000";

const parseSafeColor = (value?: string) => {
	try {
		if (value?.trim()) return parseColor(value);
	} catch {
		// unparsable values are treated as "no color"
	}
	return undefined;
};

const colorToCss = (color: ReturnType<typeof parseColor>) => {
	const hexa = color.toString("hexa");
	if (!hexa || hexa.toLowerCase().endsWith("ff")) {
		return color.toString("hex");
	}
	return color.toString("rgba");
};

const PickerBody = ({
	projectColors
}: {
	projectColors: ProjectColorSwatch[];
}) => (
	<>
		<ChakraColorPicker.Area />
		<HStack gap="2">
			<ChakraColorPicker.EyeDropper size="xs" variant="outline" />
			<ChakraColorPicker.Sliders />
		</HStack>
		<ChakraColorPicker.Input />
		{projectColors.length > 0 && (
			<Stack gap="1" paddingTop="2">
				<Text fontSize="xs" color="fg.muted">
					Projektfarben
				</Text>
				<ChakraColorPicker.SwatchGroup>
					{projectColors.map((swatch) => (
						<ChakraColorPicker.SwatchTrigger
							key={swatch.id}
							value={swatch.color}
							title={swatch.label}
						>
							<ChakraColorPicker.Swatch
								value={swatch.color}
								respectAlpha
							>
								<ChakraColorPicker.SwatchIndicator>
									<LuCheck />
								</ChakraColorPicker.SwatchIndicator>
							</ChakraColorPicker.Swatch>
						</ChakraColorPicker.SwatchTrigger>
					))}
				</ChakraColorPicker.SwatchGroup>
			</Stack>
		)}
	</>
);

const ColorPicker: FC<ColorPickerProps> = ({
	value = "",
	onChange,
	isOverlay = false
}) => {
	const { project } = useAppContext();
	const [color, setColor] = useState(
		() => parseSafeColor(value) ?? parseColor(DEFAULT_COLOR)
	);

	useEffect(() => {
		setColor(parseSafeColor(value) ?? parseColor(DEFAULT_COLOR));
	}, [value]);

	const projectColors = useMemo<ProjectColorSwatch[]>(() => {
		const colors = (project?.settings?.colors ||
			[]) as PatstoreProjectColor[];

		return colors.reduce<ProjectColorSwatch[]>((swatches, entry) => {
			const parsed = parseSafeColor(entry?.value);
			if (parsed) {
				swatches.push({
					id: entry.id || entry.value,
					label: entry.label || entry.value,
					color: parsed
				});
			}
			return swatches;
		}, []);
	}, [project?.settings?.colors]);

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
								<PickerBody projectColors={projectColors} />
							</ChakraColorPicker.Content>
						</ChakraColorPicker.Positioner>
					</Portal>
				</>
			) : (
				<ChakraColorPicker.Content>
					<PickerBody projectColors={projectColors} />
				</ChakraColorPicker.Content>
			)}
		</ChakraColorPicker.Root>
	);
};

export default ColorPicker;
