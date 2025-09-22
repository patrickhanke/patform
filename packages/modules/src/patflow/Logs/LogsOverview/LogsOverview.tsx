import { useContext, useState } from "react";
import useFindLogs from "./hooks/useFindLogs";
import { PatstoreAppContext } from "@repo/provider";
import { Filter } from "@repo/types";

const LogsOverview = () => {
	const { currentModule } = useContext(PatstoreAppContext);

	const [filters, setFilters] = useState<Filter[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10
	});
	const [selectedRows, setSelectedRows] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const { persons, refetch, count } = useFindLogs({
		moduleId: currentModule.objectId,
		filters,
		limit: pagination.pageSize,
		skip: pagination.pageIndex * pagination.pageSize
	});

	return <div>LogsOverview</div>;
};

export default LogsOverview;
