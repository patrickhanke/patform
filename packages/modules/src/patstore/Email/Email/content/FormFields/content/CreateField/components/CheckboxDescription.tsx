import React, { FC } from "react";
import { Editor } from "@repo/ui";
import { CheckboxDescriptionProps } from "../types";

const CheckboxDescription: FC<CheckboxDescriptionProps> = ({
  description,
  setDescription,
}) => {
  return (
    <div>
      <Editor
        content={description}
        onChange={(value) => setDescription(value)}
        placeholder="Beschreibung"
      />
    </div>
  );
};

export default CheckboxDescription;
