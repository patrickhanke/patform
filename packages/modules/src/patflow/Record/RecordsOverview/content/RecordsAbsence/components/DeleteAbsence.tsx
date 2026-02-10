import { useCallback } from "react";
import { DeleteAbsenceProps } from "../types";
import { useDataHandler } from "@repo/provider";
import { Modal } from "@repo/ui";

const DeleteAbsence = ({
	deleteAbsence,
	setDeleteAbsence,
	absence,
	refetch
}: DeleteAbsenceProps) => {
	const { deleteData } = useDataHandler();

	const deleteAbsenceHandler = useCallback(async () => {
		await deleteData({
			objectId: absence.objectId,
			className: "Absence"
		});
		setDeleteAbsence(false);
		refetch();
	}, [deleteAbsence]);

	return (
		<Modal
			header="Abwesenheit löschen"
			isOpen={deleteAbsence}
			cancelButtonHandler={() => setDeleteAbsence(false)}
			confirmButtonHandler={deleteAbsenceHandler}
			buttonDisabled={[false, !absence]}
		>
			<div>
				<div>Möchten Sie diese Abwesenheit wirklich löschen?</div>
			</div>
		</Modal>
	);
};

export default DeleteAbsence;
