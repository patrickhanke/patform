"use client";

import { useCallback, useContext, useState } from "react";
import { SlideIn } from "@repo/ui";
import { PatstoreAppContext, useDataHandler } from "@repo/provider";
import { Form } from "@repo/ui";
import { CreateClassProps } from "./types";
import { Classes } from "@repo/types";

const CreateClass = <T extends Classes>({
  initialData,
  fields,
  text,
  className,
  refetch,
}: CreateClassProps<T>) => {
  const { createData } = useDataHandler();
  const { currentModule } = useContext(PatstoreAppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] =
    useState<CreateClassProps<T>["initialData"]>(initialData);
  const [secondaryContent, setSecondaryContent] =
    useState<React.ReactNode | null>(null);

  const [disabled, setDisabled] = useState<[boolean, boolean]>([false, false]);

  const dataHandler = useCallback(async () => {
    setDisabled([true, true]);
    await createData({
      className: className,
      updateObject: {
        module: {
          __type: "Pointer",
          className: "Module",
          objectId: currentModule.objectId,
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
        className="full_button md primary"
      >
        {text}
      </button>
      <SlideIn
        isOpen={isOpen}
        header={text}
        cancel={() => setIsOpen(false)}
        confirm={() => dataHandler()}
        disabled={disabled}
        secondaryContent={secondaryContent}
        showSecondaryContent={secondaryContent ? true : false}
      >
        {fields && (
          <Form
            fields={fields}
            data={data}
            formSubmitHandler={(values) => setData(values)}
            formValidationHandler={(isValid) => setDisabled([false, !isValid])}
            setSecondaryContent={setSecondaryContent}
          />
        )}
      </SlideIn>
    </>
  );
};

export default CreateClass;
