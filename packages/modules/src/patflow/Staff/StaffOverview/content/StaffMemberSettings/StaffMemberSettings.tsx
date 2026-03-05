import { Divider, IconButton, SlideIn, SwitchButton } from "@repo/ui";
import { useState, useCallback, FC } from "react";
import site_states from "./constants/site_states";
import ContactInformation from "./components/ContactInformations";
import { useDataHandler } from "@repo/provider";
import { StaffMemberData, StaffMemberSettingsProps } from "./types";

const StaffMemberSettings: FC<StaffMemberSettingsProps> = ({
	initialData,
	userId,
	refetch
}) => {
	const [open, setOpen] = useState(false);
	const { updateData } = useDataHandler();
	const [siteState] = useState<SwitchButton>(site_states[0]);
	const [data, setData] = useState<StaffMemberData>(initialData);

	const updateUser = useCallback(async () => {
		if (!data) return;

		await updateData({
			className: "User",
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
				header="Mitarbeiter Kontaktinformationen"
				isOpen={open}
				cancel={() => setOpen(false)}
				confirm={updateUser}
			>
				<div>
					<Divider size="medium" showLine={false} />
					{siteState.value === "contact" && (
						<ContactInformation
							data={initialData}
							setData={setData}
						/>
					)}
				</div>
			</SlideIn>
		</>
	);
};

export default StaffMemberSettings;
