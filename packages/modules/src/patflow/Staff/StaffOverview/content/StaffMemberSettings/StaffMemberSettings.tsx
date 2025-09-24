import {
	Divider,
	IconButton,
	SlideIn,
	SwitchButton,
	SwitchButtons
} from "@repo/ui";
import { useState } from "react";
import NotificationSettings from "./components/NotificationSettings";
import site_states from "./constants/site_states";
import ContactInformation from "./components/ContactInformations";
import { generateGraphQLQuery, useDataHandler } from "@repo/provider";
import { useQuery } from "@apollo/client";
import { PatflowUser } from "@repo/types";

const StaffMemberSettings = ({ userId }: { userId: string }) => {
	const [open, setOpen] = useState(false);
	const { updateData } = useDataHandler();
	const [siteState, setSiteState] = useState<SwitchButton>(site_states[0]);
	const [data, setData] = useState<Partial<PatflowUser> | undefined>(
		undefined
	);
	const { refetch } = useQuery(
		generateGraphQLQuery({
			type: "get",
			objectName: "_User",
			fields: [
				"objectId",
				"data",
				"first_name",
				"last_name",
				"notification_settings"
			]
		}),
		{
			variables: { id: userId },
			onCompleted: (data) => {
				const user = data.objects.get_User;
				setData({
					first_name: user.first_name,
					last_name: user.last_name,
					data: user.data,
					notification_settings: user.notification_settings
				});
			}
		}
	);

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
