import { useMemo } from "react";
import { Select } from "@repo/ui";
import { useQuery } from "@apollo/client";
import { FIND_ALL_TICKETS } from "@repo/provider";
import { SelectOption } from "./types";
import { Ticket } from "@repo/types";

const TicketSelectWithState = ({
  selectedTicket,
  setSelectedTicket,
  label,
  disabled = false,
}: {
  selectedTicket?: SelectOption;
  setSelectedTicket: (W: SelectOption) => void;
  label?: string;
  disabled?: boolean;
}) => {
  const { data: ticketData } = useQuery(FIND_ALL_TICKETS);

  const ticketOptions = useMemo(() => {
    const ticketOptionsArray: SelectOption[] = [];
    if (ticketData) {
      ticketData.objects.findTicket.results.forEach((ticket: Ticket) => {
        if (ticket && !ticket?.task?.objectId) {
          ticketOptionsArray.push({
            value: ticket.objectId,
            id: ticket.objectId,
            label: ticket.title,
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
