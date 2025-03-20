import { FIND_ALL_TASKS } from "@repo/provider";
import { ApolloRefetch, Filter, Task } from "@repo/types";
import { useQuery } from "@apollo/client";
import { useGetTasksHook } from "../types";

type GetTaskObject = {
  loading: boolean;
  tasks?: Task[];
  refetch: ApolloRefetch;
};

const paramsHandler = (id?: string, className?: string, filters?: Filter[]) => {
  if (id && className === "Property") return { property: { _eq: id } };
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

const useGetTasks = ({ id, className, filters }: useGetTasksHook) => {
  const { loading, data, refetch } = useQuery(FIND_ALL_TASKS, {
    variables: { params: paramsHandler(id, className, filters) },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  return {
    loading,
    tasks: data ? data.objects.findTask.results : undefined,
    refetch,
  } as GetTaskObject;
};

export default useGetTasks;
