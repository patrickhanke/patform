import { ModuleCategory } from "@repo/types";

const initialCategoryValues: ModuleCategory = {
  id: "" as string,
  moduleId: "",
  label: "Neue Kategorie" as string,
  key: "" as string,
  connected_class: "",
  is_multi: false,
  position: 0,
};

export default initialCategoryValues;
