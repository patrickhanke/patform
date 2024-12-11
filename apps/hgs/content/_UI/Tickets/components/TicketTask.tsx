import React from 'react';

import styles from '../Tickets.module.scss';
import clsx from 'clsx';
import Link from 'next/link';
import { findTaskRoute } from '@/provider';
import { TicketTaskProps } from '../types';
import { Icon } from '@repo/ui';
import { CreateTask } from '../../Tasks';

const TicketTask = ({ticketId, ticketTask, ticketPropertyId, ticketUserId, refetch, ticketState}:TicketTaskProps ) => {
	const Button = ({onClick}: {onClick: () => void}) => (
		<button onClick={() => onClick()} className={clsx('border_button', 'sm', 'dark')} disabled={ticketState === 'closed'}>
			<Icon type='plus' size={11} />
			<p>Aufgabe hinzufügen</p>
		</button>
	);
	
	return (
		<div className={styles.ticket_task_container} >
			<div className={styles.ticket_subheadline}>
				{ticketTask?.title ? 
					<Link className={styles.ticket_task_content} href={`${findTaskRoute(ticketTask.state)}/?task=${ticketTask.objectId}`}>
						<p className={styles.task_title}>{ticketTask.title}</p> 
						{/* <p>-</p>
						<StateDisplay
							state={ticketTask.state}
							type='Task'
							noBackground
							showIcon
						/> */}
					</Link>
					: 
					<CreateTask refetch={refetch} button={Button} initialData={{ticket: ticketId || '', property: ticketPropertyId, assigned_staff: [ticketUserId]  }} />
				}
			</div>
		</div>
	);
};

export default TicketTask;