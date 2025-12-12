import { FC, useState } from "react";
import { IconButton, Modal } from "@repo/ui";
import { useDataHandler } from "@repo/provider";
import { DeleteInvitationProps } from "../types";
import { cloneDeep } from "lodash-es";

const DeleteInvitation: FC<DeleteInvitationProps> = ({
	username,
	email,
	id,
	invitations,
	projectId,
	refetch
}) => {
	const [loading, setLoading] = useState(false);
	const [deleteUserModal, setDeleteUserModal] = useState(false);
	const { updateData } = useDataHandler();

	if (!invitations || invitations.length === 0) return null;

	return (
		<>
			<IconButton
				icon="delete"
				text="Einladung löschen"
				onClick={() => {
					setDeleteUserModal(true);
				}}
			/>
			<Modal
				header="Einladung löschen"
				isOpen={deleteUserModal}
				confirmButtonHandler={async () => {
					setLoading(true);
					const invitationsCopy = cloneDeep(invitations);

					const invitationIndex = invitationsCopy.findIndex(
						(invitation) => invitation.key === id
					);

					if (invitationIndex === -1) {
						setLoading(false);
						setDeleteUserModal(false);
					}

					invitationsCopy.splice(invitationIndex, 1);

					await updateData({
						className: "Project",
						objectId: projectId,
						updateObject: {
							invitations: invitationsCopy
						},
						feedback: "Einladung erfolgreich gelöscht"
					});

					await refetch();
					setLoading(false);
					setDeleteUserModal(false);
				}}
				cancelButtonHandler={() => {
					setDeleteUserModal(false);
				}}
				buttonDisabled={[loading, loading]}
			>
				<p>
					Sind Sie sicher, dass Sie die Einladung für den Nutzer{" "}
					{username} mit der E-Mail Adressse {email} löschen möchten?
				</p>
			</Modal>
		</>
	);
};

export default DeleteInvitation;
