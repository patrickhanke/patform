import { Absence } from "@repo/types";
import { InitialAbsence } from "../types";

const initialAbsence: InitialAbsence = {
	objectId: "",
	user: undefined,
	start_date: "",
	end_date: "",
	state: "approved",
	comment: "",
	type: "" as Absence["type"],
	year: new Date().getFullYear()
};

export default initialAbsence;
