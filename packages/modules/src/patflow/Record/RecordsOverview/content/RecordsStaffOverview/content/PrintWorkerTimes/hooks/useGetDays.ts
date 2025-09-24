import { find_day } from "@repo/provider";
import { useQuery } from "@apollo/client";
import { UseGetDays } from "../types";

const useGetDays: UseGetDays = ({ month, users = [] }) => {
	const { loading, data, refetch } = useQuery(find_day, {
		variables: { params: { month: { _eq: month }, user: { _in: users } } },
		notifyOnNetworkStatusChange: true,
		skip: !month || users.length === 0
	});

	console.log({ data });

	return {
		loading,
		days: data ? data.objects.findDay.results : [],
		refetch
	};
};

export default useGetDays;
