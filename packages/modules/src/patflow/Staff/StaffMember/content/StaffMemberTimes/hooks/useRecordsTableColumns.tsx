import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Record } from "@types";
import { convertMillisecondsToString, getDateStringsFromIso } from "@provider";
import { UseRecordTableColumns } from "../types";
import Editrecord from "../content/EditRecord";

const useRecordsTableColumns: UseRecordTableColumns = ({
  refetch,
  projectId,
}) => {
  const columns: ColumnDef<Record>[] = useMemo(
    () => [
      {
        accessorKey: "year",
        header: () => <span>Jahr</span>,
        id: "date",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => getDateStringsFromIso(row.start_date).date,
        header: () => <span>Start</span>,
        id: "start_time",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => getDateStringsFromIso(row.end_date).date,
        header: () => <span>Ende</span>,
        id: "end_time",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) =>
          row.time_settings ? row.time_settings.hours.toString() : "-",
        header: () => <span>Arbeitszeit</span>,
        id: "working_times",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) =>
          row.time_settings
            ? `${row.time_settings.vacation.toString()} / ${row.absence_days.toString() || 0}`
            : "-",
        header: () => <span>Urlaub (verfügbar / genommen)</span>,
        id: "absence_days",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => convertMillisecondsToString(row.saldo),
        header: () => <span>Saldo</span>,
        id: "record_saldo",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => (
          <Editrecord record={row} refetch={refetch} projectId={projectId} />
        ),
        header: () => <span>Bearbeiten</span>,
        id: "edit",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
    ],
    [],
  );

  return columns;
};

export default useRecordsTableColumns;
