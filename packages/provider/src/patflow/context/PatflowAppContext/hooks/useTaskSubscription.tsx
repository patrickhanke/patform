"use client";

import { useCallback, useEffect } from "react";
import { Task, TaskState } from "@repo/types";
import Parse from "../../../../general/data/parse";
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
	const { setTasks } = useDataStore();

	const fetchTasks = useCallback(async () => {
		if (!projectId) {
			setTasks([]);
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

		setTasks(fetchedTasks);
	}, [projectId, setTasks]);

	useEffect(() => {
		void fetchTasks();
	}, [fetchTasks]);

	useEffect(() => {
		if (!projectId) {
			return;
		}

		let subscription: Parse.LiveQuerySubscription | undefined;
		let isCancelled = false;

		const TaskClass = Parse.Object.extend("Task");
		const projectPointer = createProjectPointer(projectId);
		const query = new Parse.Query(TaskClass);

		query.equalTo("project", projectPointer);
		query.notEqualTo("state", ARCHIVED_STATE);

		const refreshTasks = () => {
			void fetchTasks();
		};

		const subscribeToChanges = async () => {
			try {
				subscription = await query.subscribe();

				if (isCancelled || !subscription) {
					return;
				}

				subscription.on("create", refreshTasks);
				subscription.on("update", refreshTasks);
				subscription.on("enter", refreshTasks);
				subscription.on("leave", refreshTasks);
				subscription.on("delete", refreshTasks);
			} catch (error) {
				console.error("Task subscription failed", error);
			}
		};

		void subscribeToChanges();

		return () => {
			isCancelled = true;
			if (subscription) {
				void subscription.unsubscribe();
			}
		};
	}, [fetchTasks, projectId]);
};

export default useTaskSubscription;
