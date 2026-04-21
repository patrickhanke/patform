import { Task, Filter, Ticket } from "@repo/types";
import { get, isArray } from "lodash-es";

const dataFilterHandler = (task: Task | Ticket, filters: Filter[]) => {
	let match = true;
	for (const filter of filters) {
		if (filter.operator === "matchesRegex") {
			if (
				!task[filter.key as keyof (Task | Ticket)]?.includes(
					filter.value
				)
			) {
				match = false;
			}
		}
		if (filter.operator === "have") {
			const filterValue = get(filter, `value.id.equalTo`, undefined);
			const taskValue = get(task, `${filter.key}.objectId`, undefined);
			if (taskValue !== filterValue) {
				match = false;
			}
		}
		if (filter.operator === "equalTo") {
			if (task[filter.key as keyof (Task | Ticket)] !== filter.value) {
				match = false;
			}
		}
		if (filter.operator === "in") {
			const taskValues = task[filter.key as keyof (Task | Ticket)];
			const filterValues = filter.value;
			if (isArray(taskValues) && isArray(filterValues)) {
				if (
					!taskValues.some(
						(item: unknown) =>
							(typeof item === "string" ||
								typeof item === "number") &&
							filterValues.includes(item)
					)
				) {
					match = false;
				}
			} else if (isArray(taskValues) && !isArray(filterValues)) {
				if (!taskValues.includes(filterValues)) {
					match = false;
				}
			} else if (!isArray(taskValues) && isArray(filterValues)) {
				if (!filterValues.includes(taskValues)) {
					match = false;
				}
			}
		}
	}
	return match;
};

export default dataFilterHandler;
