import { useCallback, useState } from "react";
import styles from "./TicketDetails.module.scss";
import clsx from "clsx";
import { TicketDetailsProps } from "@repo/types";
import { Icon, ImagesDisplay, Modal, SlideInRight } from "@repo/ui";

const TicketDetails = ({
	ticket,
	deleteTicket,
	archiveTicket,
	refetch
}: TicketDetailsProps) => {
	const [archiveModal, setArchiveModal] = useState(false);
	const [deleteTicketModal, setDeleteTicketkModal] = useState(false);
	const [showDetails, setShowDetails] = useState(false);
	const [loading, setLoading] = useState(false);

	const deleteTicketHandler = useCallback(async () => {
		setDeleteTicketkModal(false);
		await deleteTicket(ticket.objectId);
		await refetch();
		setShowDetails(false);
	}, [ticket]);

	return (
		<>
			<div>
				<button
					className={clsx("full_button", "sm", "primary")}
					onClick={() => setShowDetails(true)}
				>
					<Icon type="info" size={11} /> Infos
				</button>
				<SlideInRight
					isOpen={showDetails}
					setIsOpen={setShowDetails}
					header="Ticket Details"
					size="small"
				>
					<div>
						<div className={styles.ticket_slidein_content}>
							<label>Beschreibung</label>
							{ticket.description ? (
								<p>{ticket.description}</p>
							) : (
								<p>Keine Beschreibung vorhanden</p>
							)}
						</div>
						<div className={styles.ticket_slidein_content}>
							<label>Objekt</label>
							<p>{ticket?.property?.name}</p>
						</div>
						<div className={styles.ticket_slidein_content}>
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
					<div>
						<div className="button_container">
							<button
								className={clsx("full_button", "sm", "light")}
								disabled={ticket.state !== "closed"}
								onClick={() => setArchiveModal(true)}
							>
								<Icon type="archive" size={11} />
								Archivieren
							</button>
							<button
								className={clsx("full_button", "red", "sm")}
								onClick={() => setDeleteTicketkModal(true)}
							>
								Ticket löschen
							</button>
						</div>
					</div>
				</SlideInRight>
			</div>
			<Modal
				isOpen={archiveModal}
				header="Ticket Archivieren"
				buttonDisabled={[loading, loading]}
				confirmButtonText="Ticket archivieren"
				confirmButtonHandler={async () => {
					setLoading(true);
					setArchiveModal(false);
					await archiveTicket(ticket.objectId);
					await refetch();
					setShowDetails(false);
					setLoading(false);
				}}
				cancelButtonHandler={() => setArchiveModal(false)}
			>
				<p>
					Sie Sie sicher, dass sie das Ticket{" "}
					<span style={{ fontWeight: 600 }}>{ticket.title}</span>{" "}
					archivieren möchten? Dieser Vorgang lässt sich nicht
					rückgängig machen.
				</p>
			</Modal>
			<Modal
				isOpen={deleteTicketModal}
				header="Ticket löschen"
				buttonDisabled={[loading, loading]}
				confirmButtonText="Ticket löschen"
				confirmButtonHandler={() => deleteTicketHandler()}
				cancelButtonHandler={() => setDeleteTicketkModal(false)}
			>
				<p>
					Sie Sie sicher, dass sie das Ticket{" "}
					<span style={{ fontWeight: 600 }}>{ticket.title}</span>{" "}
					löschen möchten? Dieser Vorgang lässt sich nicht rückgängig
					machen.
				</p>
			</Modal>
		</>
	);
};

export default TicketDetails;
