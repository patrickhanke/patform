/* eslint-disable no-console */
import { get } from "lodash-es";
import { useCallback, useMemo } from "react";

const styles = "color: black; width: 100%; background-color: orange;";

const checkForTypeNameLabel = (fieldCopy, index) => {
  let isValid = true;
  // if {Object.keys(fieldCopy).includes()}
  if (!fieldCopy.type) {
    console.info(
      `%c Position ${index + 1}: Ein Typ (image, input, textarea, select, date) muss angegeben werden`,
      styles
    );
    isValid = false;
  }
  if (!fieldCopy.name) {
    console.info(
      `%c Position ${index + 1}: Ein Name (name: string) muss angegeben werden`,
      styles
    );
    isValid = false;
  }
  if (!fieldCopy.label) {
    console.info(
      `%c Position ${index + 1}: ${fieldCopy.name}: Ein Label (label: string) muss angegeben werden`,
      styles
    );
    isValid = false;
  }
  if (!fieldCopy.dataType) {
    console.info(
      `%c Position ${index + 1}: ${fieldCopy.name}: Ein dataType (dataType: 'string', 'object', 'bool', 'number', 'date', 'pointer) muss angegeben werden`,
      styles
    );
    isValid = false;
  }
  if (fieldCopy.dataType === "pointer" && !fieldCopy.pointerClass) {
    console.info(
      `%c Position ${index + 1}: ${fieldCopy.name}: Der DataType Pointer benötigt eine pointerClass (pointerClass: className), die auf die entstprechenden Datenbankclasse verweist  `,
      styles
    );
    isValid = false;
  }
  if (
    fieldCopy.type === "select" &&
    (fieldCopy?.options?.length === 0 || !fieldCopy.options)
  ) {
    console.info(
      `%c Position ${index + 1}: ${fieldCopy.name}: Ein Select muss Options (options: [{'value': string, 'label': string}...]) besitzen`,
      styles
    );
    isValid = false;
  }
  return isValid;
};

const useGetFormikData = ({ fields, data }) => {
  const formikFields = useMemo(() => {
    const formikFieldsMemo = [];
    fields.forEach((field, index) => {
      const fieldCopy = { ...field };
      let isValid = checkForTypeNameLabel(fieldCopy, index);

      if (
        (isValid === true && fieldCopy.type === "input") ||
        fieldCopy.type === "url" ||
        fieldCopy.type === "textarea" ||
        fieldCopy.type === "image" ||
        fieldCopy.type === "date" ||
        fieldCopy.type === "editor" ||
        fieldCopy.type === "toggle" ||
        fieldCopy.type === "file"
      ) {
        if (data) {
          if (field.dataField) {
            fieldCopy.initialValue = get(data, fieldCopy.dataField, undefined);
          }
          if (!field.dataField) {
            fieldCopy.initialValue = data[field.name];
          }
        }
      }

      if (isValid === true && fieldCopy.type === "select") {
        if (!fieldCopy.options || fieldCopy.options.length === 0) {
          console.info(
            `%c ${fieldCopy.label}: Bei einem Select müssen Optionen (options: string) hinzugefügt werden`,
            styles
          );
          isValid = false;
        }
        if (data) {
          if (fieldCopy.dataField) {
            const value = get(data, fieldCopy.dataField, undefined);
            if (typeof value === "object") {
              fieldCopy.initialValue =
                fieldCopy.options.find(
                  (option) => option.value === value.value
                ) ||
                fieldCopy.options.find(
                  (option) => option.label === value.label
                );
            }
            if (typeof value === "string") {
              fieldCopy.initialValue = value;
            }
          }
          if (!fieldCopy.dataField) {
            const value = data[fieldCopy.name] || fieldCopy.initialValue;
            if (typeof value === "object") {
              fieldCopy.initialValue =
                fieldCopy.options.find(
                  (option) => option.value === value.value
                ) ||
                fieldCopy.options.find(
                  (option) => option.label === value.label
                );
            }
            if (typeof value === "string") {
              fieldCopy.initialValue = value;
            }
          }
        }
      }
      if (isValid === true) {
        formikFieldsMemo.push(fieldCopy);
      }
    });

    return formikFieldsMemo;
  }, [fields, data]);

  const updateObject = useCallback(
    (values) => {
      const updateObjectMemo = {};

      fields.forEach((field) => {
        if (
          field.dataType === "string" ||
          field.dataType === "object" ||
          field.dataType === "bool" ||
          field.dataType === "number"
        ) {
          updateObjectMemo[field.name] =
            field.type === "select"
              ? values[field.name]?.value
              : values[field.name];
        }
        if (field.dataType === "date") {
          updateObjectMemo[field.name] = {
            __type: "Date",
            iso: values[field.name],
          };
        }
        if (field.dataType === "pointer") {
          updateObjectMemo[field.name] = {
            __type: "Pointer",
            className: field.pointerClass,
            objectId:
              field.type === "select"
                ? values[field.name]?.value
                : values[field.name],
          };
        }
      });
      return updateObjectMemo;
    },
    [fields]
  );

  return { formikFields, updateObject };
};

export default useGetFormikData;
