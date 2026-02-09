import { useCallback } from "react";
import { DeleteAbsenceProps } from "../types";
import { useDataHandler, useFindData } from "@repo/provider";
import { Day } from "@repo/types";
import { Modal } from "@repo/ui";

const DeleteAbsence = ({
	deleteAbsence,
	setDeleteAbsence,
	absence,
	refetch
}: DeleteAbsenceProps) => {
	const { deleteData } = useDataHandler();

	const { data } = useFindData({
		objectName: "Day",
		fields: [
			"objectId",
			"year",
			"month",
			"date",
			"is_working_day",
			"time",
			"default_time",
			"surcharges",
			"iso_date",
			"absence { objectId start_date end_date state type }",
			"saldo",
			"type",
			"iso_date",
			"user { objectId }",
			"record { objectId }"
		],
		filters: [
			{
				key: "absence",
				value: absence.objectId,
				operator: "equalTo",
				id: "absence"
			}
		],
		skipQuery: !deleteAbsence
	});

	const deleteAbsenceHandler = useCallback(async () => {
		const days: Day[] = data || [];
		const updateArray = days.map((day) =>
			deleteData({
				objectId: day.objectId,
				className: "Day"
			})
		);

		await Promise.all(updateArray);
		await deleteData({
			objectId: absence.objectId,
			className: "Absence"
		});
		setDeleteAbsence(false);
		refetch();
	}, [data, deleteAbsence]);

	return (
		<Modal
			header="Abwesenheit löschen"
			isOpen={deleteAbsence}
			cancelButtonHandler={() => setDeleteAbsence(false)}
			confirmButtonHandler={deleteAbsenceHandler}
			buttonDisabled={[false, !data]}
		>
			<div>
				<div>Möchten Sie diese Abwesenheit wirklich löschen?</div>
			</div>
		</Modal>
	);
};

export default DeleteAbsence;
