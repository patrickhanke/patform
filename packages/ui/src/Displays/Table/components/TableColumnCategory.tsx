"use client";

import { generateGraphQLQuery, useDataHandler } from "@repo/provider";
import { TableColumnCategoryProps } from "../types";
import "../styles.scss";
import { useCallback, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { Select } from "@repo/ui";
import { SelectOption } from "@repo/types";
import { cloneDeep, pull, isArray } from "lodash-es";

const TableColumnCategory = ({
  category,
  className,
  objectId,
  categories = [],
  refetch,
}: TableColumnCategoryProps) => {
  const { updateData } = useDataHandler();

  const { data } = useQuery(
    generateGraphQLQuery({
      type: "find",
      objectName: category.connected_class,
      fields: ["objectId", "label", category.key],
    }),
    {
      variables: { module: { _eq: category.moduleId } },
    }
  );

  const selectOptions = useMemo(() => {
    const options: { value: string; label: string }[] = [];
    const values: string[] = [];
    if (data) {
      const dataFields =
        data.objects[`find${category.connected_class}`].results;
      dataFields.forEach(
        (field: { objectId: string; [key: string]: string }) => {
          options.push({
            value: field.objectId,
            label: field.label as string,
          });
        }
      );
    }

    if (options.length > 0) {
      options.forEach((option) => {
        if (categories.includes(option.value)) {
          values.push(option.value);
        }
      });
    }

    return {
      options: options.sort((a, b) => a.label?.localeCompare(b.label)),
      values,
    };
  }, [category, categories, data]);

  const categoryChangeHandler = useCallback(
    async (value: string[]) => {
      const categoriesCopy = cloneDeep(categories);

      selectOptions.options.forEach((option) => {
        if (categories.includes(option.value)) {
          pull(categoriesCopy, option.value);
        }
      });

      const updateCategoriesArray = categoriesCopy.concat(value);

      await updateData({
        objectId: objectId,
        className,
        updateObject: {
          categories: updateCategoriesArray,
        },
      });

      refetch();
    },
    [category, categories, data]
  );

  return (
    <>
      <div className="button_container">
        <Select
          value={selectOptions.values}
          onChange={(options: SelectOption[] | SelectOption) => {
            if (isArray(options)) {
              categoryChangeHandler(
                options.map((option: SelectOption) => option.value)
              );
              return;
            } else {
              categoryChangeHandler([options.value]);
              return;
            }
          }}
          options={selectOptions.options}
          isMulti={category.is_multi}
          menuPosition="fixed"
        />
      </div>
    </>
  );
};

export default TableColumnCategory;
