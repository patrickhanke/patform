import React from 'react';
import styles from '../Tickets.module.scss';
import { Icon } from '@repo/ui';

const TicketProperty = ({ ticketProperty }: { ticketProperty: string }) => {
    return (
        <div className={styles.ticket_date_container}>
            <div className={styles.ticket_subheadline}>
                <Icon
                    type="house"
                    size={12}
                />
                <span style={{ whiteSpace: 'nowrap' }}>{ticketProperty}</span>
            </div>
        </div>
    );
};

export default TicketProperty;
