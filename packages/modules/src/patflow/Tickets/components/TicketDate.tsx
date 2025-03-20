import React from "react";
import styles from "../Tickets.module.scss";
import { getDateString } from "@repo/provider";
import { Icon } from "@repo/ui";

const TicketDate = ({ ticketDate }: { ticketDate: string }) => {
  return (
    <div className={styles.ticket_date_container}>
      <div className={styles.ticket_subheadline}>
        <Icon type="clock" size={12} />
        <span
          style={{ whiteSpace: "nowrap" }}
        >{`${getDateString(ticketDate).dateTime}`}</span>
      </div>
    </div>
  );
};

export default TicketDate;
