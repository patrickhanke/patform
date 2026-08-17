import { Tickets } from "@repo/modules";
import { useState } from "react";
import { Divider, SwitchButtons } from "@repo/ui";
import { ticket_state_options } from "@repo/provider";

const PropertyTickets = ({ id }: { id: string }) => {
	const [pageState, setPageState] =
		useState<(typeof ticket_state_options)[number]["value"]>("open");

	console.log(pageState);
	return (
		<>
			<SwitchButtons
				currentStates={ticket_state_options.find(
					(option) => option.value === pageState
				)}
				changeHandler={(state) =>
					setPageState(
						state.value as (typeof ticket_state_options)[number]["value"]
					)
				}
				buttonStates={ticket_state_options.map((option) => ({
					label: option.label,
					value: option.value
				}))}
			/>
			<Divider />
			<Tickets pageState={pageState} id={id} className="Property" />
		</>
	);
};

export default PropertyTickets;
