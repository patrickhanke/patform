import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { SlideIn, TextInput } from "@repo/ui";
import { CreateFieldProps, FormField } from "./types";
import SelectType from "./components/SelectType";
import select_types from "./constants/select_types";
import CreateOptions from "./components/CreateOptions";
import CheckboxDescription from "./components/CheckboxDescription";
import { useDataHandler } from "@repo/provider";
import { ErrorMessage } from "@repo/types";
import default_field_data from "./constants/default_field_data";

const CreateField: FC<CreateFieldProps> = ({
  formId,
  fields,
  createField,
  setCreateField,
  refetch,
  field,
}) => {
  const { updateData } = useDataHandler();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<FormField>(
    field ? field : default_field_data,
  );

  const [secContent, setSecContent] = useState<string | null>(null);
  const [errors, setErrors] = useState<ErrorMessage[]>([]);

  const secondaryContent = useMemo(() => {
    if (secContent === "type") {
      return (
        <SelectType
          setType={(value) => setData({ ...data, type: value })}
          type={data.type}
        />
      );
    }

    if (secContent === "options") {
      return (
        <CreateOptions
          setOptions={(value) => setData({ ...data, options: value })}
          options={data.options || []}
        />
      );
    }

    if (secContent === "checkbox") {
      return (
        <CheckboxDescription
          setDescription={(value) => setData({ ...data, description: value })}
          description={data.description}
        />
      );
    }

    return null;
  }, [secContent, data]);

  const dataChangeHandler = useCallback(
    (key: string, value: string | number | boolean) => {
      const dataCopy = { ...data, [key]: value };
      // set(dataCopy, key, value)
      setData(dataCopy);
    },
    [data],
  );

  const dataSaveHandler = useCallback(async () => {
    setLoading(true);
    let fieldsCopy = [...fields];
    if (!field) {
      fieldsCopy.push(data);
    } else {
      const index = fields.findIndex((f) => f.id === data.id);
      if (index !== -1) {
        fieldsCopy[index] = data;
      }
    }
    await updateData({
      className: "Form",
      objectId: formId,
      updateObject: {
        fields: fieldsCopy,
      },
    });
    await refetch();
    setData(default_field_data);
    setLoading(false);
    setCreateField(false);
  }, [data]);

  useEffect(() => {
    const errorArray: ErrorMessage[] = [];
    if (!data.name) {
      errorArray.push({
        message: "Name ist ein Pflichtfeld",
        key: "name",
        id: "name",
      });
    }
    if (data.name) {
      const exists = fields.find((field) => field.name === data.name);
      if (exists) {
        errorArray.push({
          message: "Name existiert bereits",
          key: "name",
          id: "name",
        });
      }
    }
    if (!data.type) {
      errorArray.push({
        message: "Typ ist ein Pflichtfeld",
        key: "type",
        id: "type",
      });
    }
    if (data.type === "select" && data.options.length === 0) {
      errorArray.push({
        message: "Optionen sind ein Pflichtfeld",
        key: "options",
        id: "options",
      });
    }
    if (data.type === "select" && data.options.length < 2) {
      errorArray.push({
        message: "Mindestens 2 Optionen sind erforderlich",
        key: "options_number",
        id: "options_number",
      });
    }
    if (data.type === "checkbox" && !data.description) {
      errorArray.push({
        message: "Beschreibung ist ein Pflichtfeld",
        key: "description",
        id: "description",
      });
    }

    setErrors(errorArray);
  }, [data]);

  return (
    <SlideIn
      isOpen={createField}
      header="Feld erstellen"
      cancel={() => setCreateField(false)}
      confirm={() => dataSaveHandler()}
      secondaryContent={secondaryContent}
      showSecondaryContent={secondaryContent ? true : false}
      errors={errors}
      disabled={[loading, errors.length > 0 || loading]}
      preventClickOutside
    >
      <div className="flex col gap-sm">
        <div>
          <TextInput
            label="Name"
            id="name"
            defaultValue={data.name}
            onChange={(value) => setData({ ...data, name: value })}
          />
        </div>
        <div>
          <label>Feldtyp auswählen</label>
          {data.type ? (
            <div
              className="content_element pointer"
              onClick={() => setSecContent("type")}
            >
              <div>
                <p>
                  Typ:{" "}
                  {
                    select_types.find(
                      (type: (typeof select_types)[number]) =>
                        type.value === data.type,
                    )?.label
                  }
                </p>
              </div>
            </div>
          ) : (
            <button
              className="full_button sm secondary"
              onClick={() => setSecContent("type")}
            >
              Typ wählen
            </button>
          )}
          {data.type === "select" && (
            <div>
              <label>Optionen festlegen</label>
              {data.options.length > 1 ? (
                <div
                  onClick={() => setSecContent("options")}
                  className="c-pointer flex col gap-xs"
                >
                  {data.options.map((option) => (
                    <div key={option.value} className="content_element">
                      <h3>{option.label}</h3>
                      {option.text && <p>{option.text}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <button
                  className="full_button sm primary"
                  onClick={() => setSecContent("options")}
                >
                  Optionen festlegen
                </button>
              )}
            </div>
          )}
          {data.type === "checkbox" && (
            <button
              className="full_button sm primary"
              onClick={() => setSecContent("checkbox")}
            >
              Beschreibung
            </button>
          )}
          {(data.type === "text" || data.type === "textarea") && (
            <div>
              <TextInput
                label="Platzhalter"
                id="placeholder"
                defaultValue={data.placeholder}
                onChange={(value) => dataChangeHandler("placeholder", value)}
              />
            </div>
          )}
        </div>
        <div>
          <label>Zusätzliche Informationen (Optional)</label>
          <TextInput
            id="info"
            width="100%"
            onChange={(value) => setData({ ...data, info: value })}
            isTextArea
            defaultValue={data.info}
          />
        </div>
        <div>
          <label>Pflichtfeld (Feld ist ein Pflichtfeld)</label>
          <div className="toggle-container">
            <div className="toggle-switch">
              <input type="checkbox" checked={!data.required} />
              <span
                onClick={() => dataChangeHandler("required", !data.required)}
                className="toggle-slider"
              ></span>
            </div>
          </div>
        </div>
      </div>
    </SlideIn>
  );
};

export default CreateField;
