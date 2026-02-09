import { useFindData } from "@repo/provider";
import { Filter } from "@repo/types";
import { useFindTalliesHook } from "../types";

const paramsHandler = (id: string, className: string): Filter[] => {
  if (className === "Property") return [{ key: "property", value: id, operator: "equalTo" }];
  return [];
};

const useFindTallies = ({ id, className }: useFindTalliesHook) => {
  const { loading, refetch, data } = useFindData({
    objectName: "Tally",
    fields: ["objectId", "name", "description", "entries"],
    filters: paramsHandler(id, className)
  });

  return {
    loading,
    refetch,
    tallies: data,
  };
};

export default useFindTallies;
