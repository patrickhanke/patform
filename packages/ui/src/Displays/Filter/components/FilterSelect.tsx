import { useQuery } from "@apollo/client";
import { generateGraphQLQuery } from "@repo/provider";
import { Loader, Select } from "@repo/ui";
import filterChangeHandler from "../functions/filterChangeHandler";
import { FilterSelectProps } from "../types";
import { get } from "lodash-es";

const FilterSelect = ({ category, filters, setFilters }: FilterSelectProps) => {
  const { data, loading } = useQuery(
    generateGraphQLQuery({
      type: "find",
      objectName: category.connected_class,
      fields: [category.key, "label", "objectId"],
    })
  );

  if (loading) return <Loader width="180px" height="30px" />;

  if (data) {
    const filter = filters.find((filter) => filter.key === "categories");
    const options = get(
      data,
      `objects.find${category.connected_class}.results`,
      []
    ).map((result: any) => ({ label: result.label, value: result.objectId }));

    return (
      <Select
        label=""
        width="180px"
        options={options}
        value={filter?.value || null}
        onChange={(value) =>
          setFilters(
            filterChangeHandler("categories", value.value, "_in", filters)
          )
        }
        placeholder={category.label}
        isClearable={false}
      />
    );
  }

  return null;
};

export default FilterSelect;
