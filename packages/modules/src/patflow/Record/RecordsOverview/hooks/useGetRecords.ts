import { useFindData } from "@repo/provider";
import { useMemo } from "react";
import { GetRecordObject } from "../types";
import { Filter } from "@repo/types";

const useGetRecords = ({ filters }: { filters: Filter[] }) => {
  const { loading, data, refetch } = useFindData({
    objectName: "Record",
    fields: ["objectId", "year", "user {objectId}", "default_times", "createdAt"],
    filters: filters || []
  });

  const returnValue: GetRecordObject = useMemo(() => {
    return {
      loading,
      records: data || [],
      refetch,
    };
  }, [loading, data, refetch]);

  return returnValue;
};

export default useGetRecords;
