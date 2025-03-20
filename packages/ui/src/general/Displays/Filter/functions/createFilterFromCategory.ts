import { Filter, ModuleCategory } from "@repo/types";

const createFilterFromCategory: (category: ModuleCategory) => Filter = (
  category,
) => {
  return {
    id: category.id,
    key: "categories",
    value: [],
    operator: "_in",
  };
};

export default createFilterFromCategory;
