import { AbsenceStateOptions } from "@repo/types";

const absence_state_options = [
	{
		value: "created",
		id: "created",
		label: "Erstellt",
		color: "blue"
	},
	{
		value: "submitted",
		id: "submitted",
		label: "Eingereicht",
		color: "yellow"
	},
	{
		value: "approved",
		id: "approved",
		label: "Genehmigt",
		color: "green"
	}
] as AbsenceStateOptions;

export default absence_state_options;
