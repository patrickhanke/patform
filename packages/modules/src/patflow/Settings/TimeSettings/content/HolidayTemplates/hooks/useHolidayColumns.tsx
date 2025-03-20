import { ApolloRefetch, Holiday, HolidayTemplate } from "@types";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import EditHolidayTemplate from "../content/EditHolidayTemplate";

const useHolidayColumns = ({
  refetch,
  holidays,
}: {
  refetch: ApolloRefetch;
  holidays: Holiday[];
}) => {
  const columns: ColumnDef<HolidayTemplate>[] = useMemo(
    () => [
      {
        accessorFn: (row) => row.name,
        header: () => <span>Name</span>,
        id: "name",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => `${row.holidays.length} Feiertage`,
        header: () => <span>Feiertage</span>,
        id: "holidays",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
      {
        accessorFn: (row) => (
          <EditHolidayTemplate
            template={row}
            refetch={refetch}
            holidays={holidays}
          />
        ),
        header: () => <span>Bearbeiten</span>,
        id: "edit",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      },
    ],
    [refetch, holidays],
  );

  return columns;
};

export default useHolidayColumns;
