import { useContext, useEffect, useMemo } from "react";
import { Absence } from "@repo/types";
import { PatflowAppContext, useDataStore, useFindData } from "@repo/provider";
import { LoadingIndicator, Select } from "@repo/ui";
import { RecordAbsenceProps } from "./types";
import useRecordAbsenceColumns from "./hooks/useRecordAbsenceColumns";
import EditRecordAbsence from "./content/EditRecordAbsence";
import { Divider, Table } from "@repo/ui";

const RecordAbsence = ({
	records,
	editAbsence,
	setEditAbsence,
	selectedUser,
	setSelectedUser
}: RecordAbsenceProps) => {
	const { year } = useContext(PatflowAppContext);
	const { workers } = useDataStore();

	const siteHeaderContent = useMemo(() => {
		return (
			<div className="horizontal_container">
				<Select
					label=""
					width="180px"
					options={workers}
					value={selectedUser}
					onChange={(value) => setSelectedUser(value)}
					placeholder="Mitarbeiter..."
					isClearable
				/>
			</div>
		);
	}, [year, workers, selectedUser]);

	const { data, refetch, loading } = useFindData({
		objectName: "Absence",
		fields: [
			"objectId",
			"start_date",
			"end_date",
			"state",
			"user {objectId first_name last_name portrait}",
			"comment",
			"type",
			"year"
		],
		filters: [{ key: "year", value: year, operator: "equalTo" }],
		userId: selectedUser?.value,
		skipQuery: !year || !selectedUser?.value
	});

	const absenceData = useMemo(() => {
		const absenceArray: Absence[] = [];
		if (data) {
			data.forEach((absence: Absence) => {
				absenceArray.push({
					...absence
				});
			});
		}

		return absenceArray;
	}, [selectedUser, data]);

	const columns = useRecordAbsenceColumns({ refetch });

	useEffect(() => {
		if (year) {
			refetch();
		}
	}, [year]);

	if (loading) {
		return <LoadingIndicator />;
	}

	return (
		<>
			<div>
				{siteHeaderContent}
				{absenceData.length > 0 ? (
					<>
						<Divider size="small" showLine={false} />
						<div className="content_element no_padding">
							<Table columns={columns} data={absenceData} />
						</div>
					</>
				) : (
					<p>Keine Abwesenheiten hinterlegt</p>
				)}
			</div>
			{records && (
				<EditRecordAbsence
					refetch={refetch}
					type="create"
					editAbsence={editAbsence}
					setEditAbsence={setEditAbsence}
				/>
			)}
		</>
	);
};

export default RecordAbsence;
