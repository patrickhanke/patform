import React, { FC } from "react";
import { ColorPicker, ImageUploader } from "@repo/ui";
import { EditStaffSecondaryDataProps } from "../types";
import { generateImagePath, useAppContext } from "@repo/provider";

const EditStaffSecondaryData: FC<EditStaffSecondaryDataProps> = ({
	staffMember = [],
	setStaffMember
}) => {
	const { project } = useAppContext();

	return (
		<form>
			<ImageUploader
				label="Bild auswählen"
				path={generateImagePath(
					process.env.APP_NAME as string,
					project.path
				)}
				filename={`${staffMember.first_name}_${staffMember.last_name}_${new Date()}_portrait.jpg`}
				previewImage={staffMember.portrait || undefined}
				onChange={(images) =>
					setStaffMember((draft) => {
						if (typeof images[0] === "string") {
							draft.portrait = images[0];
						}
					})
				}
				maxFileCount={1}
			/>
			<div>
				<label>Farbe auswählen</label>
				<ColorPicker
					value={staffMember.color}
					onChange={(value: string) =>
						setStaffMember((draft) => {
							draft.color = value;
						})
					}
				/>
			</div>
		</form>
	);
};

export default EditStaffSecondaryData;
