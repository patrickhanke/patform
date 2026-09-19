"use client";

import { useCallback, useEffect } from "react";
import { Service, Task, TaskState } from "@repo/types";
import Parse from "./parse";
import useDataStore from "./useDataStore";

const TASK_PAGE_SIZE = 100;
const ARCHIVED_STATE: TaskState = "archived";

const createProjectPointer = (projectId: string) => {
	const ProjectClass = Parse.Object.extend("Project");
	const projectPointer = new ProjectClass();
	projectPointer.id = projectId;

	return projectPointer;
};

const toTask = (taskObject: Parse.Object) =>
	({
		...taskObject.toJSON(),
		objectId: taskObject.id
	}) as Task;

const useTaskSubscription = (projectId?: string) => {
	const { setTasks, setServices } = useDataStore();

	const fetchTasks = useCallback(async () => {
		if (!projectId) {
			setTasks([]);
			setServices([]);
			return;
		}

		const TaskClass = Parse.Object.extend("Task");
		const projectPointer = createProjectPointer(projectId);
		const fetchedTasks: Task[] = [];
		let skip = 0;

		while (true) {
			const query = new Parse.Query(TaskClass);
			query.equalTo("project", projectPointer);
			query.notEqualTo("state", ARCHIVED_STATE);
			query.limit(TASK_PAGE_SIZE);
			query.skip(skip);
			query.descending("createdAt");

			const taskPage = await query.find();
			fetchedTasks.push(...taskPage.map(toTask));

			if (taskPage.length < TASK_PAGE_SIZE) {
				break;
			}

			skip += TASK_PAGE_SIZE;
		}
		setServices(
			fetchedTasks.filter((task) => task.is_service === true) as Service[]
		);
		setTasks(fetchedTasks.filter((task) => task.is_service !== true));
	}, [projectId, setTasks, setServices]);

	useEffect(() => {
		void fetchTasks();

		if (!projectId) {
			return;
		}

		const intervalId = window.setInterval(() => {
			void fetchTasks();
		}, 30_000);

		return () => {
			window.clearInterval(intervalId);
		};
	}, [fetchTasks, projectId]);
};

export default useTaskSubscription;
