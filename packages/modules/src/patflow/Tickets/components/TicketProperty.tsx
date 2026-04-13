import { useDataStore } from "@repo/provider";
import styles from "../Tickets.module.scss";
import { Icon } from "@repo/ui";

const TicketProperty = ({ ticketProperty }: { ticketProperty: string }) => {
	const { properties } = useDataStore();
	const property = properties.find(
		(property) => property.objectId === ticketProperty
	);
	return (
		<div className={styles.ticket_date_container}>
			<div className={styles.ticket_subheadline}>
				<Icon type="house" size={12} />
				<span style={{ whiteSpace: "nowrap" }}>{property?.name}</span>
			</div>
		</div>
	);
};

export default TicketProperty;
