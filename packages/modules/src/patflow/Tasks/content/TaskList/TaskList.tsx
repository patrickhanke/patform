"use client";

import { TaskListComponent } from "./types";
import useTableColumns from "./hooks/useTableColumns";
import { Table } from "@repo/ui";

const TaskList = ({
	taskList,
	refetch,
	pageState,
	pagination,
	setPagination,
	count,
	filterContent,
	enableRowSelection = false,
	selectedRows,
	setSelectedRows
}: TaskListComponent) => {
	const columns = useTableColumns({
		refetch,
		pageState
	});

	console.log({ taskList });

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
				/>
			</div>
		</>
	);
};

export default TaskList;
