import { TaskState } from "@repo/types";
import { Loader, StateDisplay } from "@repo/ui";
import { task_state_options } from "@repo/provider";
import "./styles.scss";

const DisplayTaskState = ({ taskState }: { taskState: TaskState }) => {
	const state: (typeof task_state_options)[number] = task_state_options.find(
		(state) => state.value === taskState
	) as (typeof task_state_options)[number];

	if (state)
		return (
			<div className="task_state_container">
				<StateDisplay
					label={state.label}
					color={state.color}
					icon="clock"
				/>
			</div>
		);

	return <Loader width="30px" height="18px" />;
};

export default DisplayTaskState;
