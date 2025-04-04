import { Updater } from "use-immer";
import { Team } from "@repo/types";

export type TableColumnEditTeamProps = {
	initialData?: Team;
	onChange: (team: Team) => Promise<void> | void;
};

export type EditTeamProps = {
	team: Team;
	setTeam: Updater<Team>;
};
