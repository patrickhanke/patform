import { useContext, useMemo } from "react";
import { PatflowAppContext, useDataStore } from "@repo/provider";
import useRecordAbsenceColumns from "./hooks/useRecordAbsenceColumns";
import { Table } from "@repo/ui";
import { filterAbsences } from "./functions";

const RecordAbsence = () => {
	const { reloadAbsences, year } = useContext(PatflowAppContext);
	const { absences } = useDataStore();

	const absenceData = useMemo(() => {
		console.log({ absences });
		return filterAbsences(absences, year);
	}, [absences]);

	const columns = useRecordAbsenceColumns({ refetch: reloadAbsences });

	return (
		<>
			<button onClick={() => reloadAbsences()}>Reload Absences</button>
			<Table columns={columns} data={absenceData} />
		</>
	);
};

export default RecordAbsence;
