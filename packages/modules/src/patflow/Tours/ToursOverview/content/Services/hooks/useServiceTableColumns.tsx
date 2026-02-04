import { useFindData } from "@repo/provider";
import { Service } from "@repo/types";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import ServiceCell from "../content/ServiceCell";
import { ServiceData, UseServiceTableColumns } from "../types";

const useServiceTableColumns: (
  T: UseServiceTableColumns,
) => ColumnDef<ServiceData>[] = ({ setAddEditService }) => {
  const { data } = useFindData({
    objectName: "Service",
    fields: ["objectId", "name", "is_active", "description"]
  });

  const columns: ColumnDef<ServiceData>[] = useMemo(() => {
    const columnsArray: ColumnDef<ServiceData>[] = [
      {
        accessorKey: "name",
        header: () => <span>Name</span>,
        id: "name",
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
        sortingFn: "alphanumeric",
      },
    ];

    if (data) {
      const services = data;
      services.map((service: Service) => {
        if (!service.is_active) return;

        columnsArray.push({
          accessorFn: (row) => (
            <ServiceCell
              services={row || undefined}
              id={service.objectId}
              serviceName={service.name}
              propertyId={row.objectId}
              propertyName={row.name}
              setAddEditService={setAddEditService}
            />
          ),
          header: () => <span>{service.name}</span>,
          id: service.objectId,
          cell: (info) => info.getValue(),
          footer: (info) => info.column.id,
          sortingFn: "alphanumeric",
        });
      });
    }

    return columnsArray;
  }, [data]);

  return columns;
};

export default useServiceTableColumns;
