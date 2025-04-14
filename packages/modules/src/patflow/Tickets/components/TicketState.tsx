import { useCallback } from "react";
import styles from "../Tickets.module.scss";
import { useDataHandler } from "@repo/provider";
import { TicketStateProps } from "../types";
import { StateSelect } from "@repo/ui";
import { ticket_state_options } from "@repo/provider";

const TicketState = ({ ticketId, ticketState, refetch }: TicketStateProps) => {
	const { updateData } = useDataHandler();
	const updateTicketState = useCallback(
		async (state: (typeof ticket_state_options)[number]) => {
			console.log(state);

			await updateData({
				className: "Ticket",
				objectId: ticketId,
				updateObject: {
					state: state.value
				}
			});
			refetch();
		},
		[ticketId, ticketState]
	);

	return (
		<div className={styles.ticket_state_container}>
			<div className={styles.ticket_subheadline}>
				<StateSelect<typeof ticket_state_options>
					type="state"
					state={ticketState}
					stateOptions={[...ticket_state_options]}
					icon="clock"
					stateSelectHandler={updateTicketState}
				/>
			</div>
		</div>
	);
};

export default TicketState;
