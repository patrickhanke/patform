import React, { FC } from "react";
import { ServiceCellProps } from "./types";
import { v4 as generateUuid } from "uuid";
import CellContent from "./components/CellContent";
import { PropertyService } from "@repo/types";
import { ServiceData } from "../../types";

const ServiceCell: FC<ServiceCellProps> = ({
  services,
  id,
  serviceName,
  propertyId,
  propertyName,
  setAddEditService,
}) => {
  const service: PropertyService = services[
    id as keyof ServiceData
  ] as PropertyService;

  if (!service)
    return (
      <div>
        <button
          className="full_button light sm"
          onClick={() =>
            setAddEditService({
              id: generateUuid(),
              assigned_staff: [],
              days: [],
              active: true,
              type: "interval",
              dates: [],
              interval: {
                number: 1,
                unit: "weeks",
                start_date: "",
                end_date: "",
              },
              settings: {
                continue: true,
                repeat: false,
              },
              serviceId: id as string,
              serviceName,
              propertyId,
              propertyName,
            })
          }
        >
          + Hinzufügen
        </button>
      </div>
    );

  return (
    <CellContent
      service={service}
      setAddEditService={setAddEditService}
      serviceId={id}
      serviceName={serviceName}
      propertyId={propertyId}
      propertyName={propertyName}
    />
  );
};

export default ServiceCell;
