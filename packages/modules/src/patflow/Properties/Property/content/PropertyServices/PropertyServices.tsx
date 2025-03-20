import { useQuery } from "@apollo/client";
import React, { FC } from "react";
import useTableColumns from "./hooks/useTableColumns";
import { FIND_PROPERTY_SERVICES } from "@repo/provider";
import { Table } from "@repo/ui";
import { PropertyServicesProps } from "./types";
import AddService from "./content/AddService";

const PropertyServices: FC<PropertyServicesProps> = ({
  objectId,
  addService,
  setAddService,
}) => {
  const { data } = useQuery(FIND_PROPERTY_SERVICES, {
    variables: { id: objectId },
  });
  const columns = useTableColumns();

  return (
    <div className="site_content">
      <Table
        columns={columns}
        data={data ? data.objects.findService.results : []}
      />
      <AddService
        propertyId={objectId}
        addService={addService}
        setAddService={setAddService}
      />
    </div>
  );
};

export default PropertyServices;
