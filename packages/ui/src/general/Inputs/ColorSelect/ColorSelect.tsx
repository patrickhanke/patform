import { FC, useMemo } from "react";
import {
	ElementSelectInterface,
	SelectElement
} from "../ElementSelectInterface";
import colors from "./constants/colors";
import { ColorSelectProps } from "./types";

const ColorSelect: FC<ColorSelectProps> = ({ value, onChange }) => {
	const selectedValue: SelectElement[] = useMemo(() => {
		const selectedColor: (typeof colors)[number] | undefined = colors.find(
			(color) => color.value === value
		);
		return selectedColor ? [selectedColor] : [];
	}, [value]);

	return (
		<ElementSelectInterface
			isSearchable
			elements={[...colors]}
			// min={1}
			max={1}
			title="Farbe auswählen"
			selectedElements={selectedValue}
			onSelect={(color: SelectElement[]) => {
				if (color && color.length > 0 && color[0]?.value) {
					onChange(
						color[0]?.value as (typeof colors)[number]["value"]
					);
				} else {
					onChange("grey");
				}
			}}
		/>
	);
};

export default ColorSelect;
