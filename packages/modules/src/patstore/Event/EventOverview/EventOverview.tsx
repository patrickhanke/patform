"use client";

import { useContext, useState } from "react";
import {
	generateColumnsFromFields,
	Page,
	Table,
	useCreateColumns
} from "@repo/ui";
import { EventClass } from "@repo/types";
import { PatstoreAppContext } from "@repo/provider";
import createEvent from "./constants/createEvent";
import useFindEvent from "./hooks/useFindEvent";

const EventOverview = () => {
	const { currentModule } = useContext(PatstoreAppContext);
	const [filters] = useState([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const { events, refetch } = useFindEvent({
		module: currentModule,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize
	});

	const columns = useCreateColumns<EventClass>({
		data: generateColumnsFromFields(currentModule.fields),
		fields: currentModule.data_fields,
		className: "Event",
		refetch,
		categories: currentModule?.categories
	});

	return (
		<Page
			title={currentModule.name}
			emptyContent={true}
			createClass={createEvent}
			refetch={refetch}
		>
			<Table
				columns={columns}
				data={events || []}
				pagination={pagination}
				setPagination={setPagination}
			/>
		</Page>
	);
};

export default EventOverview;
