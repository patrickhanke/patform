import { useQuery } from "@apollo/client";
import React, { useCallback } from "react";
import { DeleteAbsenceProps } from "../types";
import { useDataHandler } from "@repo/provider";
import { find_day } from "@queries";
import { Day } from "@types";
import { Modal } from "@repo/ui";

const DeleteAbsence = ({
  deleteAbsence,
  setDeleteAbsence,
  absence,
  refetch,
}: DeleteAbsenceProps) => {
  const { deleteData } = useDataHandler();

  const { data } = useQuery(find_day, {
    variables: { params: { absence: { _eq: absence.objectId } } },
    skip: !deleteAbsence,
  });

  const deleteAbsenceHandler = useCallback(async () => {
    const days: Day[] = data.objects.findDay.results;
    const updateArray = days.map((day) =>
      deleteData({
        objectId: day.objectId,
        className: "Day",
      }),
    );

    await Promise.all(updateArray);
    await deleteData({
      objectId: absence.objectId,
      className: "Absence",
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
