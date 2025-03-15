import React from 'react';
import styles from '../Tickets.module.scss';
import { getDateStringsFromIso } from '@repo/provider';
import { Icon } from '@repo/ui';

const TicketDate = ({ ticketDate }: { ticketDate: string }) => {
    return (
        <div className={styles.ticket_date_container}>
            <div className={styles.ticket_subheadline}>
                <Icon
                    type="clock"
                    size={12}
                />
                <span
                    style={{ whiteSpace: 'nowrap' }}
                >{`${getDateStringsFromIso(ticketDate).dateTime}`}</span>
            </div>
        </div>
    );
};

export default TicketDate;
