import { FC, useState } from "react";
import { ColorSelect, IconButton, Modal } from "@repo/ui";
import { EditStaffSecondaryDataProps } from "../types";

const EditStaffSecondaryData: FC<EditStaffSecondaryDataProps> = ({
	staffMember,
	setStaffMember
}) => {
	const [selectColor, setSelectColor] = useState(false);
	const [color, setColor] = useState(staffMember.color || "blue");

	return (
		<div>
			<label>Farbe auswählen</label>
			<IconButton
				text="Farbe auswählen"
				icon="color"
				onClick={() => setSelectColor(true)}
				color={color}
			/>
			<Modal
				isOpen={selectColor}
				cancelButtonHandler={() => setSelectColor(false)}
				confirmButtonHandler={() => {
					setStaffMember((draft) => {
						draft.color = color;
					});
					setSelectColor(false);
				}}
				header="Farbe auswählen"
			>
				<ColorSelect value={color} onChange={(value) => setColor(value)} />
			</Modal>
		</div>
	);
};

export default EditStaffSecondaryData;
