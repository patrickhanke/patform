import React from 'react';
import styles from '../Tickets.module.scss';
import { getDateStringsFromIso } from '@provider';
import { Icon } from '@repo/ui';

const TicketDate = ({ticketDate}: {ticketDate: string}) => {
	return (
		<div className={styles.ticket_date_container} >
			<div className={styles.ticket_subheadline}>
				<Icon type='clock' size={12} />
				<p>{`${getDateStringsFromIso(ticketDate).datum} - ${getDateStringsFromIso(ticketDate).uhrzeit}`}</p>
			</div>
		</div>
	);
};

export default TicketDate;