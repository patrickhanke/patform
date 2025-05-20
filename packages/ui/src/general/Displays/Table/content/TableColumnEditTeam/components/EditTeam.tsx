import { FC } from "react";
import { Divider, PatstoreSelectImages, TextInput } from "@repo/ui";
import { EditTeamProps } from "../types";

const EditTeam: FC<EditTeamProps> = ({ team, setTeam }) => {
	return (
		<div className="flex col gap-sm">
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
			<Divider size="small" />
			<PatstoreSelectImages
				image={team?.image}
				onChange={(value) =>
					setTeam((draft) => {
						if (draft) {
							draft.image = value;
						}
					})
				}
				maxFileCount={1}
				previewImageSize="lg"
			/>
		</div>
	);
};

export default EditTeam;
