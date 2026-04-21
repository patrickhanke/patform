import { TaskList } from "@repo/modules";
import { Suspense, useState } from "react";
import { useFindData } from "@repo/provider";
import { Filter } from "@repo/types";
import property_tasks_filters from "./constants/property_tasks_filters.";

const PropertyTasks = ({ objectId }: { objectId: string }) => {
	const [filters, setFilters] = useState([] as Filter[]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const { data, count } = useFindData({
		objectName: "Task",
		fields: [
			"objectId",
			"title",
			"description",
			"property { objectId name }",
			"time",
			"state",
			"description",
			"assigned_staff",
			"ticket { objectId title }",
			"dates",
			"images",
			"executed_at",
			"category",
			"is_service",
			"comments"
		],
		propertyId: objectId,
		filters: filters
	});

	return (
		<Suspense>
			<TaskList
				taskList={data || []}
				pageState="active"
				pagination={pagination}
				setPagination={setPagination}
				count={count}
				filters={filters}
				setFilters={setFilters}
				filterColumns={property_tasks_filters}
			/>
		</Suspense>
	);
};

export default PropertyTasks;
