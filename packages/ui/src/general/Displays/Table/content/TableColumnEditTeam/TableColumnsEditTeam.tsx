import { Editor, SlideIn } from "@repo/ui";
import { FC, useCallback, useState } from "react";
import { Team } from "@repo/types";
import { useImmer } from "use-immer";
import { v4 } from "uuid";
import { TableColumnEditTeamProps } from "./types";
import EditTeam from "./components/EditTeam";

const TableColumnEditTeam: FC<TableColumnEditTeamProps> = ({
	initialData,
	onChange
}) => {
	const [loading, setLoading] = useState(false);
	const [editTeam, setEditTeam] = useState(false);
	const [team, setTeam] = useImmer<Team>(
		initialData
			? initialData
			: { id: v4(), name: "", description: "", image: "" }
	);

	const slideInConfirmHandler = useCallback(async () => {
		setLoading(true);
		if (team) {
			await onChange(team);
		}

		setEditTeam(false);
		setLoading(false);
	}, [team]);

	return (
		<>
			<div className="button_container">
				{team?.id ? (
					<button
						className="full_button sm light"
						onClick={() => setEditTeam(true)}
					>
						{team.name}
					</button>
				) : (
					<button className="full_button sm grey">
						+ Team hinzufügen
					</button>
				)}
			</div>
			<SlideIn
				cancel={() => setEditTeam(false)}
				confirm={() => slideInConfirmHandler()}
				isOpen={editTeam}
				header="Felder bearbeiten"
				showSecondaryContent={true}
				secondaryContent={
					<Editor
						label="Team Beschreibung"
						content={team?.description}
						onChange={(value) => {
							setTeam((draft) => {
								if (draft) {
									draft.description = value;
								}
							});
						}}
					/>
				}
				disabled={[loading, loading]}
			>
				<EditTeam team={team} setTeam={setTeam} />
			</SlideIn>
		</>
	);
};

export default TableColumnEditTeam;
