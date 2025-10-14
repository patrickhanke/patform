import { find_day } from "@repo/provider";
import { useQuery } from "@apollo/client";
import { UseFindDays } from "../types";

const useFindDays: UseFindDays = ({ year, users = [] }) => {
	const { loading, data, refetch } = useQuery(find_day, {
		variables: { params: { year: { _eq: year }, user: { _in: users } } },
		notifyOnNetworkStatusChange: true,
		skip: !year || users.length === 0
	});

	console.log({ data });

	return {
		loading,
		days: data ? data.objects.findDay.results : [],
		refetch
	};
};

export default useFindDays;
