import { useQuery } from "@apollo/client";
import { FIND_ALL_TALLIES } from "@repo/provider";
import { useFindTalliesHook } from "../types";

const paramsHandler = (id: string, className: string) => {
  if (className === "Property") return { property: { _eq: id } };
  return undefined;
};

const useFindTallies = ({ id, className }: useFindTalliesHook) => {
  const { loading, refetch, data } = useQuery(FIND_ALL_TALLIES, {
    variables: { params: paramsHandler(id, className) },
    notifyOnNetworkStatusChange: true,
  });

  return {
    loading,
    refetch,
    tallies: data ? data.objects.findTally.results : undefined,
  };
};

export default useFindTallies;
