import { useCallback, useContext, useMemo, useState, useEffect } from "react";
import { Field, SlideIn } from "@repo/ui";
import { PatstoreAppContext, useDataHandler } from "@repo/provider";
import { Form } from "@repo/ui";

const CreateNews = ({ refetch }: { refetch: () => void }) => {
  const { createData } = useDataHandler();
  const { currentModule } = useContext(PatstoreAppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({} as { [key: string]: any });

  const [disabled, setDisabled] = useState<[boolean, boolean]>([false, false]);

  const newsFields = useMemo(() => {
    const constantFields: Field[] = [
      {
        id: "title",
        position: 1,
        name: "title",
        type: "input",
        label: "Name",
        // validation: 'string_required'
      },
      {
        id: "image",
        position: 2,
        name: "image",
        type: "image",
        label: "Bild",
        options: {
          return_type: "string",
          max_file_count: 1,
        },
      },
      {
        id: "text",
        position: 3,
        name: "text",
        type: "textarea",
        label: "Beschreibung",
        // validation: 'string_required'
      },
    ] as const;

    if (currentModule.fields) {
      currentModule.fields.forEach((field) => {
        if (field.name) {
          constantFields.push({ ...field, path: "/data" });
        }
      });
    }
    const initialData = {
      title: "",
      image: "",
      text: "",
      autor: "",
      data: currentModule.fields.reduce(
        (acc: { [key: string]: string }, field) => {
          acc[
            field.name.slice(field.name.lastIndexOf(".") + 1) as keyof Field
          ] = field.initialValue;
          return acc;
        },
        {},
      ),
    };

    return { constantFields, initialData };
  }, [currentModule.fields]);

  useEffect(() => {
    if (newsFields.initialData && !data) {
      setData(newsFields.initialData);
    }
  }, [newsFields.initialData]);

  const dataHandler = useCallback(async () => {
    setDisabled([true, true]);
    await createData({
      className: "News",
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
    refetch();
  }, [data]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={false}
        className="full_button md primary"
      >
        Neue News erstellen
      </button>
      <SlideIn
        isOpen={isOpen}
        header="News erstellen"
        cancel={() => setIsOpen(false)}
        confirm={() => dataHandler()}
        disabled={disabled}
      >
        {newsFields.constantFields && data && (
          <Form
            fields={newsFields.constantFields}
            data={data}
            formSubmitHandler={(values) => {
              setData(values);
            }}
          />
        )}
      </SlideIn>
    </>
  );
};

export default CreateNews;
