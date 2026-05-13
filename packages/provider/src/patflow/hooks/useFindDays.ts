import { useFindData } from "@repo/provider";
import { Filter } from "@repo/types";

const useFindDays = ({
	userId,
	skipQuery = false,
	absenceId,
	year,
	userIds
}: {
	userId?: string;
	skipQuery?: boolean;
	absenceId?: string;
	year?: number;
	userIds?: string[];
}) => {
	const filters: Filter[] = [];
	if (absenceId) {
		filters.push({
			key: "absence",
			value: absenceId,
			operator: "equalTo"
		});
	}

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
			"record { objectId }"
		],
		filters,
		userId: userId,
		userIds: userIds,
		skipQuery: skipQuery
	});

	return {
		data,
		loading,
		refetch
	};
};

export default useFindDays;
