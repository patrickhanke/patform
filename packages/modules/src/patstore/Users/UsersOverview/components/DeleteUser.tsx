import { FC, useState } from "react";
import { IconButton, Modal } from "@repo/ui";
import { axiosclient, useDataHandler } from "@repo/provider";
import { DeleteUserProps } from "../types";

const DeleteUser: FC<DeleteUserProps> = ({
	userId,
	username,
	email,
	refetch
}) => {
	const [loading, setLoading] = useState(false);
	const [deleteUserModal, setDeleteUserModal] = useState(false);
	const { deleteData } = useDataHandler();

	return (
		<>
			<IconButton
				icon="delete"
				text="Benutzer löschen"
				onClick={() => {
					setDeleteUserModal(true);
				}}
			/>
			<Modal
				header="Benutzer löschen"
				isOpen={deleteUserModal}
				confirmButtonHandler={async () => {
					setLoading(true);
					await axiosclient().post("functions/delete_user", {
						user_id: userId
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
					Sind Sie sicher, dass Sie den Benutzer {username} mit der
					E-Mail Adressse {email} löschen möchten?
				</p>
			</Modal>
		</>
	);
};

export default DeleteUser;
