import {
	Divider,
	IconButton,
	SlideIn,
	SwitchButton,
	SwitchButtons
} from "@repo/ui";
import { useState, useEffect } from "react";
import NotificationSettings from "./components/NotificationSettings";
import site_states from "./constants/site_states";
import ContactInformation from "./components/ContactInformations";
import { useDataHandler, useGetData } from "@repo/provider";
import { PatflowUser } from "@repo/types";

const StaffMemberSettings = ({ userId }: { userId: string }) => {
	const [open, setOpen] = useState(false);
	const { updateData } = useDataHandler();
	const [siteState, setSiteState] = useState<SwitchButton>(site_states[0]);
	const [data, setData] = useState<Partial<PatflowUser> | undefined>(
		undefined
	);
	const { data: userData, refetch } = useGetData({
		objectName: "_User",
		fields: [
			"objectId",
			"data",
			"first_name",
			"last_name",
			"notification_settings"
		],
		id: userId
	});

	useEffect(() => {
		if (userData) {
			setData({
				first_name: userData.first_name,
				last_name: userData.last_name,
				data: userData.data,
				notification_settings: userData.notification_settings
			});
		}
	}, [userData]);

	if (!data) {
		return null;
	}

	return (
		<>
			<IconButton icon="edit" onClick={() => setOpen(!open)} />
			<SlideIn
				header="Mitarbeiter Einstellungen"
				isOpen={open}
				cancel={() => setOpen(false)}
				confirm={async () => {
					await updateData({
						className: "_User",
						objectId: userId,
						updateObject: data,
						feedback: "Einstellungen aktualisiert"
					});
					await refetch();

					setOpen(false);
				}}
			>
				<div>
					<SwitchButtons
						changeHandler={(value) => setSiteState(value)}
						currentStates={siteState}
						buttonStates={[...site_states]}
					/>
					<Divider size="medium" showLine={false} />
					{siteState.value === "contact" && (
						<ContactInformation data={data} setData={setData} />
					)}
					{siteState.value === "notification" && (
						<NotificationSettings data={data} setData={setData} />
					)}
				</div>
			</SlideIn>
		</>
	);
};

export default StaffMemberSettings;
