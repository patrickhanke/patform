import { useDataHandler } from "@repo/provider";
import { Modal, StatelessToggle, TextInput } from "@repo/ui";
import { ErrorMessage } from "@repo/types";
import React, { FC, use, useCallback, useEffect, useState } from "react";
import { CreateServiceProps } from "../types";

const CreateService: FC<CreateServiceProps> = ({
  createService,
  setCreateService,
  refetch,
}) => {
  const { createData } = useDataHandler();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ErrorMessage[]>([]);
  const [service, setService] = useState({
    name: "",
    description: "",
    is_active: true,
  });

  const createServiceHandler = useCallback(async () => {
    setLoading(true);
    await createData({
      className: "Service",
      updateObject: service,
    });
    await refetch();
    setLoading(false);
    setCreateService(false);
  }, [service]);

  useEffect(() => {
    const errorArray: ErrorMessage[] = [];
    if (!service.name) {
      errorArray.push({
        message: "Bitte geben Sie einen Namen ein",
        id: "no_name",
        key: "no_name",
      });
    }
    setErrors(errorArray);
  }, [service]);

  return (
    <Modal
      isOpen={createService}
      header={"Service erstellen"}
      confirmButtonHandler={() => createServiceHandler()}
      cancelButtonHandler={() => setCreateService(false)}
      buttonDisabled={[loading, loading || errors.length > 0]}
      errors={errors}
    >
      <div className="flex col a-fs">
        <TextInput
          label="Name"
          id="name"
          errors={errors}
          onChange={(value) => setService({ ...service, name: value })}
        />

        <TextInput
          label="Beschreibung"
          id="description"
          errors={errors}
          onChange={(value) => setService({ ...service, description: value })}
          isTextArea
        />

        <StatelessToggle
          label="Aktiv"
          value={service.is_active}
          onChange={(value) => setService({ ...service, is_active: value })}
        />
      </div>
    </Modal>
  );
};

export default CreateService;
