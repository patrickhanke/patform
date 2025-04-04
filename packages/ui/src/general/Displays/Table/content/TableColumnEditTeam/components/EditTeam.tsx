import { FC } from "react";
import { ImageUploader, TextInput } from "@repo/ui";
import { generateImagePath, useAppContext } from "@repo/provider";
import { EditTeamProps } from "../types";

const EditTeam: FC<EditTeamProps> = ({ team, setTeam }) => {
	const { project } = useAppContext();

	return (
		<div>
			<TextInput
				id="team"
				defaultValue={team?.name}
				onChange={(value) =>
					setTeam((draft) => {
						if (draft) {
							draft.name = value;
						}
					})
				}
				placeholder="Team Name"
				label="Team Name"
				type="text"
			/>
			<ImageUploader
				previewImage={team?.image}
				maxFileCount={1}
				onChange={(value) =>
					setTeam((draft) => {
						if (draft) {
							draft.image = value[0] as string;
						}
					})
				}
				label="Team Image"
				path={generateImagePath(
					process.env.APP_NAME as string,
					project.path
				)}
			/>
		</div>
	);
};

export default EditTeam;
