"use client";

import { useCallback, useState } from "react";
import { SlideIn } from "@repo/ui";
import { useDataHandler } from "@repo/provider";
import { Form } from "@repo/ui";
import { CreateClassProps } from "./types";
import { Classes } from "@repo/types";

const CreateClass = <T extends Classes>({
  initialData,
  fields,
  text,
  className,
  refetch,
  projectId,
}: CreateClassProps<T>) => {
  const { createData } = useDataHandler();
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] =
    useState<CreateClassProps<T>["initialData"]>(initialData);

  const [disabled, setDisabled] = useState<[boolean, boolean]>([false, false]);

  const dataHandler = useCallback(async () => {
    setDisabled([true, true]);
    await createData({
      className: className,
      updateObject: {
        project: {
          __type: "Pointer",
          className: "Project",
          objectId: projectId,
        },
        ...data,
      },
    });
    setDisabled([false, false]);
    setIsOpen(false);
    if (refetch) {
      refetch();
    }
  }, [data]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={false}
        className="full_button sm primary"
      >
        {text}
      </button>
      <SlideIn
        isOpen={isOpen}
        header={text}
        cancel={() => setIsOpen(false)}
        confirm={() => dataHandler()}
        disabled={disabled}
      >
        {fields && (
          <Form
            fields={fields}
            data={data}
            formSubmitHandler={(values) => setData(values)}
            formValidationHandler={(isValid) => setDisabled([false, !isValid])}
          />
        )}
      </SlideIn>
    </>
  );
};

export default CreateClass;
