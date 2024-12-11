import React, { useCallback } from 'react';
import styles from '../Tickets.module.scss';
import { useDataHandler } from '@provider';
import { TicketStateProps } from '../types';
import { StateDisplay } from '@repo/ui';

const TicketState = ({ticketId, ticketState, refetch}: TicketStateProps) => {
	const {updateData} = useDataHandler();
	const updateTicketState = useCallback(async (state: string) => {
		await updateData({
			className: 'Ticket',
			objectId: ticketId,
			updateObject: {
				state
			}
		});
		refetch();
	}, []);
	
	return (
		<div className={styles.ticket_state_container} >
			<div className={styles.ticket_subheadline}>
				<StateDisplay<'state'>
					state={ticketState}
					type='TicketState'
					icon='clock'
					displayInterface={ticketState === 'closed' ?  false : true}
					stateSelectHandler={updateTicketState}
				/>
			</div>
		</div>
	);
};

export default TicketState;