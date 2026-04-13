"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Filter } from "@repo/types";
import { TasksComponent } from "./types";
import { useSearchParams } from "next/navigation";
import SiteHeaderContent from "./components/SiteHeaderContent";
import sortTasksForList from "./functions/sortTasksForList";
import TaskList from "./content/TaskList";
import { Divider, generatePagination, Page } from "@repo/ui";
import site_states from "./constants/site_states";
import { useDataStore } from "@repo/provider";
import TaskModal from "./components/TaskModal";

const Tasks = ({ id, className, pageState }: TasksComponent) => {
	const [filters, setFilters] = React.useState([] as Filter[]);
	const [siteState, setSiteState] = useState<(typeof site_states)[number]>(
		site_states[0] as (typeof site_states)[0]
	);
	const searchParams = useSearchParams();
	const [selectedRows, setSelectedRows] = useState<string[]>([]);
	const [taskModal, setTaskModal] = useState<"close" | "archive" | undefined>(
		undefined
	);

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 20
	});

	const { tasks: storeTasks, getTasks } = useDataStore();
	const count = storeTasks.length;

	const tasks = getTasks(
		filters,
		pageState !== "active" ? pagination.pageIndex * pagination.pageSize : 0,
		pageState !== "active" ? pagination.pageSize : 300,
		id || ""
	);

	const initialFilters: () => Filter[] = useCallback(() => {
		const filterArray: Filter[] = [];
		if (!id) {
			if (pageState === "active") {
				filterArray.push({
					key: "state",
					value: ["assigned", "created"],
					operator: "in"
				});
			} else if (pageState === "executed") {
				filterArray.push({
					key: "state",
					value: "executed",
					operator: "equalTo"
				});
			} else if (pageState === "completed") {
				filterArray.push({
					key: "state",
					value: "completed",
					operator: "equalTo"
				});
			} else if (pageState === "archived") {
				filterArray.push({
					key: "state",
					value: "archived",
					operator: "equalTo"
				});
			}
		}
		if (searchParams.get("task")) {
			filterArray.push({
				key: "objectId",
				value: searchParams.get("task") as string,
				operator: "equalTo"
			});
		}

		return filterArray;
	}, [pageState, searchParams.get("task")]);

	const siteContent = useMemo(() => {
		const content = {
			title: "Aufgaben",
			description: ""
		};
		if (pageState === "active") {
			content.title = "Aktive Aufgaben";
			content.description =
				"Hier finden Sie alle Aufgaben, die noch nicht erledigt sind.";
		} else if (pageState === "executed") {
			content.title = "Ausgeführte Aufgaben";
			content.description = "Hier finden Sie alle ausgeführten Aufgaben.";
		} else if (pageState === "completed") {
			content.title = "Erledigte Aufgaben";
			content.description = "Hier finden Sie alle erledigten Aufgaben.";
		} else if (pageState === "archived") {
			content.title = "Archivierte Aufgaben";
			content.description = "Hier finden Sie alle archivierten Aufgaben.";
		}

		return content;
	}, [pageState]);

	useEffect(() => {
		setFilters(initialFilters());
	}, [siteState, initialFilters]);

	const siteStates = useMemo(() => {
		return site_states.map((state) => ({
			...state,
			label: `${state.label} (${sortTasksForList(tasks || []).find((taskList) => taskList.value === state.value)?.data.length || "0"})`,
			count: tasks?.filter((task) => task.state === state.value).length
		}));
	}, [tasks]);

	const pageHeaderButtons = useMemo(() => {
		if (pageState === "executed") {
			return [
				{
					type: "button",
					text: "Aufgaben schließen",
					onClick: () => setTaskModal("close"),
					color: "primary",
					is_add_button: false,
					disabled: selectedRows.length === 0
				}
			];
		}
		if (pageState === "completed") {
			return [
				{
					type: "button",
					text: "Aufgaben archivieren",
					onClick: () => setTaskModal("archive"),
					color: "primary",
					is_add_button: false,
					disabled: selectedRows.length === 0
				}
			];
		}
	}, [pageState, selectedRows]);

	if (id && className) {
		return (
			<>
				<Divider size="small" showLine={false} />
				<TaskList
					taskList={tasks || []}
					pageState={pageState}
					pagination={pagination}
					setPagination={setPagination}
					count={count}
					filterContent={
						<SiteHeaderContent
							id={id}
							filters={filters}
							setFilters={setFilters}
							initialFilters={initialFilters}
						/>
					}
				/>
			</>
		);
	}

	return (
		<Page
			title={siteContent.title}
			description={siteContent.description}
			pageStates={pageState === "active" ? siteStates : undefined}
			pageState={siteState}
			setPageState={setSiteState}
			pageHeaderButtons={pageHeaderButtons}
		>
			{pageState !== "active" ? (
				<TaskList
					key={pageState}
					taskList={tasks || []}
					pageState={pageState}
					pagination={pagination}
					setPagination={setPagination}
					enableRowSelection={true}
					setSelectedRows={setSelectedRows}
					selectedRows={selectedRows}
					count={count}
					filterContent={
						<SiteHeaderContent
							id={id}
							filters={filters}
							setFilters={setFilters}
							initialFilters={initialFilters}
						/>
					}
				/>
			) : (
				<TaskList
					key={pageState}
					taskList={generatePagination({
						data:
							sortTasksForList(tasks || []).find(
								(taskList) => taskList.value === siteState.value
							)?.data || [],
						pagination
					})}
					pageState={pageState}
					pagination={pagination}
					setPagination={setPagination}
					count={
						(
							sortTasksForList(tasks || []).find(
								(taskList) => taskList.value === siteState.value
							)?.data || []
						).length || 0
					}
					filterContent={
						<SiteHeaderContent
							id={id}
							filters={filters}
							setFilters={setFilters}
							initialFilters={initialFilters}
						/>
					}
				/>
			)}
			<TaskModal
				isOpen={taskModal === "close" || taskModal === "archive"}
				setIsOpen={() => {
					setTaskModal(undefined);
					setSelectedRows([]);
				}}
				tasks={selectedRows}
				type={taskModal}
			/>
		</Page>
	);
};

export default Tasks;
