import { FC, useState } from "react";
import { ColorSelect, ColorValues, Modal } from "@repo/ui";
import { SurchargeSelectColorProps } from "../types";

const SurchargeSelectColor: FC<SurchargeSelectColorProps> = ({
	selectColor,
	setSelectColor,
	initialColor,
	surchargeChangeHandler
}) => {
	const [color, setColor] = useState<ColorValues>(initialColor);
	return (
		<Modal
			header="Farbe wählen"
			isOpen={selectColor}
			cancelButtonHandler={() => setSelectColor(false)}
			confirmButtonHandler={() => {
				surchargeChangeHandler("color", color);
				setSelectColor(false);
			}}
		>
			<ColorSelect value={color} onChange={(color) => setColor(color)} />
		</Modal>
	);
};

export default SurchargeSelectColor;
