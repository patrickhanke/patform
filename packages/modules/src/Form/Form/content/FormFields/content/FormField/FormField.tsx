import React, { FC } from "react";
import { IconButton } from "@repo/ui";
import { FormFieldProps } from "./types";
import CreateField from "../CreateField";

const FormField: FC<FormFieldProps> = ({ formId, field, refetch, fields }) => {
  const [editField, setEditField] = React.useState(false);
  return (
    <div className="flex row a-ce j-sb">
      {field.name}
      <IconButton icon="edit" onClick={() => setEditField(true)} />
      <CreateField
        field={field}
        createField={editField}
        setCreateField={setEditField}
        formId={formId}
        fields={fields}
        refetch={refetch}
      />
    </div>
  );
};

export default FormField;
