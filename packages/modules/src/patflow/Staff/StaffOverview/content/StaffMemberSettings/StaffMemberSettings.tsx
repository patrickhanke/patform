import {
	Divider,
	IconButton,
	SlideIn,
	SwitchButton,
	SwitchButtons
} from "@repo/ui";
import { useState, useCallback } from "react";
import site_states from "./constants/site_states";
import ContactInformation from "./components/ContactInformations";
import { useDataHandler } from "@repo/provider";
import { ApolloRefetch, PatflowUser } from "@repo/types";

const StaffMemberSettings = ({
	userId,
	initialData,
	refetch
}: {
	userId: string;
	initialData: PatflowUser["data"];
	refetch: ApolloRefetch;
}) => {
	const [open, setOpen] = useState(false);
	const { updateData } = useDataHandler();
	const [siteState, setSiteState] = useState<SwitchButton>(site_states[0]);
	const [data, setData] = useState<PatflowUser["data"]>(initialData);
	console.log({ initialData });
	console.log({ data });

	const updateUser = useCallback(async () => {
		if (!data) return;

		await updateData({
			className: "_User",
			objectId: userId,
			updateObject: data,
			feedback: "Einstellungen aktualisiert"
		});
		await refetch();
		setOpen(false);
	}, [data, userId, updateData]);

	return (
		<>
			<IconButton icon="edit" onClick={() => setOpen(!open)} />
			<SlideIn
				header="Mitarbeiter Einstellungen"
				isOpen={open}
				cancel={() => setOpen(false)}
				confirm={updateUser}
			>
				<div>
					{/* <SwitchButtons
						changeHandler={(value) => setSiteState(value)}
						currentStates={siteState}
						buttonStates={[...site_states]}
					/> */}
					<Divider size="medium" showLine={false} />
					{siteState.value === "contact" && (
						<ContactInformation
							data={data || initialData}
							setData={setData}
						/>
					)}
					{/* {siteState.value === "notification" && (
						<NotificationSettings data={data} setData={setData} />
					)} */}
				</div>
			</SlideIn>
		</>
	);
};

export default StaffMemberSettings;
