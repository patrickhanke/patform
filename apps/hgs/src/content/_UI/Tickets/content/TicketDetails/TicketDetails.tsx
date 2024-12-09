import React, { useState } from 'react';
import styles from './TicketDetails.module.scss';
import { ImageDisplay } from '@/_UI/interfaces/Images';
import Modal from '@/_UI/interfaces/Modal';
import { Icon, SlideIn } from '@/content/_UI';
import clsx from 'clsx';
import { TicketDetailsProps } from '@/types';

const TicketDetails = ({ticket, deleteTicket, archiveTicket} : TicketDetailsProps) => {
	const [archiveModal, setArchiveModal] = useState(false);
	const [deleteTicketModal, setDeleteTicketkModal] = useState(false);
	const [showDetails, setShowDetails] = useState(false);

	return (
		<div>
			<button className={clsx('full_button', 'sm', 'primary')} onClick={() => setShowDetails(true)} >
				<Icon type='info' size={11} /> 
				Details
			</button>
			<SlideIn
				isOpen={showDetails}
				setIsOpen={setShowDetails}
				header='Ticket Details'
				size='small'
			>
				<div className='slidein_container'>
					<div className='slidein_content'>
						<div className={styles.ticket_slidein_content} >
							<label>
									Beschreibung
							</label>
							{ticket.description ?  
								<p>{ticket.description}</p>
								: <p>Keine Beschreibung vorhanden</p>	
							}
						</div>
						<div className={styles.ticket_slidein_content} >
							<label>
									Objekt
							</label>
							<p>{ticket.property.name}</p>
						</div>
						<div className={styles.ticket_slidein_content} >
							<label>
									Bilder
							</label>
							<div className='images_container'>
								{ticket.images && ticket.images.length > 0 ? ticket.images.map((ticketImage: string) =>
									<ImageDisplay image={ticketImage} key={ticketImage} />
								)
									: <p>Kein Bilder hinterlegt </p>
								}
							</div>
						</div>
					</div>
					<div className='slidein_footer' >
						<div className='button_container'>
							<button className={clsx('full_button', 'sm', 'light')} disabled={ticket.state !== 'closed' } onClick={() => setArchiveModal(true)} >
								<Icon type='archive' size={11} /> 
								Archivieren
							</button>
							<button 
								className={clsx('full_button', 'red', 'sm')}
								onClick={() => setDeleteTicketkModal(true)}
							>
								Ticket löschen
							</button>
						</div>
					</div>
					<Modal 
						isOpen={archiveModal}
						header='Ticket Archivieren'
						confirmButtonHandler={() => {
							setArchiveModal(false);
							archiveTicket(ticket.objectId);
							setShowDetails(false);
						}}
						cancelButtonHandler={() => setArchiveModal(false)}
					>
						<p>
							Sie Sie sicher, dass sie das Ticket <span style={{fontWeight: 600}}>{ticket.title}</span> archivieren möchten? Dieser Vorgang lässt sich nicht rückgängig machen.
						</p>
					</Modal>
					<Modal 
						isOpen={deleteTicketModal}
						header='Ticket löschen'
						confirmButtonHandler={() =>{ 
							setDeleteTicketkModal(false);
							deleteTicket(ticket.objectId);
							setShowDetails(false);
						}}
						cancelButtonHandler={() => setDeleteTicketkModal(false)}
					>
						<p>
							Sie Sie sicher, dass sie das Ticket <span style={{fontWeight: 600}}>{ticket.title}</span> löschen möchten? Dieser Vorgang lässt sich nicht rückgängig machen.
						</p>
					</Modal>
				</div>
			</SlideIn>

		</div>
	);
};

export default TicketDetails;