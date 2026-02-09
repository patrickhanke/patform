import { useMemo } from "react";
import { Select } from "@repo/ui";
import { useFindData } from "@repo/provider";
import { SelectOption } from "./types";
import { Ticket } from "@repo/types";

const TicketSelectWithState = ({
	selectedTicket,
	setSelectedTicket,
	label,
	disabled = false
}: {
	selectedTicket?: SelectOption;
	setSelectedTicket: (W: SelectOption) => void;
	label?: string;
	disabled?: boolean;
}) => {
	const { data: ticketData } = useFindData({
		objectName: "Ticket",
		fields: [
			"objectId",
			"title",
			"description",
			"state",
			"images",
			"property {objectId name}",
			"task { objectId title }",
			"created_by { objectId username }",
			"createdAt"
		],
		filters: [{ key: "state", value: "closed", operator: "notEqualTo" }]
	});

	const ticketOptions = useMemo(() => {
		const ticketOptionsArray: SelectOption[] = [];
		if (ticketData) {
			ticketData.forEach((ticket: Ticket) => {
				if (ticket && !ticket?.task?.objectId) {
					ticketOptionsArray.push({
						value: ticket.objectId,
						id: ticket.objectId,
						label: ticket.title
					});
				}
			});
		}
		return ticketOptionsArray;
	}, [ticketData]);

	return (
		<div>
			<Select
				label={label || ""}
				id="objects"
				value={selectedTicket}
				options={ticketOptions}
				onChange={(values) => setSelectedTicket(values)}
				isClearable
				width={"100%"}
				isDisabled={disabled}
			/>
		</div>
	);
};

export default TicketSelectWithState;
