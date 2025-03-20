import { ColumnData } from "@repo/ui";
import { FormDataClass } from "@repo/types";
import { isArray } from "lodash-es";

const geneateFormColumns: (
  T: FormDataClass["data"],
) => ColumnData<FormDataClass["data"]>[] = (data) => {
  const columnData: ColumnData<FormDataClass["data"]>[] = [];

  if (isArray(data) && data.length > 0) {
    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (columnData.findIndex((column) => column.id === key) === -1) {
          columnData.push({
            id: key,
            type: "string",
            label: key,
          });
        }
      });
    });
  }

  return columnData;
};

export default geneateFormColumns;
