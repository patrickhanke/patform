import { useQuery } from "@apollo/client";
import { useMemo } from "react";
import { GetRecordObject } from "../types";
import { find_record } from "@queries";
import { Filter } from "@repo/types";

const paramsHandler = (filters?: Filter[]) => {
  if (filters && filters?.length > 0) {
    const filterObject = filters?.reduce(
      (acc: { [key: string]: { [op: string]: any } }, filter: Filter) => {
        acc[filter.key] = { [filter.operator]: filter.value };
        return acc;
      },
      {},
    );
    return filterObject;
  }
  return undefined;
};

const useGetRecords = ({ filters }: { filters: Filter[] }) => {
  const { loading, data, refetch } = useQuery(find_record, {
    variables: { params: paramsHandler(filters) },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  const returnValue: GetRecordObject = useMemo(() => {
    return {
      loading,
      records: data?.objects.findRecord?.results || [],
      refetch,
    };
  }, [loading, data, refetch]);

  return returnValue;
};

export default useGetRecords;
