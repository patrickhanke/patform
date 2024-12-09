import React from 'react';
import styles from '../Tickets.module.scss';
import { Icon } from '@/_UI/surfaces';

const TicketProperty = ({ticketProperty}: {ticketProperty: string}) => {
	return (
		<div className={styles.ticket_date_container} >
			<div className={styles.ticket_subheadline}>
				<Icon type='house' size={12} />
				<p>{ticketProperty}</p>
			</div>
		</div>
	);
};

export default TicketProperty;