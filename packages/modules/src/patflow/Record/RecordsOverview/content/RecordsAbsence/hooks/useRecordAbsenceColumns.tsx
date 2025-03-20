import { ColumnDef } from "@tanstack/react-table";
import React, { useMemo } from "react";
import { AbsenceWithRecordIs, UseRecordAbsenceColumnsProps } from "../types";
import { DisplayWorker } from "@repo/ui";
import {
  absence_state_options,
  absence_type_options,
  getDateString,
} from "@repo/provider";
import EditAbsence from "../components/EditAbsence";
import { StateSelect } from "@repo/ui";

const useRecordAbsenceColumns = ({ refetch }: UseRecordAbsenceColumnsProps) => {
  const columns: ColumnDef<AbsenceWithRecordIs>[] = useMemo(
    () => [
      {
        accessorFn: (row) => <DisplayWorker workerId={row.user.objectId} />,
        header: () => <span>Nutzer</span>,
        id: "created_by",
        cell: (info) => info.getValue(),
        enableSorting: false,
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) =>
          `${getDateString(row.start_date).date} - ${getDateString(row.end_date).date}`,
        header: () => <span>Datum</span>,
        id: "date",
        cell: (info) => info.getValue(),
        enableSorting: false,
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => (
          <StateSelect
            type="state"
            state={row.type}
            stateOptions={absence_type_options}
          />
        ),
        header: () => <span>Typ</span>,
        id: "absennce_type",
        cell: (info) => info.getValue(),
        enableSorting: false,
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => (
          <StateSelect
            type="state"
            state={row.state}
            stateOptions={absence_state_options}
            displayInterface={false}
          />
        ),
        header: () => <span>Status</span>,
        id: "absence",
        cell: (info) => info.getValue(),
        enableSorting: false,
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => row.comment,
        header: () => <span>Kommentar</span>,
        id: "comment",
        cell: (info) => info.getValue(),
        enableSorting: false,
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => <EditAbsence absence={row} refetch={refetch} />,
        header: () => <span>Bearbeiten</span>,
        id: "edit",
        cell: (info) => info.getValue(),
        enableSorting: false,
        footer: (info) => info.column.id,
      },
    ],
    [],
  );

  return columns;
};

export default useRecordAbsenceColumns;
