import { Absence } from "@repo/types";

const filterAbsences = (absences: Absence[], year?: number) => {
	if (year) {
		return absences.filter(
			(absence) =>
				absence.state !== "approved" &&
				absence.year === year &&
				absence?.user?.objectId
		);
	} else {
		return absences.filter(
			(absence) => absence.state !== "approved" && absence?.user?.objectId
		);
	}
};

export default filterAbsences;
