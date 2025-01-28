import React, { useCallback } from 'react';
import styles from '../Tickets.module.scss';
import { useDataHandler } from '@repo/provider';
import { TicketStateProps } from '../types';
import { StateSelect } from '@repo/ui';
import { ticket_state_options } from '@provider';

const TicketState = ({ticketId, ticketState, refetch}: TicketStateProps) => {
	const {updateData} = useDataHandler();
	const updateTicketState = useCallback(async (state: string | object | number) => {
		await updateData({
			className: 'Ticket',
			objectId: ticketId,
			updateObject: {
				state
			}
		});
		refetch();
	}, [ticketId, ticketState]);

	return (
		<div className={styles.ticket_state_container} >
			<div className={styles.ticket_subheadline}>
				<StateSelect
					type='state'
					state={ticketState}
					stateOptions={ticket_state_options}
					icon='clock'
					displayInterface={ticketState === 'closed' ?  false : true}
					stateSelectHandler={updateTicketState}
				/>
			</div>
		</div>
	);
};

export default TicketState;