import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Task } from "@repo/types";
import TaskTitle from "../components/TaskTitle";
import DisplayProperty from "../content/DisplayPropery";
import DisplayTaskState from "../content/DisplayTaskState";
import TeamAssignments from "../content/TeamAssignment";
import TaskSlideIn from "../content/TaskSlideIn";
import { UseTaskColumnsProps } from "../types";
import { getDateString } from "@repo/provider";
import { TaskDate } from "../content/TaskDate";

const useTableColumns = ({ refetch, pageState }: UseTaskColumnsProps) => {
	const columns: ColumnDef<Task>[] = useMemo(() => {
		const col: ColumnDef<Task>[] = [
			{
				accessorFn: (task) => (
					<TaskTitle
						taskId={task.objectId}
						taskTitle={task.title}
						refetch={refetch}
						taskState={task.state}
					/>
				),
				header: () => <span>Titel</span>,
				id: "title",
				cell: (info) => info.getValue(),
				// footer: info => info.column.id,
				enableSorting: true,
				sortingFn: (rowA, rowB) => {
					const titleA = rowA.original.title.toLowerCase();
					const titleB = rowB.original.title.toLowerCase();
					if (titleA < titleB) return -1;
					if (titleA > titleB) return 1;
					return 0;
				}
			},
			{
				accessorFn: (task) => (
					<TaskDate taskId={task.objectId} tasksRefetch={refetch} />
				),
				header: () => <span>Termin</span>,
				id: "start_time",
				cell: (info) => info.getValue(),
				enableSorting: pageState === "active" ? true : false,
				sortingFn: (rowA, rowB) => {
					const dateA = rowA.original.dates[0]
						? new Date(rowA.original.dates[0]).getTime()
						: 0;
					const dateB = rowB.original.dates[0]
						? new Date(rowB.original.dates[0]).getTime()
						: 0;
					return dateA - dateB;
				},
				footer: (info) => info.column.id
			},
			{
				accessorFn: (task) => (
					<DisplayProperty
						taskId={task.objectId}
						taskProperty={task.property}
						isEditable={pageState === "active"}
						refetchTasks={refetch}
					/>
				),
				header: () => <span>Objekt</span>,
				id: "property",
				cell: (info) => info.getValue(),
				enableSorting: false,
				footer: (info) => info.column.id
			},
			{
				accessorFn: (task) => (
					<DisplayTaskState taskState={task.state} />
				),
				header: () => <span>Status</span>,
				id: "state",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},

			{
				accessorFn: (task) => (
					<TeamAssignments
						task={task}
						refetch={refetch}
						showAsButton
					/>
				),
				header: () => <span>Zugewiesen an</span>,
				id: "absence_days",
				enableSorting: false,
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (task) => (
					<TaskSlideIn
						title={task.title}
						taskId={task.objectId}
						isEditable={
							task.state === "created" ||
							task.state === "assigned"
						}
						refetchTasks={refetch}
					/>
				),
				header: () => <span>Info</span>,
				id: "info",
				enableSorting: false,
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			}
		];

		if (pageState !== "active") {
			col.splice(2, 0, {
				accessorFn: (task) =>
					task.executed_at
						? `${getDateString(task.executed_at).date} - ${getDateString(task.executed_at).time}`
						: "-",
				header: () => {
					return <span>Ausgeführt am</span>;
				},
				id: "executed_at",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: true,
				sortingFn: (rowA, rowB) => {
					const dateA = rowA.original.executed_at
						? new Date(rowA.original.executed_at).getTime()
						: 0;
					const dateB = rowB.original.executed_at
						? new Date(rowB.original.executed_at).getTime()
						: 0;
					return dateA - dateB;
					// return 0;
				}
			});
		}

		return col;
	}, []);

	return columns;
};

export default useTableColumns;
