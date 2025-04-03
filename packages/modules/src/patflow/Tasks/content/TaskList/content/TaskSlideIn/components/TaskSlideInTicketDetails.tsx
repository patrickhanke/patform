import { Ticket } from "@repo/types";
import styles from "../TaskSlideIn.module.scss";
import { DisplayWorker, ImagesDisplay } from "@repo/ui";

const TaskSlideInTicketDetails = ({ ticket }: { ticket: Ticket }) => {
	return (
		<div>
			<div className={styles.task_slidein_content}>
				<label>Title</label>
				<p>{ticket.title}</p>
			</div>
			<div className={styles.task_slidein_content}>
				<label>Erstellt durch</label>
				<DisplayWorker workerId={ticket.created_by.objectId} />
			</div>
			<div className={styles.task_slidein_content}>
				<label>Beschreibung</label>
				{ticket.description ? (
					<p>{ticket.description}</p>
				) : (
					<p>Keine Beschreibung vorhanden</p>
				)}
			</div>
			<div className={styles.task_slidein_content}>
				<label>Objekt</label>
				<p>{ticket?.property?.name}</p>
			</div>
			<div className={styles.task_slidein_content}>
				<label>Bilder</label>
				<div className="images_container">
					{ticket.images && ticket.images.length > 0 ? (
						<ImagesDisplay images={ticket.images} />
					) : (
						<p>Kein Bilder hinterlegt </p>
					)}
				</div>
			</div>
		</div>
	);
};

export default TaskSlideInTicketDetails;
