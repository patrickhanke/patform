import { TaskState } from "@repo/types";
import { StateDisplay, StateSelect } from "@repo/ui";
import { task_state_options, useDataHandler } from "@repo/provider";
import "./styles.scss";

const DisplayTaskState = ({
	taskState,
	taskId,
	isService = false
}: {
	taskState: TaskState;
	isService?: boolean;
	taskId?: string;
}) => {
	const { updateData } = useDataHandler();
	const state: (typeof task_state_options)[number] = task_state_options.find(
		(state) => state.value === taskState
	) as (typeof task_state_options)[number];

	if (isService) {
		const service_state_options = task_state_options.filter(
			(state) => state.id === "created" || state.id === "assigned"
		);
		return (
			<div className="task_state_container">
				<StateSelect<typeof service_state_options>
					stateOptions={service_state_options}
					state={taskState}
					icon="info"
					type="state"
					stateSelectHandler={(state) => {
						if (taskId) {
							updateData({
								className: "Task",
								objectId: taskId,
								updateObject: {
									state: state.value
								}
							});
						}
					}}
				/>
			</div>
		);
	}

	return (
		<div className="task_state_container">
			<StateDisplay
				label={state.label}
				color={state.color}
				icon="clock"
			/>
		</div>
	);
};

export default DisplayTaskState;
