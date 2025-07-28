import { FC, useState } from "react";
import { IconButton, Modal } from "@repo/ui";
import { axiosclient } from "@repo/provider";
import { SendInvitationProps } from "../types";

const SendInvitation: FC<SendInvitationProps> = ({
	username,
	email,
	projectId,
	refetch
}) => {
	const [loading, setLoading] = useState(false);
	const [invitationModal, setInvitationModal] = useState(false);

	return (
		<>
			<IconButton
				icon="link"
				text="Einladung erneut senden"
				onClick={() => {
					setInvitationModal(true);
				}}
			/>
			<Modal
				header="Einladung löschen"
				isOpen={invitationModal}
				confirmButtonHandler={async () => {
					setLoading(true);
					axiosclient().post("/functions/send-user-invitation", {
						email: email,
						name: username,
						project_id: projectId,
						initial_invitation: false
					});

					await refetch();
					setLoading(false);
					setInvitationModal(false);
				}}
				cancelButtonHandler={() => {
					setInvitationModal(false);
				}}
				buttonDisabled={[loading, loading]}
			>
				<p>Wollen Sie dem Nutzer {username} eine Einladung senden?</p>
			</Modal>
		</>
	);
};

export default SendInvitation;
