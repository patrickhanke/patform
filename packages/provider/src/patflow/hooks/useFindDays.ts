import { useFindData } from "@repo/provider";
import { Day, ApolloRefetch, Filter } from "@repo/types";

type UseFindDays = (P: {
	userId?: string;
	skipQuery?: boolean;
	absenceId?: string;
	year?: number;
	userIds?: string[];
}) => {
	data: Day[];
	loading: boolean;
	refetch: ApolloRefetch;
};

const useFindDays: UseFindDays = ({
	userId,
	skipQuery = false,
	absenceId,
	year,
	userIds
}) => {
	const filters: Filter[] = [];
	if (year) {
		filters.push({
			key: "year",
			value: year,
			operator: "equalTo"
		});
	}

	const { data, loading, refetch } = useFindData({
		objectName: "Day",
		fields: [
			"objectId",
			"year",
			"month",
			"date",
			"is_working_day",
			"time",
			"default_time",
			"surcharges",
			"iso_date",
			"absence { objectId start_date end_date state type }",
			"saldo",
			"type",
			"iso_date",
			"comment",
			"user { objectId }",
			"record { objectId }",
			"worktime"
		],
		filters,
		userId: userId,
		userIds: userIds,
		skipQuery: skipQuery,
		absenceId: absenceId
	});

	return {
		data,
		loading,
		refetch
	};
};

export default useFindDays;
