import { useFindData } from "@repo/provider";
import React, { FC, useCallback } from "react";
import { ServiceSettingsProps, UpdateHandler } from "./types";
import { Table } from "@repo/ui";
import useServiceSettingsTableColumns from "./hooks/useServiceSettingsTableColumns";
import { useDataHandler } from "@repo/provider";
import CreateService from "./components/CreateService";

const ServiceSettings: FC<ServiceSettingsProps> = ({
  projectId,
  createService,
  setCreateService,
}) => {
  const { updateData } = useDataHandler();
  const { data, refetch } = useFindData({
    objectName: "Service",
    fields: ["objectId", "name", "is_active", "description"],
    projectId
  });

  console.log(data);

  const updateHandler: UpdateHandler = async ({ serviceId, updateObject }) => {
    await updateData({
      className: "Service",
      objectId: serviceId,
      updateObject,
    });
    refetch();
  };
  const columns = useServiceSettingsTableColumns({ updateHandler });

  return (
    <div className="content_element no_padding">
      <Table columns={columns} data={data || []} />
      <CreateService
        createService={createService}
        setCreateService={setCreateService}
        refetch={refetch}
      />
    </div>
  );
};

export default ServiceSettings;
