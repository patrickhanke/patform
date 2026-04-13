import styles from "../Tickets.module.scss";
import Link from "next/link";
import { findTaskRoute } from "@repo/provider";
import { TicketTaskProps } from "../types";
import { IconButton } from "@repo/ui";
import { CreateTask } from "../../Tasks";

const TicketTask = ({
	ticketId,
	ticketTask,
	ticketPropertyId,
	ticketUserId,
	ticketState
}: TicketTaskProps) => {
	const Button = ({ onClick }: { onClick: () => void }) => (
		<IconButton
			onClick={() => onClick()}
			disabled={ticketState === "closed"}
			icon="plus"
			text="Aufgabe hinzufügen"
		/>
	);

	return (
		<div className={styles.ticket_task_container}>
			<div className={styles.ticket_subheadline}>
				{ticketTask?.title ? (
					<Link
						className={styles.ticket_task_content}
						href={`${findTaskRoute(ticketTask.state)}/?task=${ticketTask.objectId}`}
					>
						<p className={styles.task_title}>{ticketTask.title}</p>
						{/* <p>-</p>
						<StateSelect
							state={ticketTask.state}
							type='Task'
							noBackground
							showIcon
						/> */}
					</Link>
				) : (
					<CreateTask
						button={Button}
						initialData={{
							ticket: ticketId || "",
							property: ticketPropertyId,
							assigned_staff: [ticketUserId]
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default TicketTask;
