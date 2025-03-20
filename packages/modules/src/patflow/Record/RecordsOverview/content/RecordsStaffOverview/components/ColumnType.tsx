import React from "react";
import { TableData } from "../types";
import { Absence } from "@repo/types";
import { StateDisplay } from "@repo/ui";
import { absence_type_options } from "@repo/provider";

const ColumnType = ({
  type,
  absenceType,
}: {
  type: TableData["type"];
  absenceType?: Absence["type"];
}) => {
  if (type === "absence" && absenceType) {
    return (
      <StateDisplay
        label={
          absence_type_options.find((option) => option.value === absenceType)
            ?.label || "-"
        }
        color={
          absence_type_options.find((option) => option.value === absenceType)
            ?.color || "light"
        }
      />
    );
  }
  if (type === "work") {
    return <StateDisplay label={"Arbeitszeit"} color={"green"} />;
  }
  return null;
};

export default ColumnType;
