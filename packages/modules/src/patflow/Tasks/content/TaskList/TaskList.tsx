"use client";

import { TaskListComponent } from "./types";
import useTableColumns from "./hooks/useTableColumns";
import { Table } from "@repo/ui";

const TaskList = ({
	taskList,
	pageState,
	pagination,
	setPagination,
	count,
	filterContent,
	enableRowSelection = false,
	selectedRows,
	setSelectedRows,
	filters,
	setFilters,
	filterColumns
}: TaskListComponent) => {
	const columns = useTableColumns({
		pageState
	});

	return (
		<>
			<div>
				<Table
					data={taskList}
					columns={columns}
					pagination={pagination}
					setPagination={setPagination}
					rowCount={count}
					filterContent={filterContent}
					enableRowSelection={enableRowSelection}
					selectedRows={selectedRows}
					setSelectedRows={setSelectedRows}
					filters={filters}
					setFilters={setFilters}
					filterColumns={filterColumns}
				/>
			</div>
		</>
	);
};

export default TaskList;
