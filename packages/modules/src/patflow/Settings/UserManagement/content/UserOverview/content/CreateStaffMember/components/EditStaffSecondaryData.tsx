import { FC, useState } from "react";
import { ColorSelect, IconButton, ImageUploader, Modal } from "@repo/ui";
import { EditStaffSecondaryDataProps } from "../types";
import { CreatePatflowUser } from "@repo/types";

const EditStaffSecondaryData: FC<EditStaffSecondaryDataProps> = ({
	staffMember = [],
	setStaffMember
}) => {
	const [selectColor, setSelectColor] = useState(false);
	const [color, setColor] = useState(staffMember.color || "blue");
	return (
		<div>
			<ImageUploader
				label="Bild auswählen"
				onChange={(images) =>
					setStaffMember((draft: CreatePatflowUser) => {
						if (typeof images[0] === "string") {
							draft.portrait = images[0];
						}
					})
				}
				maxFileCount={1}
			/>
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
						setStaffMember((draft: CreatePatflowUser) => {
							draft.color = color;
						});
						setSelectColor(false);
					}}
					header="Farbe auswählen"
				>
					<ColorSelect
						value={color}
						onChange={(value) => setColor(value)}
					/>
				</Modal>
			</div>
		</div>
	);
};

export default EditStaffSecondaryData;
