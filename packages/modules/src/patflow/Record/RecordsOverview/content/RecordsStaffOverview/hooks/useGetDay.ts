import { find_day } from "@repo/provider";
import { useQuery } from "@apollo/client";
import { UseGetDay } from "../types";

const useGetDay: UseGetDay = ({ year, user }) => {
  const { loading, data, refetch } = useQuery(find_day, {
    variables: { params: { year: { _eq: year }, user: { _eq: user } } },
    notifyOnNetworkStatusChange: true,
    skip: !year || !user,
  });

  return {
    loading,
    days: data ? data.objects.findDay.results : [],
    refetch,
  };
};

export default useGetDay;
