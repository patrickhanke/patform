import { CalendarDateObject, Task } from "@repo/types";

const createEventFromTask: (tasks: Task[]) => CalendarDateObject[] = (
	tasks: Task[]
) => {
	return tasks.map((task) => {
		return {
			label: task.title,
			text: task.description,
			full_day: false,
			id: task.objectId,
			assigned_users: task.assigned_staff,
			place: {
				type: "address",
				address: task.property.name,
				map: null,
				online: undefined,
				location: undefined
			},
			time: task.time
		};
	});
};

export default createEventFromTask;
