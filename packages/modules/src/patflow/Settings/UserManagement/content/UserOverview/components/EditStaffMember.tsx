import { PatflowAppContext } from "@repo/provider";
import { useDataHandler, useGetData } from "@repo/provider";
import { useCallback, useContext, useState, useEffect } from "react";
import { useImmer } from "use-immer";
import { ErrorMessage } from "@repo/types";
import {
	FileObject,
	FileUploader,
	IconButton,
	Select,
	SlideIn,
	TextInput
} from "@repo/ui";
import "../user_overview.scss";

const EditStaffMember = ({ userId }: { userId: string }) => {
	const [isOpen, setIsOpen] = useState(false);

	const { roles } = useContext(PatflowAppContext);
	const { updateData } = useDataHandler();

	const [errors] = useState([] as unknown as ErrorMessage[]);
	const [staffMember, setStaffMember] = useImmer({
		first_name: "",
		last_name: "",
		email: "",
		role: null,
		portrait: undefined as unknown as FileObject
	});

	const { data: userData, refetch } = useGetData({
		objectName: "User",
		fields: [
			"objectId",
			"first_name",
			"last_name",
			"email",
			"portrait { name url }",
			"role {objectId}"
		],
		id: userId
	});

	useEffect(() => {
		if (userData && !staffMember.first_name) {
			setStaffMember((draft) => {
				draft.first_name = userData.first_name;
				draft.last_name = userData.last_name;
				draft.email = userData.email;
				draft.role = userData.role?.objectId;
				draft.portrait = userData.portrait;
			});
		}
	}, [userData]);

	const updateUser = useCallback(async () => {
		await updateData({
			className: "User",
			objectId: userId,
			updateObject: {
				email: staffMember.email,
				role: {
					__type: "Pointer",
					className: "_Role",
					objectId: staffMember.role
				},
				portrait: staffMember.portrait
			}
		});
		await refetch();
		setIsOpen(false);
	}, [staffMember]);

	return (
		<>
			<IconButton icon="edit" onClick={() => setIsOpen(true)} />
			<SlideIn
				header={`Nutzerdaten aktualisieren (${userData?.first_name} ${userData?.last_name})`}
				isOpen={isOpen}
				cancel={() => setIsOpen(false)}
				confirm={updateUser}
				preventClickOutside
				errors={errors}
			>
				<div className={"user_slidein_container"}>
					<form>
						{staffMember.email && (
							<TextInput
								label="E-Mail"
								id={"email"}
								type="email"
								onChange={(value) =>
									setStaffMember((draft) => {
										draft.email = value;
									})
								}
								defaultValue={staffMember.email}
							/>
						)}
						{staffMember.role && (
							<Select
								label="Rolle auswählen"
								id="role"
								options={roles}
								value={
									staffMember.role &&
									roles &&
									roles.find(
										(roleToFind) =>
											roleToFind.value ===
											staffMember.role
									)
								}
								onChange={(value) =>
									setStaffMember((draft) => {
										draft.role = value.value;
									})
								}
							/>
						)}
						<label>Bild auswählen</label>

						<FileUploader
							inline={true}
							type="image"
							className="User"
							classKey="portrait"
							classId={userId}
						/>
					</form>
				</div>
			</SlideIn>
		</>
	);
};

export default EditStaffMember;
