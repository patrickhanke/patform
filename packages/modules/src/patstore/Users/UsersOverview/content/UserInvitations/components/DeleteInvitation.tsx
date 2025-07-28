import { FC, useState } from "react";
import { IconButton, Modal } from "@repo/ui";
import { axiosclient, useDataHandler } from "@repo/provider";
import { DeleteInvitationProps } from "../types";

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
					const invitationIndex = invitations.findIndex(
						(invitation) => invitation.key === id
					);
					invitations.splice(invitationIndex, 1);
					await updateData({
						className: "_Project",
						objectId: projectId,
						updateObject: {
							invitations
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
