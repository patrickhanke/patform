import { ElementSelectInterface } from "@repo/ui";
import { Task, Ticket } from "@repo/types";
import { FC, useMemo } from "react";
import { SelectTicketProps, TicketOption } from "../types";
import { useFindData } from "@repo/provider";

export const DisplayTicket = ({
	title,
	description
}: {
	title: string;
	description: string;
}) => (
	<div>
		<h3>{title}</h3>
		<p>{description}</p>
	</div>
);

const SelectTicket: FC<SelectTicketProps> = ({
	projectId,
	setTask,
	task,
	showTicketOnly = false
}) => {
	const { data: ticketData } = useFindData({
		objectName: "Ticket",
		fields: [
			"objectId",
			"title",
			"description",
			"state",
			"images",
			"property {objectId name}"
		],
		projectId: projectId,
		filters: [
			{
				key: "state",
				value: "closed",
				operator: "notEqualTo",
				id: "state"
			}
		]
	});

	const elements = useMemo(() => {
		const ticketOptionsArray: TicketOption[] = [];
		if (ticketData) {
			ticketData.forEach((ticket: Ticket) => {
				if (ticket && !ticket?.task?.objectId) {
					ticketOptionsArray.push({
						value: ticket.objectId,
						id: ticket.objectId,
						label: ticket.title,
						description: ticket.description,
						header: ticket.property.name,
						element: (
							<DisplayTicket
								title={ticket.title}
								description={ticket.description}
							/>
						)
					});
				}
			});
		}

		ticketOptionsArray.sort((a, b) => a.header?.localeCompare(b.header));
		return ticketOptionsArray;
	}, [ticketData]);

	if (showTicketOnly) {
		const ticket = elements.find((el) => el.value === task.ticket);
		if (!ticket) {
			return null;
		}
		return (
			<DisplayTicket
				title={ticket?.label}
				description={ticket?.description}
			/>
		);
	}

	return (
		<ElementSelectInterface
			title="Ticket auswählen"
			elements={elements}
			isSearchable
			selectedElements={elements.filter((el) => el.value === task.ticket)}
			onSelect={(values) => {
				if (values.length > 0) {
					setTask((task: Task) => ({
						...task,
						ticket: values[0]?.value
					}));
				} else if (values.length === 0 && task.ticket) {
					setTask((task: Task) => ({
						...task,
						ticket: undefined
					}));
				}
			}}
		/>
	);
};

export default SelectTicket;
