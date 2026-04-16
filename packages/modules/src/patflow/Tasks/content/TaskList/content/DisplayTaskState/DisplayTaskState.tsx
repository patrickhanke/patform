import { TaskState } from "@repo/types";
import { StateDisplay, StateSelect } from "@repo/ui";
import { task_state_options } from "@repo/provider";
import "./styles.scss";

const DisplayTaskState = ({
	taskState,
	isService = false
}: {
	taskState: TaskState;
	isService?: boolean;
}) => {
	const state: (typeof task_state_options)[number] = task_state_options.find(
		(state) => state.value === taskState
	) as (typeof task_state_options)[number];

	console.log({ isService });

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
						console.log(state);
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
